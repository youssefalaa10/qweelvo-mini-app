import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectBranch, Branch } from '@/features/branch/branchSlice';
import PageHeader from '@/shared/components/PageHeader';
import PageTransition from '@/shared/components/PageTransition';

const BranchPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const branches = useAppSelector((s) => s.branch.branches);
  const isAr = i18n.language === 'ar';

  const handleSelect = (branch: Branch) => {
    if (!branch.isOpen) return;
    dispatch(selectBranch(branch));
    navigate('/menu');
  };

  return (
    <PageTransition>
      <PageHeader title={t('branch.title')} />
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-muted-foreground mb-6">{t('branch.subtitle')}</p>
        <div className="space-y-3">
          {branches.map((branch, i) => (
            <motion.button
              key={branch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleSelect(branch)}
              disabled={!branch.isOpen}
              className={`w-full text-start p-4 rounded-xl border transition-all ${
                branch.isOpen
                  ? 'bg-card border-border hover:border-primary hover:shadow-md cursor-pointer'
                  : 'bg-muted border-border opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{isAr ? branch.nameAr : branch.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {isAr ? branch.addressAr : branch.address}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${branch.isOpen ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {branch.isOpen ? t('branch.open') : t('branch.closed')}
                  </span>
                  {branch.distance && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{branch.distance}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default BranchPage;
