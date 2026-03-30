import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setMenu, setActiveCategory, setMenuLoading, setMenuError } from '@/features/menu/menuSlice';
import { addItem, selectCartTotal, selectCartItemCount, setCart, setCartLoading } from '@/features/cart/cartSlice';
import { menuService } from '@/services/menuService';
import { cartService } from '@/services/cartService';
import { MenuItem } from '@/types/session';
import PageHeader from '@/shared/components/PageHeader';
import PageTransition from '@/shared/components/PageTransition';
import Stepper from '@/shared/components/Stepper';

const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.session.token);
  const { categories, products, activeCategory, isLoading, error } = useAppSelector((s) => s.menu);
  const cartCount = useAppSelector(selectCartItemCount);
  const cartTotal = useAppSelector(selectCartTotal);
  const isAr = i18n.language === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMenuAndCart = async () => {
      if (!token) return;
      dispatch(setMenuLoading(true));
      dispatch(setCartLoading(true));
      try {
        const [menuData, cartData] = await Promise.all([
          menuService.getFullMenu(token, i18n.language),
          cartService.getCart(token)
        ]);
        console.log('DEBUG: MenuData Loaded:', menuData);
        dispatch(setMenu(menuData));
        dispatch(setCart(cartData));
      } catch (err) {
        console.error('Failed to load menu data', err);
        dispatch(setMenuError('Failed to load menu'));
      }
    };
    
    // Only fetch if empty to avoid refetching on every navigate back
    if (categories.length === 0) {
      fetchMenuAndCart();
    }
  }, [token, i18n.language, dispatch, categories.length]);

  const filteredProducts = (products || []).filter((p) => p.categoryId === activeCategory);

  const handleQuickAdd = async (product: MenuItem) => {
    if (!token) return;

    // Pick first options for required groups
    const defaultModifiers = (product.modifierGroups || [])
      .filter((mg) => mg.required)
      .map((mg) => {
        const firstOpt = mg.options?.[0];
        if (!firstOpt) return null;
        return { id: firstOpt.id, name: firstOpt.name, nameAr: firstOpt.nameAr || firstOpt.name, price: firstOpt.price };
      }).filter(m => m !== null) as any[];

    // Optimistic UI update
    const id = `${product.id}-${Date.now()}`;
    dispatch(addItem({
      id,
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      quantity: 1,
      modifiers: defaultModifiers,
    }));

    toast.success(isAr ? `تم إضافة ${product.nameAr || product.name} للسلة` : `Added ${product.name} to cart`, {
      duration: 1500,
      position: 'top-center',
    });

    try {
      await cartService.addItemToCart(token, {
        itemId: product.id,
        quantity: 1,
        modifiers: defaultModifiers.map(m => ({ id: m.id, quantity: 1 }))
      });
      // Optionally sync cart from backend here, but optimistic is enough for now
    } catch (err) {
      // Revert if failed
      toast.error(isAr ? 'فشل في إضافة العنصر' : 'Failed to add item');
      // A proper revert would dispatch removeItem(id)
    }
  };

  return (
    <PageTransition>
      <PageHeader title={t('menu.title')} showBack />
      <Stepper />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-destructive">{error}</div>
      ) : (
        <>
          {/* Categories */}
          <div className="sticky top-[57px] z-30 bg-background border-b border-border">
            <div ref={scrollRef} className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => dispatch(setActiveCategory(cat.id))}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {isAr ? (cat.nameAr || cat.name) : cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="max-w-lg mx-auto px-4 py-4 pb-28">
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center relative overflow-hidden">
                    {product.image ? (
                       <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                       <span className="text-3xl">🍔</span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                      {isAr ? (product.nameAr || product.name) : product.name}
                    </h3>
                    <p className="text-primary font-bold text-sm mt-1">
                      {product.price} {t('common.currency')}
                    </p>
                    <p className="text-muted-foreground text-[10px] mt-1 line-clamp-2 min-h-[2.5em] mb-2">
                       {isAr ? (product.descriptionAr || product.description) : product.description}
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleQuickAdd(product); }}
                        className="w-full flex items-center justify-center gap-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:bg-primary-hover transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        {t('menu.addToCart')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                   {isAr ? 'لا توجد منتجات في هذا القسم' : 'No products in this category'}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Cart Sticky Bottom */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="sticky-bottom"
        >
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-xl px-5 py-3.5 font-semibold hover:bg-primary-hover transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t('menu.viewCart')} • {cartCount} {t('menu.items')}
              </span>
              <span>{cartTotal} {t('common.currency')}</span>
            </button>
          </div>
        </motion.div>
      )}
    </PageTransition>
  );
};

export default MenuPage;
