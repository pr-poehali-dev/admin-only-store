import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Message {
  sender: 'customer' | 'admin';
  text: string;
  timestamp: string;
}

interface OrderInfo {
  number: string;
  productName: string;
  customerName: string;
  status: string;
}

export default function OrderChat() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || '';
  
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!orderNumber) {
      setError('Номер заказа не указан');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://functions.poehali.dev/86355b50-dc65-4c7d-b4b1-f0d4727f082d?orderNumber=${orderNumber}`
      );
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки чата');
      }

      setOrderInfo(data.order);
      setMessages(data.messages);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Заказ не найден');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    const messageText = inputValue;
    setInputValue('');

    try {
      const response = await fetch('https://functions.poehali.dev/86355b50-dc65-4c7d-b4b1-f0d4727f082d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          message: messageText,
          sender: 'customer',
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки сообщения');
      }

      await loadMessages();
    } catch (err) {
      setInputValue(messageText);
      setError('Не удалось отправить сообщение');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Загрузка чата...</p>
        </div>
      </div>
    );
  }

  if (error && !orderInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Заказ не найден</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/catalog">
            <Button>Вернуться в каталог</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        <Card className="mb-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Чат по заказу #{orderInfo?.number}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {orderInfo?.productName} • {orderInfo?.customerName}
              </p>
            </div>
            <Link to="/catalog">
              <Button variant="outline" size="sm">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Каталог
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Пока нет сообщений. Напишите первым!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.sender === 'customer'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'customer'
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            {error && (
              <div className="mb-2 p-2 bg-destructive/10 text-destructive text-sm rounded">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Напишите сообщение..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={isSending} size="icon">
                {isSending ? (
                  <Icon name="Loader2" size={20} className="animate-spin" />
                ) : (
                  <Icon name="Send" size={20} />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
