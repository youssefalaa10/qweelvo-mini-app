import api from './api';
import { MenuCategory, MenuItem } from '@/types/session';

interface FullMenuResponse {
  categories: MenuCategory[];
  items: MenuItem[];
}

export const menuService = {
  getFullMenu: async (token: string, lang?: string): Promise<FullMenuResponse> => {
    const res = await api.get(`/sessions/${token}/menu`, {
      params: { lang }
    });
    
    console.log('DEBUG: Full Menu API Response:', res.data);

    // The structure provided: { data: { success: true, data: [ products ] } }
    let rawItems = res.data?.data?.data || res.data?.data || [];
    if (!Array.isArray(rawItems) && res.data?.data?.items) rawItems = res.data.data.items;

    console.log('DEBUG: Raw Items from API:', rawItems);

    // Extract unique categories from products if categories array is missing
    const products: MenuItem[] = rawItems.map((item: any) => ({
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      // Ensure categoryId is set if not already
      categoryId: item.categoryId || item.category?.id
    }));

    const categoriesMap = new Map();
    products.forEach(p => {
       if ((p as any).category) {
         categoriesMap.set((p as any).category.id, (p as any).category);
       }
    });

    const categories = Array.from(categoriesMap.values());
    console.log('DEBUG: Extracted Categories:', categories);
    console.log('DEBUG: Processed Products:', products);

    return {
      categories,
      items: products
    };
  },

  getCategories: async (token: string, lang?: string): Promise<MenuCategory[]> => {
    const res = await api.get(`/sessions/${token}/menu/categories`, {
      params: { lang }
    });
    return res.data.data || [];
  },

  getItemDetails: async (token: string, itemId: string, lang?: string): Promise<MenuItem> => {
    const res = await api.get(`/sessions/${token}/menu/items/${itemId}`, {
      params: { lang }
    });
    return res.data.data;
  }
};
