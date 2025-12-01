import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12 backdrop-blur-sm bg-card/30 p-4 rounded-lg border border-primary/20">
          <h1 className="text-3xl font-bold gradient-text neon-glow">Mister_gadget</h1>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>Главная</Button>
            <Button variant="ghost" onClick={() => navigate('/catalog')}>Каталог</Button>
            <Button variant="ghost" onClick={() => navigate('/admin')}>Админ</Button>
            <Button variant="ghost">О магазине</Button>
            <Button variant="ghost">Контакты</Button>
            <Button variant="ghost">FAQ</Button>
          </nav>
        </header>

        <section className="text-center mb-16 animate-fade-in">
          <h2 className="text-6xl font-bold mb-6 gradient-text neon-glow">
            Будущее гаджетов уже здесь
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Откройте для себя мир современных технологий с Mister_gadget. 
            Качественные гаджеты по доступным ценам.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="gap-2 text-lg bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
              onClick={() => navigate('/catalog')}
            >
              <Icon name="ShoppingBag" size={24} />
              Перейти в каталог
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 text-lg hover:scale-105 transition-transform"
            >
              <Icon name="Info" size={24} />
              Узнать больше
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-4xl font-bold text-center mb-8 gradient-text">Почему выбирают нас?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:card-glow transition-all hover:scale-105 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-primary/20 rounded-full">
                    <Icon name="Zap" size={48} className="text-primary" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-2">Быстрая доставка</h4>
                <p className="text-muted-foreground">Доставим ваш заказ в кратчайшие сроки</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:card-glow transition-all hover:scale-105 bg-card/80 backdrop-blur-sm border-2 border-secondary/20">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-secondary/20 rounded-full">
                    <Icon name="Shield" size={48} className="text-secondary" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-2">Гарантия качества</h4>
                <p className="text-muted-foreground">Только оригинальная продукция</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:card-glow transition-all hover:scale-105 bg-card/80 backdrop-blur-sm border-2 border-accent/20">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-accent/20 rounded-full">
                    <Icon name="DollarSign" size={48} className="text-accent" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-2">Лучшие цены</h4>
                <p className="text-muted-foreground">Конкурентные цены на все товары</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-4xl font-bold text-center mb-8 gradient-text">Популярные категории</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Наушники', 'Смарт-часы', 'Колонки', 'Аксессуары'].map((category, index) => (
              <Button
                key={category}
                variant="outline"
                size="lg"
                className="h-24 text-lg hover:card-glow transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate('/catalog')}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        <footer className="text-center py-8 border-t border-primary/20">
          <p className="text-muted-foreground">© 2024 Mister_gadget. Все права защищены.</p>
        </footer>
      </div>
    </div>
  );
}