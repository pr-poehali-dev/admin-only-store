import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  showAbout?: () => void;
  showContacts?: () => void;
}

export function Header({ cartCount = 0, wishlistCount = 0, onCartClick, onWishlistClick, showAbout, showContacts }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: 'Главная', path: '/', icon: 'Home' },
    { label: 'Каталог', path: '/catalog', icon: 'ShoppingBag' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-card/80 border-b border-primary/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="text-2xl font-bold gradient-text neon-glow cursor-pointer"
            onClick={() => navigate('/')}
          >
            Mister_gadjet
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'default' : 'ghost'}
                onClick={() => navigate(item.path)}
                className="gap-2"
              >
                <Icon name={item.icon as any} size={18} />
                {item.label}
              </Button>
            ))}
            {showAbout && (
              <Button variant="ghost" onClick={showAbout}>
                О магазине
              </Button>
            )}
            {showContacts && (
              <Button variant="ghost" onClick={showContacts}>
                Контакты
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {onWishlistClick && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:flex"
                onClick={onWishlistClick}
              >
                <Icon name="Heart" size={20} />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            )}
            
            {onCartClick && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:flex"
                onClick={onCartClick}
              >
                <Icon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="text-2xl font-bold gradient-text mb-4">Меню</div>
                  
                  {menuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? 'default' : 'ghost'}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start gap-2 w-full"
                    >
                      <Icon name={item.icon as any} size={18} />
                      {item.label}
                    </Button>
                  ))}

                  {showAbout && (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        showAbout();
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start w-full"
                    >
                      О магазине
                    </Button>
                  )}

                  {showContacts && (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        showContacts();
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start w-full"
                    >
                      Контакты
                    </Button>
                  )}

                  <div className="border-t pt-4 mt-4">
                    {onWishlistClick && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onWishlistClick();
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start gap-2 w-full"
                      >
                        <Icon name="Heart" size={18} />
                        Избранное
                        {wishlistCount > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {wishlistCount}
                          </Badge>
                        )}
                      </Button>
                    )}
                    
                    {onCartClick && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onCartClick();
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start gap-2 w-full"
                      >
                        <Icon name="ShoppingCart" size={18} />
                        Корзина
                        {cartCount > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {cartCount}
                          </Badge>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
