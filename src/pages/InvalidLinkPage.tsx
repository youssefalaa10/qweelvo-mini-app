import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link2Off } from 'lucide-react';
import LanguageToggle from '@/shared/components/LanguageToggle';

const InvalidLinkPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
        <LanguageToggle />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <Link2Off className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {t('entry.incomplete')}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {t('entry.incompleteHint')}
        </p>
      </motion.div>
    </div>
  );
};

export default InvalidLinkPage;
