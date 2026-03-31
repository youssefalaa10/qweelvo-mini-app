import api from './api';
import { SessionInfo, CustomerInfo, Branch } from '@/types/session';

export const sessionService = {
  validateSession: async (token: string): Promise<{ token: string }> => {
    const res = await api.get(`/sessions/validate/${token}`);
    console.log('new session validation');
    return res.data.data;
  },
  
  getSessionInfo: async (): Promise<SessionInfo> => {
    const res = await api.get('/sessions/me');
    return res.data;
  },
  
  acceptTerms: async (): Promise<void> => {
    await api.post('/sessions/accept-terms');
  },
  
  detectLocation: async (location: string): Promise<void> => {
    await api.post('/sessions/detect-location', { location });
  },
  
  getNearestBranches: async (location?: string): Promise<Branch[]> => {
    const query = location ? `?location=${encodeURIComponent(location)}` : '';
    const res = await api.get(`/sessions/nearest-branches${query}`);
    return res.data?.data?.branches || [];
  },
  
  confirmBranch: async (branchId: string): Promise<void> => {
    await api.post('/sessions/confirm-branch', { branchId });
  },
  
  getSelectedBranch: async (): Promise<Branch | null> => {
    const res = await api.get('/sessions/branch');
    return res.data;
  },
  
  changeBranch: async (branchId: string): Promise<void> => {
    await api.patch('/sessions/branch', { branchId });
  },
  
  updateCustomerInfo: async (data: Partial<CustomerInfo>): Promise<void> => {
    await api.patch('/sessions/customer-info', data);
  },
  
  completeSession: async (): Promise<void> => {
    await api.post('/sessions/complete');
  },

  extendSession: async (minutes: number): Promise<void> => {
    await api.post('/sessions/extend', { minutes });
  }
};
