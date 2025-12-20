import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useProductsStore } from '@/store/productsStore';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { OrderForm } from '@/components/OrderForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductsStore();
  const { addToCart, isInCart, addToWishlist, removeFromWishlist, isInWishlist } = useCartStore();
  const { toast } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(false);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Icon name="PackageX" size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
          <Button onClick={() => navigate('/catalog')}>
            Вернуться в каталог
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id);
    toast({
      title: 'Добавлено в корзину',
      description: product.name,
    });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: 'Удалено из избранного',
        description: product.name,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: 'Добавлено в избранное',
        description: product.name,
      });
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/catalog')}
          className="mb-6 gap-2"
        >
          <Icon name="ArrowLeft" size={18} />
          Назад в каталог
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/20">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <Badge className="absolute top-4 right-4 bg-destructive">
                Нет в наличии
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4 gradient-text">
                {product.name}
              </h1>
              <div className="text-4xl font-bold text-primary mb-4">
                {product.price.toLocaleString()} ₽
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => setShowOrderForm(true)}
                  disabled={!product.inStock}
                >
                  <Icon name="ShoppingBag" size={20} />
                  Купить сейчас
                </Button>
                <Button
                  size="lg"
                  variant={isInWishlist(product.id) ? 'default' : 'outline'}
                  onClick={handleToggleWishlist}
                >
                  <Icon 
                    name="Heart" 
                    size={20} 
                    fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                  />
                </Button>
              </div>

              {!isInCart(product.id) && (
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <Icon name="ShoppingCart" size={20} />
                  Добавить в корзину
                </Button>
              )}
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="Truck" size={20} className="text-primary" />
                  <div>
                    <div className="font-semibold">Быстрая доставка</div>
                    <div className="text-sm text-muted-foreground">
                      Доставка по России от 280 ₽
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Icon name="Shield" size={20} className="text-primary" />
                  <div>
                    <div className="font-semibold">Гарантия качества</div>
                    <div className="text-sm text-muted-foreground">
                      Официальная гарантия производителя
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Icon name="RotateCcw" size={20} className="text-primary" />
                  <div>
                    <div className="font-semibold">Возврат 14 дней</div>
                    <div className="text-sm text-muted-foreground">
                      Легкий возврат без лишних вопросов
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specs">Характеристики</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="space-y-4 py-6">
            <h3 className="text-2xl font-bold">Описание товара</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.name} — это современное устройство, которое сочетает в себе 
              передовые технологии и стильный дизайн. Идеально подходит для повседневного 
              использования и станет отличным дополнением к вашей технике.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Высокое качество материалов и внимание к деталям делают этот продукт 
              надежным выбором для тех, кто ценит комфорт и функциональность.
            </p>
          </TabsContent>
          <TabsContent value="specs" className="py-6">
            <h3 className="text-2xl font-bold mb-4">Технические характеристики</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Категория</span>
                <span className="font-semibold">{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Наличие</span>
                <Badge variant={product.inStock ? 'default' : 'destructive'}>
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Гарантия</span>
                <span className="font-semibold">12 месяцев</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Страна производитель</span>
                <span className="font-semibold">Китай</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Похожие товары</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:card-glow transition-all hover:scale-105"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {item.category}
                    </Badge>
                    <h4 className="font-semibold mb-2">{item.name}</h4>
                    <div className="text-xl font-bold text-primary">
                      {item.price.toLocaleString()} ₽
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <OrderForm
            product={{
              id: String(product.id),
              name: product.name,
              price: product.price,
              image: product.image,
            }}
            onClose={() => setShowOrderForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
