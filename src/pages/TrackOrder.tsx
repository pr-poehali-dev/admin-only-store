import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Header } from '@/components/Header';
import { useNavigate } from 'react-router-dom';

export default function TrackOrder() {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('Введите номер заказа');
      return;
    }

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(
        `https://functions.poehali.dev/f86a23e1-b8e0-4c3a-b15e-d39cbf7b35e4?orderNumber=${orderNumber}`
      );
      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
      } else {
        setError('Заказ не найден');
      }
    } catch (err) {
      setError('Ошибка при поиске заказа');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'new':
        return { label: 'Новый', icon: 'Clock', color: 'default' };
      case 'processing':
        return { label: 'В обработке', icon: 'Package', color: 'secondary' };
      case 'completed':
        return { label: 'Выполнен', icon: 'CheckCircle', color: 'default' };
      default:
        return { label: status, icon: 'Info', color: 'secondary' };
    }
  };

  const statusInfo = order ? getStatusInfo(order.status) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Отследить заказ</h1>
            <p className="text-muted-foreground">
              Введите номер заказа для проверки статуса
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orderNumber">Номер заказа</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="orderNumber"
                      placeholder="Например: ORD-123456"
                      value={orderNumber}
                      onChange={(e) => {
                        setOrderNumber(e.target.value);
                        setError('');
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? (
                        <Icon name="Loader2" size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Icon name="Search" size={18} className="mr-2" />
                          Найти
                        </>
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {order && (
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Заказ #{order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Badge variant={statusInfo?.color as any} className="gap-2">
                    <Icon name={statusInfo?.icon as any} size={16} />
                    {statusInfo?.label}
                  </Badge>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Информация о товаре</h3>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Icon name="Package" size={40} className="text-primary" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{order.productName}</h4>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {order.totalPrice} ₽
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Контактная информация</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icon name="User" size={18} className="text-muted-foreground" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Phone" size={18} className="text-muted-foreground" />
                      <span>{order.customerPhone}</span>
                    </div>
                    {order.customerEmail && (
                      <div className="flex items-center gap-3">
                        <Icon name="Mail" size={18} className="text-muted-foreground" />
                        <span>{order.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Доставка</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icon name="Truck" size={18} className="text-muted-foreground" />
                      <span>
                        {order.deliveryMethod === 'pickup' 
                          ? 'Самовывоз' 
                          : `Доставка${order.deliveryCompany ? ` — ${order.deliveryCompany}` : ''}`}
                      </span>
                    </div>
                    {order.deliveryAddress && (
                      <div className="flex items-start gap-3">
                        <Icon name="MapPin" size={18} className="text-muted-foreground mt-1" />
                        <span className="text-sm">{order.deliveryAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <Button 
                  className="w-full gap-2"
                  onClick={() => navigate(`/order-chat?order=${order.orderNumber}`)}
                >
                  <Icon name="MessageSquare" size={18} />
                  Открыть чат с поддержкой
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
