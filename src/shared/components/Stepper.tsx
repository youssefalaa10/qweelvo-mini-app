import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { Store, Utensils, CreditCard, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const Stepper = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isAr = i18n.language === 'ar';
  
  const hasInitialBranch = useAppSelector(state => state.session.hasInitialBranch);

  const steps = [];

  if (!hasInitialBranch) {
    steps.push({
      id: 'branches',
      path: '/branches',
      icon: Store,
      label: isAr ? 'الفرع' : 'Branch'
    });
  }

  steps.push({
    id: 'menu',
    path: '/menu',
    icon: Utensils,
    label: isAr ? 'القائمة' : 'Menu'
  });

  steps.push({
    id: 'checkout',
    path: '/checkout',
    icon: CreditCard,
    label: isAr ? 'الدفع' : 'Checkout'
  });

  const currentPath = location.pathname;
  let currentStepIndex = steps.findIndex(s => currentPath.startsWith(s.path));
  
  if (currentStepIndex === -1 && currentPath.includes('/product/')) {
    currentStepIndex = steps.findIndex(s => s.id === 'menu');
  }

  // If not matching any relevant page, don't show the stepper
  if (currentStepIndex === -1 && currentPath !== '/success') {
    return null;
  }
  
  // Show all complete if success page
  if (currentPath === '/success') {
    currentStepIndex = steps.length;
  }

  return (
    <div className="w-full max-w-lg mx-auto px-6 py-4">
      <div className="relative flex justify-between items-center">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary origin-left rtl:origin-right"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: currentStepIndex / Math.max(1, steps.length - 1) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive ? 'border-primary bg-primary text-primary-foreground' :
                  isCompleted ? 'border-primary bg-primary text-primary-foreground' :
                  'border-muted bg-card text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </motion.div>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isActive ? 'text-foreground' : 
                isCompleted ? 'text-foreground' : 
                'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
