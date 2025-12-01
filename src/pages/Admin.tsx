import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useProductsStore } from '@/store/productsStore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const categories = ['Аудио', 'Носимые', 'Компьютеры', 'Аксессуары'];

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductsStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0],
    image: '',
    vkLink: '',
    inStock: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: categories[0],
      image: '',
      vkLink: '',
      inStock: true,
    });
    setEditingProduct(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.image || !formData.vkLink) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      vkLink: formData.vkLink,
      inStock: formData.inStock,
    };

    if (editingProduct) {
      updateProduct(editingProduct, productData);
      toast({
        title: 'Успешно',
        description: 'Товар обновлен',
      });
    } else {
      addProduct(productData);
      toast({
        title: 'Успешно',
        description: 'Товар добавлен',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        vkLink: product.vkLink,
        inStock: product.inStock,
      });
      setEditingProduct(productId);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (productId: number) => {
    deleteProduct(productId);
    toast({
      title: 'Успешно',
      description: 'Товар удален',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Админ-панель</h1>
            <p className="text-muted-foreground">Управление товарами каталога</p>
          </div>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Icon name="Plus" size={20} />
            Добавить товар
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-primary/10 rounded-full">
                <Icon name="Package" size={64} className="text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 gradient-text">Нет товаров</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Добавьте первый товар в каталог
            </p>
            <Button
              size="lg"
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Icon name="Plus" size={20} />
              Добавить товар
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden bg-card/80 backdrop-blur-sm border-2 border-primary/20"
              >
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        product.inStock ? 'bg-secondary' : 'bg-destructive'
                      }`}
                    >
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {product.category}
                  </Badge>
                  <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                  <p className="text-3xl font-bold gradient-text">
                    {product.price.toLocaleString()} ₽
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => handleEdit(product.id)}
                  >
                    <Icon name="Pencil" size={18} />
                    Редактировать
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Icon name="Trash2" size={18} />
                    Удалить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию о товаре
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Название товара *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Название товара"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Цена (₽) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="9990"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Категория *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">URL изображения *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <img
                      src={formData.image}
                      alt="Превью"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vkLink">Ссылка на VK *</Label>
                <Input
                  id="vkLink"
                  value={formData.vkLink}
                  onChange={(e) => setFormData({ ...formData, vkLink: e.target.value })}
                  placeholder="https://vk.com/product"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="inStock">Товар в наличии</Label>
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, inStock: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Отмена
              </Button>
              <Button onClick={handleSubmit}>
                {editingProduct ? 'Сохранить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
