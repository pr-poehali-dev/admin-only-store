import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useProductsStore } from '@/store/productsStore';

const categories = ['Все', 'Аудио', 'Носимые', 'Компьютеры', 'Аксессуары', 'Комплектующие'];

export default function Catalog() {
  const { products } = useProductsStore();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [cart, setCart] = useState<number[]>([]);
  const { toast } = useToast();

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
    toast({
      title: 'Добавлено в корзину',
      description: 'Товар успешно добавлен',
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(id => id !== productId));
    toast({
      title: 'Удалено из корзины',
      description: 'Товар удален из корзины',
    });
  };

  const isInCart = (productId: number) => cart.includes(productId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Каталог товаров</h1>
          <p className="text-muted-foreground text-lg">Выберите лучшие гаджеты для вашей жизни</p>
        </div>

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className="transition-all hover:scale-105"
              >
                {cat}
              </Button>
            ))}
          </div>

          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => {
              if (cart.length === 0) {
                toast({
                  title: 'Корзина пуста',
                  description: 'Добавьте товары для оформления заказа',
                  variant: 'destructive',
                });
              }
            }}
          >
            <Icon name="ShoppingCart" size={20} />
            Корзина ({cart.length})
          </Button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-primary/10 rounded-full">
                <Icon name="Package" size={64} className="text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 gradient-text">Каталог пуст</h3>
            <p className="text-muted-foreground text-lg">
              Товары появятся здесь после добавления администратором
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:card-glow transition-all duration-300 hover:scale-105 animate-fade-in bg-card/80 backdrop-blur-sm border-2 border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {!product.inStock && (
                      <Badge className="absolute top-2 right-2 bg-destructive">
                        Нет в наличии
                      </Badge>
                    )}
                    {product.inStock && (
                      <Badge className="absolute top-2 right-2 bg-secondary">
                        В наличии
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">{product.category}</Badge>
                  <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                  <p className="text-3xl font-bold gradient-text">{product.price.toLocaleString()} ₽</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  {isInCart(product.id) ? (
                    <>
                      <Button
                        variant="secondary"
                        className="flex-1 gap-2"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Icon name="Trash2" size={18} />
                        Удалить
                      </Button>
                      <Button
                        className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary"
                        onClick={() => window.open(product.vkLink, '_blank')}
                      >
                        <Icon name="ExternalLink" size={18} />
                        Купить в VK
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full gap-2"
                      onClick={() => addToCart(product.id)}
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
    </div>
  );
}