import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useProductsStore } from '@/store/productsStore';
import { useCartStore } from '@/store/cartStore';
import { Header } from '@/components/Header';
import { CartSheet } from '@/components/CartSheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OrderForm } from '@/components/OrderForm';

const categories = ['Все', 'Аудио', 'Носимые', 'Компьютеры', 'Аксессуары', 'Комплектующие'];

export default function Catalog() {
  const navigate = useNavigate();
  const { products } = useProductsStore();
  const { 
    cart, 
    wishlist,
    addToCart, 
    removeFromCart, 
    clearCart, 
    isInCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const [wishlistSheetOpen, setWishlistSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const { toast } = useToast();

  const filteredAndSortedProducts = products
    .filter((p) => {
      const categoryMatch = selectedCategory === 'Все' || p.category === selectedCategory;
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const cartProducts = products.filter((p) => cart.includes(p.id));
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (productId: number) => {
    addToCart(productId);
    toast({
      title: 'Добавлено в корзину',
      description: 'Товар успешно добавлен',
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
    toast({
      title: 'Удалено из корзины',
      description: 'Товар удален из корзины',
    });
  };

  const handleToggleWishlist = (productId: number) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      toast({
        title: 'Удалено из избранного',
      });
    } else {
      addToWishlist(productId);
      toast({
        title: 'Добавлено в избранное',
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        onCartClick={() => setCartSheetOpen(true)}
        onWishlistClick={() => setWishlistSheetOpen(true)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Каталог товаров</h1>
          <p className="text-muted-foreground text-lg">Выберите лучшие гаджеты для вашей жизни</p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">По умолчанию</SelectItem>
              <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
              <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
              <SelectItem value="name">По названию</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              size="sm"
            >
              {cat}
            </Button>
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-primary/10 rounded-full">
                <Icon name="Package" size={64} className="text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 gradient-text">
              {searchQuery ? 'Ничего не найдено' : 'Каталог пуст'}
            </h3>
            <p className="text-muted-foreground text-lg">
              {searchQuery 
                ? 'Попробуйте изменить запрос или фильтры' 
                : 'Товары появятся здесь после добавления администратором'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:card-glow transition-all duration-300 hover:scale-105 animate-fade-in bg-card/80 backdrop-blur-sm border-2 border-primary/20"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <Button
                      size="icon"
                      variant={isInWishlist(product.id) ? 'default' : 'secondary'}
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product.id);
                      }}
                    >
                      <Icon 
                        name="Heart" 
                        size={18}
                        fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                      />
                    </Button>
                    {!product.inStock && (
                      <Badge className="absolute top-2 left-2 bg-destructive">
                        Нет в наличии
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">{product.category}</Badge>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-3xl font-bold gradient-text">{product.price.toLocaleString()} ₽</p>
                  </CardContent>
                </div>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  {isInCart(product.id) ? (
                    <>
                      <Button
                        variant="secondary"
                        className="flex-1 gap-2"
                        onClick={() => handleRemoveFromCart(product.id)}
                      >
                        <Icon name="Trash2" size={18} />
                        Удалить
                      </Button>
                      <Button
                        className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary"
                        onClick={() => setSelectedProduct(product)}
                        disabled={!product.inStock}
                      >
                        <Icon name="ShoppingBag" size={18} />
                        Купить
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full gap-2"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.inStock}
                    >
                      <Icon name="ShoppingCart" size={18} />
                      В корзину
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CartSheet
        open={cartSheetOpen}
        onOpenChange={setCartSheetOpen}
        cartItems={cartProducts}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={(product) => {
          setSelectedProduct(product);
          setCartSheetOpen(false);
        }}
        onClearCart={() => {
          clearCart();
          toast({ title: 'Корзина очищена' });
        }}
      />

      <CartSheet
        open={wishlistSheetOpen}
        onOpenChange={setWishlistSheetOpen}
        cartItems={wishlistProducts}
        onRemoveItem={(id) => {
          removeFromWishlist(id);
          toast({ title: 'Удалено из избранного' });
        }}
        onCheckout={(product) => {
          setSelectedProduct(product);
          setWishlistSheetOpen(false);
        }}
        onClearCart={() => {}}
      />

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <OrderForm
              product={{
                id: String(selectedProduct.id),
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
              }}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
