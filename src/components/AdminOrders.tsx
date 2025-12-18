import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Order {
  id: number;
  orderNumber: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  messageCount: number;
}

export function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/89d1cfc3-079c-4953-b6b0-8314c184f2b6');
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Загрузка заказов...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Icon name="ShoppingBag" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-2xl font-bold mb-2">Пока нет заказов</h3>
        <p className="text-muted-foreground">Заказы от клиентов появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Заказы клиентов ({orders.length})</h2>
      
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  Заказ #{order.orderNumber}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(order.createdAt).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Badge variant={order.status === 'new' ? 'default' : 'secondary'}>
                {order.status === 'new' ? 'Новый' : order.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Icon name="Package" size={16} className="text-muted-foreground" />
                <span className="font-semibold">{order.productName}</span>
                <span className="ml-auto font-bold text-primary">{order.totalPrice} ₽</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon name="User" size={16} className="text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon name="Phone" size={16} className="text-muted-foreground" />
                <span>{order.customerPhone}</span>
              </div>
              
              {order.customerEmail && (
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} className="text-muted-foreground" />
                  <span>{order.customerEmail}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 pt-2 border-t mt-2">
                <Button
                  onClick={() => navigate(`/order-chat?order=${order.orderNumber}`)}
                  className="flex-1"
                  variant={order.messageCount > 0 ? 'default' : 'outline'}
                >
                  <Icon name="MessageSquare" size={16} className="mr-2" />
                  Чат с клиентом
                  {order.messageCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {order.messageCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
