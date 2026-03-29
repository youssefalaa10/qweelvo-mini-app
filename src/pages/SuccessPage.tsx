import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { resetCheckout } from '@/features/checkout/checkoutSlice';
import PageTransition from '@/shared/components/PageTransition';
import LanguageToggle from '@/shared/components/LanguageToggle';

const SuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const orderNumber = useAppSelector((s) => s.checkout.orderNumber);

  const handleNewOrder = () => {
    dispatch(resetCheckout());
    navigate('/branches');
  };

  return (
    <PageTransition>
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4"><LanguageToggle /></div>
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-10 h-10 text-success" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('success.title')}</h1>
          <p className="text-muted-foreground mb-6">{t('success.message')}</p>

          {orderNumber && (
            <div className="bg-card border border-border rounded-xl px-6 py-4 mb-6">
              <p className="text-sm text-muted-foreground">{t('success.orderNumber')}</p>
              <p className="text-xl font-bold text-primary mt-1">{orderNumber}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <MessageCircle className="w-4 h-4" />
            <span>{t('success.whatsapp')}</span>
          </div>

          <button
            onClick={handleNewOrder}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors"
          >
            {t('success.newOrder')}
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default SuccessPage;
