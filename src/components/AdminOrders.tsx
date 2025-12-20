import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Order {
  id: number;
  orderNumber: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethod: string;
  deliveryCompany?: string;
  deliveryAddress?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  messageCount: number;
}

const getDeliveryCompanyName = (company: string) => {
  const companies: Record<string, string> = {
    'cdek': 'СДЭК',
    'boxberry': 'Boxberry',
    'pochta': 'Почта России',
    'dpd': 'DPD',
    'yandex': 'Яндекс Доставка',
    'none': 'Своя служба доставки'
  };
  return companies[company] || company;
};

export function AdminOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadOrders = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/6f5787b2-adbd-43f7-999d-1a161c5022b9');
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

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/6f5787b2-adbd-43f7-999d-1a161c5022b9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast({
          title: 'Статус обновлён',
          description: 'Статус заказа успешно изменён',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус',
        variant: 'destructive',
      });
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

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const orderCounts = {
    all: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Заказы клиентов ({orders.length})</h2>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            Все ({orderCounts.all})
          </Button>
          <Button
            variant={statusFilter === 'new' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('new')}
            size="sm"
          >
            <Icon name="Clock" size={16} className="mr-1" />
            Новые ({orderCounts.new})
          </Button>
          <Button
            variant={statusFilter === 'processing' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('processing')}
            size="sm"
          >
            <Icon name="Package" size={16} className="mr-1" />
            В обработке ({orderCounts.processing})
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('completed')}
            size="sm"
          >
            <Icon name="CheckCircle" size={16} className="mr-1" />
            Выполнено ({orderCounts.completed})
          </Button>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Нет заказов с таким статусом</p>
        </div>
      ) : (
        filteredOrders.map((order) => (
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
              <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={14} />
                      Новый
                    </div>
                  </SelectItem>
                  <SelectItem value="processing">
                    <div className="flex items-center gap-2">
                      <Icon name="Package" size={14} />
                      В обработке
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <Icon name="CheckCircle" size={14} />
                      Выполнен
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
              
              <div className="flex items-center gap-2">
                <Icon name="Truck" size={16} className="text-muted-foreground" />
                <span>
                  {order.deliveryMethod === 'pickup' ? 'Самовывоз' : `Доставка${order.deliveryCompany ? ` — ${getDeliveryCompanyName(order.deliveryCompany)}` : ''}`}
                </span>
              </div>
              
              {order.deliveryAddress && (
                <div className="flex items-start gap-2">
                  <Icon name="MapPin" size={16} className="text-muted-foreground mt-1" />
                  <span className="text-sm">{order.deliveryAddress}</span>
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
        ))
      )}
    </div>
  );
}