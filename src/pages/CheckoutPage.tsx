import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CreditCard, Smartphone, MapPin, Truck, Store, Minus, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setName, setPhone, setOrderType, setAddress, setPaymentMethod,
  setCheckoutStatus, setOrderNumber,
} from '@/features/checkout/checkoutSlice';
import { 
  selectCartTotal, 
  selectCartItemCount, 
  clearCart, 
  updateQuantity, 
  removeItem, 
  setCartSummary,
  setCart 
} from '@/features/cart/cartSlice';
import { sessionService } from '@/services/sessionService';
import { cartService } from '@/services/cartService';
import PageHeader from '@/shared/components/PageHeader';
import PageTransition from '@/shared/components/PageTransition';
import Stepper from '@/shared/components/Stepper';

const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const checkout = useAppSelector((s) => s.checkout);
  const items = useAppSelector((s) => s.cart.items);
  const token = useAppSelector((s) => s.session.token);
  const customerInfo = useAppSelector(s => s.session.customerInfo);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    const initCheckout = async () => {
      if (!token) return;
      
      try {
        const [summary, cartData] = await Promise.all([
          cartService.getCartSummary(token),
          cartService.getCart(token)
        ]);
        dispatch(setCartSummary(summary));
        
        const itemsList = (cartData as any)?.items || (Array.isArray(cartData) ? cartData : []);
        console.log('DEBUG: Checkout Sync Items:', itemsList);
        dispatch(setCart(itemsList));
      } catch (err) {
        console.error('Failed to sync checkout data', err);
      }

      if (customerInfo) {
        if (!checkout.name) dispatch(setName(customerInfo.name || ''));
        if (!checkout.phone) dispatch(setPhone(customerInfo.phone || ''));
        if (!checkout.address) dispatch(setAddress(customerInfo.address || ''));
      }
    };

    initCheckout();
  }, [token, dispatch, customerInfo, checkout.name, checkout.phone, checkout.address]);

  const isValid = checkout.name.trim() && checkout.phone.trim() && itemCount > 0
    && (checkout.orderType === 'pickup' || checkout.address.trim());

  const handlePay = async () => {
    if (checkout.status === 'processing' || !token) return;
    
    if (!isValid) {
      toast.error(isAr ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    dispatch(setCheckoutStatus('processing'));

    try {
      await sessionService.updateCustomerInfo({
        name: checkout.name,
        phone: checkout.phone,
        address: checkout.orderType === 'delivery' ? checkout.address : undefined,
      });

      await cartService.validateCart(token);
      await sessionService.completeSession();

      const orderNum = `QW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      dispatch(setOrderNumber(orderNum));
      dispatch(setCheckoutStatus('success'));
      dispatch(clearCart());
      toast.success(isAr ? 'تم تأكيد طلبك بنجاح' : 'Order placed successfully');
      navigate('/success');

    } catch (err) {
      console.error('Checkout failed', err);
      dispatch(setCheckoutStatus('error'));
      toast.error(isAr ? 'حدث خطأ أثناء معالجة الطلب' : 'Error processing your order');
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number, backendId?: string) => {
    if (!token) return;
    
    // id is the one used in redux, backendId is the one from mongo (_id)
    dispatch(updateQuantity({ id, quantity: newQuantity }));

    try {
      if (newQuantity <= 0 && backendId) {
         await cartService.removeCartItem(token, backendId);
      } else if (backendId) {
         await cartService.updateCartItem(token, backendId, { quantity: newQuantity });
      }
      
      const [summary, cartData] = await Promise.all([
         cartService.getCartSummary(token),
         cartService.getCart(token)
      ]);
      dispatch(setCartSummary(summary));
      const itemsList = (cartData as any)?.items || (Array.isArray(cartData) ? cartData : []);
      dispatch(setCart(itemsList));
    } catch (err) {
      console.error('Update failed', err);
      toast.error(isAr ? 'فشل التحديث' : 'Update failed');
    }
  };

  const handleRemove = async (id: string, backendId?: string) => {
    if (!token) return;
    dispatch(removeItem(id));
    if (backendId) {
      try {
        await cartService.removeCartItem(token, backendId);
        const [summary, cartData] = await Promise.all([
           cartService.getCartSummary(token),
           cartService.getCart(token)
        ]);
        dispatch(setCartSummary(summary));
        const itemsList = (cartData as any)?.items || (Array.isArray(cartData) ? cartData : []);
        dispatch(setCart(itemsList));
      } catch (err) {
        console.error('Remove failed', err);
        toast.error(isAr ? 'فشل في إزالة العنصر' : 'Failed to remove item');
      }
    }
  };

  return (
    <PageTransition>
      <PageHeader title={t('checkout.title')} showBack />
      <Stepper />

      {checkout.status === 'processing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card rounded-2xl p-8 text-center shadow-xl">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-semibold text-foreground">{t('checkout.processing')}</p>
          </div>
        </motion.div>
      )}

      <div className="max-w-lg mx-auto px-4 py-4 pb-28">
        <section className="bg-card rounded-xl border border-border p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-4">{t('checkout.userInfo')}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t('checkout.name')}</label>
              <input
                value={checkout.name}
                onChange={(e) => dispatch(setName(e.target.value))}
                placeholder={t('checkout.namePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t('checkout.phone')}</label>
              <input
                value={checkout.phone}
                onChange={(e) => dispatch(setPhone(e.target.value))}
                placeholder={t('checkout.phonePlaceholder')}
                type="tel"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </div>
        </section>

        <section className="bg-card rounded-xl border border-border p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-4">{t('checkout.orderType')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'delivery' as const, icon: Truck, label: t('checkout.delivery') },
              { type: 'pickup' as const, icon: Store, label: t('checkout.pickup') },
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => dispatch(setOrderType(type))}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${
                  checkout.orderType === type ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />{label}
              </button>
            ))}
          </div>
        </section>

        {checkout.orderType === 'delivery' && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-card rounded-xl border border-border p-4 mb-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" />{t('checkout.address')}</h3>
            <input
              value={checkout.address}
              onChange={(e) => dispatch(setAddress(e.target.value))}
              placeholder={t('checkout.addressPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </motion.section>
        )}

        <section className="bg-card rounded-xl border border-border p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-4">{t('checkout.payment')}</h3>
          <div className="space-y-2">
            {[
              { method: 'apple_pay' as const, icon: Smartphone, label: t('checkout.applePay') },
              { method: 'card' as const, icon: CreditCard, label: t('checkout.card') },
            ].map(({ method, icon: Icon, label }) => (
              <button
                key={method}
                onClick={() => dispatch(setPaymentMethod(method))}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-medium ${
                  checkout.paymentMethod === method ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />{label}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-xl border border-border p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-3">{t('checkout.orderSummary')}</h3>
          
          <div className="space-y-3 mb-4">
            {items.map((item, i) => {
              const displayTotal = (item as any).totalPrice || ((item.price || 0) * item.quantity);
              // Use _id for backend, fallback to id for redux
              const reduxId = item.id || (item as any).itemId || (item as any)._id;
              const mongoId = (item as any)._id;

              return (
                <motion.div
                  key={mongoId || reduxId}
                  initial={{ opacity: 0, x: isAr ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-background rounded-lg border border-border p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">{item.quantity}x</span>
                        <h3 className="font-semibold text-foreground text-sm">
                           {item.name}
                        </h3>
                      </div>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 ml-6 rtl:mr-6 rtl:ml-0">
                          {item.modifiers.map((m) => m.name).join(', ')}
                        </p>
                      )}
                      <p className="text-primary font-bold text-xs mt-1 ml-6 rtl:mr-6 rtl:ml-0">{displayTotal} {t('common.currency')}</p>
                    </div>
                    <button onClick={() => handleRemove(reduxId, mongoId)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-2 ml-6 rtl:mr-6 rtl:ml-0">
                    <button onClick={() => handleUpdateQuantity(reduxId, item.quantity - 1, mongoId)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold text-foreground text-xs w-5 text-center">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(reduxId, item.quantity + 1, mongoId)} className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground text-lg">{t('cart.total')}</span>
            <span className="font-bold text-primary text-xl">{total} {t('common.currency')}</span>
          </div>
        </section>
      </div>

      <div className="sticky-bottom">
        <div className="max-w-lg mx-auto flex flex-col gap-2">
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-secondary text-secondary-foreground border border-border rounded-xl px-5 py-2.5 font-semibold hover:bg-muted transition-colors"
          >
            {isAr ? 'أضف المزيد' : 'Add More'}
          </button>
          <button
            onClick={handlePay}
            disabled={checkout.status === 'processing' || !isValid}
            className="w-full bg-primary text-primary-foreground rounded-xl px-5 py-3.5 font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('checkout.payNow')} • {total} {t('common.currency')}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutPage;
