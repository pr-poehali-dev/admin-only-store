import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Product } from '@/store/productsStore';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: Product[];
  onRemoveItem: (productId: number) => void;
  onCheckout: (product: Product) => void;
  onClearCart: () => void;
}

export function CartSheet({ 
  open, 
  onOpenChange, 
  cartItems, 
  onRemoveItem, 
  onCheckout,
  onClearCart 
}: CartSheetProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon name="ShoppingCart" size={24} />
            Корзина
            {cartItems.length > 0 && (
              <Badge variant="secondary">{cartItems.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="p-6 bg-muted rounded-full mb-4">
              <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Корзина пуста</h3>
            <p className="text-muted-foreground mb-6">
              Добавьте товары в корзину для оформления заказа
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{item.name}</h4>
                    <Badge variant="outline" className="mt-1">
                      {item.category}
                    </Badge>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-primary">
                        {item.price.toLocaleString()} ₽
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onCheckout(item)}
                          disabled={!item.inStock}
                        >
                          <Icon name="ShoppingBag" size={14} className="mr-1" />
                          Купить
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <SheetFooter className="flex-col space-y-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Итого:</span>
                  <span className="text-primary">{totalPrice.toLocaleString()} ₽</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {cartItems.length} {cartItems.length === 1 ? 'товар' : 'товара'} в корзине
                </p>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={onClearCart}
              >
                <Icon name="Trash2" size={18} className="mr-2" />
                Очистить корзину
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
