import api from './api';
import { CartItem, CartSummary } from '@/types/session';

export const cartService = {
  getCart: async (token: string): Promise<any> => {
    const res = await api.get(`/sessions/${token}/cart`, {
      headers: { 'x-session-token': token }
    });
    return res.data.data;
  },

  addItemToCart: async (token: string, data: any): Promise<void> => {
    await api.post(`/sessions/${token}/cart/items`, data, {
      headers: { 'x-session-token': token }
    });
  },

  updateCartItem: async (token: string, itemId: string, data: any): Promise<void> => {
    // Path includes session token and item _id: /api/v1/sessions/{{token}}/cart/items/{{item_id}}
    await api.patch(`/sessions/${token}/cart/items/${itemId}`, data, {
      headers: { 'x-session-token': token }
    });
  },

  removeCartItem: async (token: string, itemId: string): Promise<void> => {
    await api.delete(`/sessions/${token}/cart/items/${itemId}`, {
      headers: { 'x-session-token': token }
    });
  },

  clearCart: async (token: string): Promise<void> => {
    await api.delete(`/sessions/${token}/cart`, {
      headers: { 'x-session-token': token }
    });
  },

  getCartSummary: async (token: string): Promise<CartSummary> => {
    const res = await api.get(`/sessions/${token}/cart/summary`, {
      headers: { 'x-session-token': token }
    });
    return res.data.data;
  },

  applyOffer: async (token: string, offerCode: string): Promise<void> => {
    await api.post(`/sessions/${token}/cart/apply-offer`, { offerCode });
  },

  removeOffer: async (token: string): Promise<void> => {
    await api.post(`/sessions/${token}/cart/remove-offer`);
  },

  validateCart: async (token: string): Promise<any> => {
    const res = await api.post(`/sessions/${token}/cart/validate`, {}, {
      headers: { 'x-session-token': token }
    });
    return res.data;
  }
};
