import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface OrderFormProps {
  product: Product;
  onClose: () => void;
}

export function OrderForm({ product, onClose }: OrderFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryMethod: 'pickup',
    paymentMethod: 'cash',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [orderNumber, setOrderNumber] = useState('');

  const deliveryPrice = formData.deliveryMethod === 'delivery' ? 300 : 0;
  const totalPrice = product.price + deliveryPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://functions.poehali.dev/2e7598d3-362a-41f8-b2a6-4ea9678435d6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          customer: formData,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки заказа');
      }

      setOrderNumber(data.orderNumber);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Ошибка:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Оформление заказа</h2>
          <p className="text-muted-foreground mt-1">Заполните форму для оформления заказа</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Icon name="X" size={20} />
        </Button>
      </div>

      <div className="bg-muted rounded-lg p-4 mb-6 flex gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-lg font-bold text-primary mt-1">{product.price} ₽</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Контактные данные</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введите ваше имя"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@mail.com"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Способ доставки</h3>
          
          <RadioGroup
            value={formData.deliveryMethod}
            onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Icon name="Store" size={20} />
                  <div>
                    <div className="font-medium">Самовывоз</div>
                    <div className="text-sm text-muted-foreground">Бесплатно</div>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="delivery" id="delivery" />
              <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Icon name="Truck" size={20} />
                  <div>
                    <div className="font-medium">Доставка</div>
                    <div className="text-sm text-muted-foreground">300 ₽</div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {formData.deliveryMethod === 'delivery' && (
            <div className="grid gap-2">
              <Label htmlFor="address">Адрес доставки *</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Улица, дом, квартира"
                rows={3}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Способ оплаты</h3>
          
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Icon name="Banknote" size={20} />
                  <div className="font-medium">Наличными при получении</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Icon name="CreditCard" size={20} />
                  <div className="font-medium">Картой при получении</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Icon name="Smartphone" size={20} />
                  <div className="font-medium">Онлайн оплата (СБП)</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="comment">Комментарий к заказу</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Дополнительная информация"
            rows={3}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span>Товар:</span>
            <span className="font-semibold">{product.price} ₽</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Доставка:</span>
            <span className="font-semibold">{deliveryPrice} ₽</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
            <span>Итого:</span>
            <span className="text-primary">{totalPrice} ₽</span>
          </div>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="CheckCircle" size={20} />
              <span className="font-semibold">Заказ #{orderNumber} успешно оформлен!</span>
            </div>
            <p className="text-sm mb-4">Вы можете общаться с продавцом в личном чате по вашему заказу</p>
            <Button
              type="button"
              onClick={() => navigate(`/order-chat?order=${orderNumber}`)}
              className="w-full"
            >
              <Icon name="MessageSquare" size={20} className="mr-2" />
              Открыть чат с продавцом
            </Button>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center gap-2">
            <Icon name="AlertCircle" size={20} />
            <span>Ошибка при оформлении заказа. Попробуйте еще раз.</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                Оформление...
              </>
            ) : (
              'Оформить заказ'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}