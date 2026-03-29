import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <button
      onClick={() => i18n.changeLanguage(isArabic ? 'en' : 'ar')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium transition-colors hover:bg-muted"
    >
      <Globe className="w-4 h-4" />
      {isArabic ? 'EN' : 'عربي'}
    </button>
  );
};

export default LanguageToggle;
