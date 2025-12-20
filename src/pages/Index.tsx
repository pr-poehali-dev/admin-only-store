import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Index() {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12 backdrop-blur-sm bg-card/30 p-4 rounded-lg border border-primary/20">
          <h1 className="text-3xl font-bold gradient-text neon-glow">Mister_gadjet</h1>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>Главная</Button>
            <Button variant="ghost" onClick={() => navigate('/catalog')}>Каталог</Button>
            <Button variant="ghost" onClick={() => navigate('/admin')}>Админ</Button>
            <Button variant="ghost" onClick={() => setShowAbout(true)}>О магазине</Button>
            <Button variant="ghost" onClick={() => setShowContacts(true)}>Контакты</Button>
          </nav>
        </header>

        <section className="text-center mb-16 animate-fade-in">
          <h2 className="text-6xl font-bold mb-6 gradient-text neon-glow">
            Будущее гаджетов уже здесь
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Откройте для себя мир современных технологий с Mister_gadjet. 
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

        <footer className="py-8 border-t border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-lg mb-3 gradient-text">Mister_gadjet</h4>
              <p className="text-sm text-muted-foreground">
                Будущее гаджетов уже здесь
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-3">Контакты</h4>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Icon name="Phone" size={18} className="text-primary" />
                <a href="tel:89066664087" className="hover:text-primary transition-colors">
                  8 (906) 666-40-87
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Ежедневно с 9:00 до 21:00</p>
            </div>
            
            <div className="text-center md:text-right">
              <h4 className="font-semibold text-lg mb-3">Навигация</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <button onClick={() => navigate('/catalog')} className="hover:text-primary transition-colors">Каталог</button>
                <button onClick={() => setShowAbout(true)} className="hover:text-primary transition-colors">О магазине</button>
                <button onClick={() => setShowContacts(true)} className="hover:text-primary transition-colors">Контакты</button>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t border-primary/10">
            <p className="text-sm text-muted-foreground">© 2024 Mister_gadget. Все права защищены.</p>
          </div>
        </footer>
      </div>

      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl gradient-text">О магазине Mister_gadjet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-lg">
            <p className="text-muted-foreground leading-relaxed">
              Добро пожаловать в <span className="font-bold text-primary">Mister_gadjet</span> — ваш проводник в мир инновационных технологий! 
              Мы создали этот магазин для тех, кто ценит качество, стиль и функциональность в каждой детали.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Наша миссия — сделать передовые гаджеты доступными каждому. От премиальных наушников с кристально чистым звуком 
              до умных часов, которые станут вашим незаменимым помощником, — мы тщательно отбираем только лучшие устройства от проверенных производителей.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-semibold text-secondary">Что нас отличает?</span> Индивидуальный подход к каждому клиенту, 
              молниеносная доставка, официальная гарантия на всю продукцию и команда экспертов, готовая помочь с выбором идеального гаджета.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Присоединяйтесь к тысячам довольных клиентов, которые уже открыли для себя будущее вместе с нами. 
              В <span className="font-bold text-accent">Mister_gadjet</span> будущее начинается сегодня! 🚀
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showContacts} onOpenChange={setShowContacts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Контакты</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Icon name="Headphones" size={24} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Техническая поддержка</h4>
                  <p className="text-muted-foreground">Всегда на связи, чтобы помочь вам</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-9">
                <Icon name="Phone" size={20} className="text-secondary" />
                <a href="tel:89066664087" className="text-lg font-mono hover:text-primary transition-colors">
                  8 (906) 666-40-87
                </a>
              </div>
            </div>
            
            <div className="pt-4 border-t border-primary/20">
              <p className="text-sm text-muted-foreground text-center">
                Мы работаем для вас ежедневно с 9:00 до 21:00
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}