import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = false }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
              <BackIcon className="w-5 h-5 text-foreground" />
            </button>
          )}
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
};

export default PageHeader;
