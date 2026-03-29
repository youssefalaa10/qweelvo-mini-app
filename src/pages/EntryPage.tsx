import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/app/store';
import { setToken, setSessionStatus } from '@/features/session/sessionSlice';
import { Loader2 } from 'lucide-react';
import LanguageToggle from '@/shared/components/LanguageToggle';

const EntryPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      dispatch(setSessionStatus('invalid'));
      return;
    }

    dispatch(setToken(token));
    dispatch(setSessionStatus('loading'));

    // Simulate session validation
    const timer = setTimeout(() => {
      if (token === 'invalid') {
        dispatch(setSessionStatus('invalid'));
      } else {
        dispatch(setSessionStatus('valid'));
        navigate('/branches');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [token, dispatch, navigate]);

  if (!token || token === 'invalid') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4"><LanguageToggle /></div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{t('entry.invalid')}</h2>
          <p className="text-muted-foreground">{t('entry.retry')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">{t('entry.loading')}</p>
      </motion.div>
    </div>
  );
};

export default EntryPage;
