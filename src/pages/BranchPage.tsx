import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Clock, Search, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectBranch, setBranches, setBranchLoading, setBranchError } from '@/features/branch/branchSlice';
import { sessionService } from '@/services/sessionService';
import { Branch } from '@/types/session';
import PageHeader from '@/shared/components/PageHeader';
import PageTransition from '@/shared/components/PageTransition';
import Stepper from '@/shared/components/Stepper';
import { toast } from 'sonner';

const BranchPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { branches, isLoading, error } = useAppSelector((s) => s.branch);
  const isAr = i18n.language === 'ar';

  const [locationStr, setLocationStr] = useState('');
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationStr.trim()) return;

    dispatch(setBranchLoading(true));
    try {
      const result = await sessionService.getNearestBranches(locationStr);
      dispatch(setBranches(result));
      if (result.length === 0) {
        toast.info(isAr ? 'لا توجد فروع قريبة' : 'No branches found near this location');
      }
    } catch (err) {
      dispatch(setBranchError('Failed to fetch branches'));
      toast.error(isAr ? 'حدث خطأ' : 'Error fetching branches');
      // For demo fallback if API fails
      dispatch(setBranches([]));
    }
  };

  const handleSelect = async (branch: Branch) => {
    if (!branch.isOpen) return;
    
    // Optimistically update
    dispatch(selectBranch(branch));
    
    try {
      await sessionService.confirmBranch(branch.id);
      navigate('/menu');
    } catch (err) {
      toast.error(isAr ? 'فشل في تأكيد الفرع' : 'Failed to confirm branch');
    }
  };

  return (
    <PageTransition>
      <PageHeader title={t('branch.title')} />
      <Stepper />
      <div className="max-w-lg mx-auto px-4 py-2">
        <p className="text-muted-foreground mb-4">{t('branch.subtitle')}</p>
        
        {/* Search Location Input */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={locationStr}
            onChange={(e) => setLocationStr(e.target.value)}
            placeholder={isAr ? 'أدخل مدينتك (مثال: المدينه)' : 'Enter your city (e.g. Madinah)'}
            className="w-full pl-10 pr-12 rtl:pr-10 rtl:pl-12 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          <MapPin className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-3.5 w-5 h-5 text-muted-foreground" />
          <button
            type="submit"
            disabled={isLoading || !locationStr.trim()}
            className="absolute right-1.5 rtl:left-1.5 rtl:right-auto top-1.5 bottom-1.5 bg-primary text-primary-foreground px-3 rounded-lg flex items-center justify-center hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </form>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

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
          
          {branches.length === 0 && !isLoading && !error && (
             <div className="text-center py-10 opacity-60">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p>{isAr ? 'قم بالبحث عن الفروع القريبة' : 'Search for nearby branches'}</p>
             </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BranchPage;
