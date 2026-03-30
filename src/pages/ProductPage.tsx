import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { menuService } from '@/services/menuService';
import { cartService } from '@/services/cartService';
import { MenuItem } from '@/types/session';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addItem } from '@/features/cart/cartSlice';
import PageHeader from '@/shared/components/PageHeader';
import PageTransition from '@/shared/components/PageTransition';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.session.token);
  
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({});
  
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token || !id) return;
      setIsLoading(true);
      try {
        const data = await menuService.getItemDetails(token, id, i18n.language);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product details", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, token, i18n.language]);

  if (isLoading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{t('shop.loading')}</p>
    </div>
  );

  if (!product) return <div className="p-8 text-center text-muted-foreground">{t('common.error')}</div>;

  const toggleModifier = (groupId: string, modId: string, required: boolean) => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || [];
      if (required) return { ...prev, [groupId]: [modId] };
      return { ...prev, [groupId]: current.includes(modId) ? current.filter((m) => m !== modId) : [...current, modId] };
    });
  };

  const modifiersPrice = Object.entries(selectedModifiers).reduce((sum, [groupId, modIds]) => {
    const group = (product.modifierGroups || []).find((g) => g.id === groupId);
    if (!group) return sum;
    return sum + modIds.reduce((s, modId) => {
      const mod = (group.options || []).find((o) => o.id === modId);
      return s + (mod?.price || 0);
    }, 0);
  }, 0);

  const totalPrice = (product.price + modifiersPrice) * quantity;

  const handleAdd = async () => {
    if (!token) return;

    const mods = Object.entries(selectedModifiers).flatMap(([groupId, modIds]) => {
      const group = (product.modifierGroups || []).find((g) => g.id === groupId);
      if (!group) return [];
      return modIds.map((modId) => {
        const mod = group.options.find((o) => o.id === modId)!;
        return { id: mod.id, name: mod.name, nameAr: mod.nameAr, price: mod.price };
      });
    });

    const tempId = `temp-${Date.now()}`;
    // Optimistic UI update
    dispatch(addItem({
      id: tempId,
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      quantity,
      modifiers: mods,
    }));

    try {
      await cartService.addItemToCart(token, {
        itemId: product.id,
        quantity,
        modifiers: mods.map(m => ({ id: m.id, quantity: 1 }))
      });
      toast.success(isAr ? 'تم الإضافة للسلة' : 'Added to cart');
      navigate(-1);
    } catch (err) {
      toast.error(isAr ? 'فشل إضافة العنصر' : 'Failed to add item');
    }
  };

  return (
    <PageTransition>
      <PageHeader title={isAr ? product.nameAr : product.name} showBack />
      <div className="max-w-lg mx-auto pb-28">
        <div className="aspect-video bg-muted flex items-center justify-center">
          <span className="text-6xl">🍔</span>
        </div>

        <div className="px-4 py-5">
          <h2 className="text-2xl font-bold text-foreground">{isAr ? product.nameAr : product.name}</h2>
          <p className="text-primary font-bold text-lg mt-1">{product.price} {t('common.currency')}</p>
          <p className="text-muted-foreground mt-3">{isAr ? product.descriptionAr : product.description}</p>

          {/* Modifiers */}
          {(product.modifierGroups || []).map((group) => (
            <div key={group.id} className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-foreground">{isAr ? group.nameAr : group.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${group.required ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                  {group.required ? t('product.required') : t('product.optional')}
                </span>
              </div>
              <div className="space-y-2">
                {group.options.map((opt) => {
                  const isSelected = (selectedModifiers[group.id] || []).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleModifier(group.id, opt.id, group.required)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-muted-foreground'
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">{isAr ? opt.nameAr : opt.name}</span>
                      {opt.price > 0 && <span className="text-sm text-primary font-medium">+{opt.price} {t('common.currency')}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-bold text-foreground w-8 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky-bottom">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-xl px-5 py-3.5 font-semibold hover:bg-primary-hover transition-colors"
          >
            <span>{t('product.addToCart')}</span>
            <span>{totalPrice} {t('common.currency')}</span>
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductPage;
