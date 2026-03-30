import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { 
  setToken, 
  setBrand, 
  setSessionStatus, 
  setSessionInfo 
} from '@/features/session/sessionSlice';
import { sessionService } from '@/services/sessionService';
import { Loader2 } from 'lucide-react';
import LanguageToggle from '@/shared/components/LanguageToggle';

const EntryPage = () => {
  const { token, brand } = useParams<{ token: string; brand?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sessionStatus = useAppSelector(state => state.session.status);
  const termsAccepted = useAppSelector(state => state.session.termsAccepted);
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      dispatch(setSessionStatus('invalid'));
      return;
    }

    const initSession = async () => {
      dispatch(setSessionStatus('loading'));
      if (brand) dispatch(setBrand(brand));

      try {
        const validateRes = await sessionService.validateSession(token);
        
        const validToken = validateRes?.token || token;
        dispatch(setToken(validToken));
        
        const info = await sessionService.getSessionInfo();
        dispatch(setSessionInfo(info));
        dispatch(setSessionStatus('valid'));

      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(setSessionStatus('expired'));
        } else {
          dispatch(setSessionStatus('invalid'));
        }
      }
    };

    initSession();
  }, [token, brand, dispatch]);

  // Handle routing as a separate effect so we wait for Terms Modal to complete
  useEffect(() => {
    if (sessionStatus === 'valid' && termsAccepted) {
      const info = useAppSelector(state => state.session.info);
      if (info && info.branchId) {
         navigate('/menu');
      } else {
         navigate('/branches');
      }
    }
  }, [sessionStatus, termsAccepted, navigate]);


  if (!token || ['invalid', 'expired'].includes(sessionStatus)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4"><LanguageToggle /></div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {sessionStatus === 'expired' ? t('entry.expired') : t('entry.invalid')}
          </h2>
          <p className="text-muted-foreground">{t('entry.retry')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4"><LanguageToggle /></div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">{t('entry.loading')}</p>
      </motion.div>
    </div>
  );
};

export default EntryPage;
