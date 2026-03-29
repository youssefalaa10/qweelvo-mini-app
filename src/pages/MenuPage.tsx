import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveCategory, Product } from '@/features/menu/menuSlice';
import { addItem, selectCartTotal, selectCartItemCount } from '@/features/cart/cartSlice';
import PageHeader from '@/shared/components/PageHeader';
import PageTransition from '@/shared/components/PageTransition';

const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories, products, activeCategory } = useAppSelector((s) => s.menu);
  const cartCount = useAppSelector(selectCartItemCount);
  const cartTotal = useAppSelector(selectCartTotal);
  const isAr = i18n.language === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter((p) => p.categoryId === activeCategory);

  const handleQuickAdd = (product: Product) => {
    if (product.modifierGroups.length > 0) {
      navigate(`/product/${product.id}`);
      return;
    }
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      quantity: 1,
      modifiers: [],
    }));
  };

  return (
    <PageTransition>
      <PageHeader title={t('menu.title')} showBack />
      
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
              {isAr ? cat.nameAr : cat.name}
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
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                <span className="text-3xl">🍔</span>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-foreground line-clamp-1">{isAr ? product.nameAr : product.name}</h3>
                <p className="text-primary font-bold text-sm mt-1">
                  {product.price} {t('common.currency')}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleQuickAdd(product); }}
                  className="mt-2 w-full flex items-center justify-center gap-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:bg-primary-hover transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('menu.addToCart')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
