import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const TermsModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('qweelvo_terms_accepted');
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('qweelvo_terms_accepted', 'true');
    setIsOpen(false);
  };

  const handleDecline = () => {
    setIsDeclined(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-foreground/30 backdrop-blur-md"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-card rounded-[2.5rem] p-8 shadow-2xl border border-border relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-3xl" />

              <div className="relative text-center">
                {!isDeclined ? (
                  <>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h2 className="text-2xl font-extrabold text-foreground mb-4">
                      {t('terms.title')}
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm mb-8 px-2">
                      {t('terms.content')}
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={handleAccept}
                            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-lg hover:bg-primary-hover transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                        >
                            {t('terms.accept')}
                        </button>
                        <button
                            onClick={handleDecline}
                            className="w-full bg-secondary text-secondary-foreground rounded-2xl py-3 font-semibold text-base hover:bg-muted transition-all active:scale-[0.98]"
                        >
                            {t('terms.decline')}
                        </button>
                        <p className="text-[10px] text-muted-foreground opacity-60 pt-2">
                            {new Date().getFullYear()} © Qweelvo Inc.
                        </p>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4"
                  >
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-10 h-10 text-destructive" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      {t('terms.decline')}
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm mb-8 px-2">
                      {t('terms.declinedMessage')}
                    </p>

                    <button
                      onClick={() => setIsDeclined(false)}
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      {t('common.back')}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;
