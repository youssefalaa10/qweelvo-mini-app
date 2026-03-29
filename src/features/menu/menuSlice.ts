import { createSlice } from '@reduxjs/toolkit';

export interface Modifier {
  id: string;
  name: string;
  nameAr: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  nameAr: string;
  required: boolean;
  options: Modifier[];
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  image: string;
  categoryId: string;
  modifierGroups: ModifierGroup[];
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
}

interface MenuState {
  categories: Category[];
  products: Product[];
  activeCategory: string;
}

const initialState: MenuState = {
  categories: [
    { id: 'burgers', name: 'Burgers', nameAr: 'برغر' },
    { id: 'chicken', name: 'Chicken', nameAr: 'دجاج' },
    { id: 'sides', name: 'Sides', nameAr: 'أطباق جانبية' },
    { id: 'drinks', name: 'Drinks', nameAr: 'مشروبات' },
    { id: 'desserts', name: 'Desserts', nameAr: 'حلويات' },
  ],
  products: [
    {
      id: 'p1', name: 'Classic Burger', nameAr: 'برغر كلاسيك', description: 'Juicy beef patty with fresh lettuce, tomato, and our signature sauce.', descriptionAr: 'قطعة لحم بقري مع خس وطماطم طازجة وصلصتنا المميزة.', price: 32, image: '', categoryId: 'burgers',
      modifierGroups: [
        { id: 'size', name: 'Size', nameAr: 'الحجم', required: true, options: [
          { id: 's', name: 'Regular', nameAr: 'عادي', price: 0 },
          { id: 'm', name: 'Large', nameAr: 'كبير', price: 8 },
        ]},
        { id: 'extras', name: 'Extras', nameAr: 'إضافات', required: false, options: [
          { id: 'cheese', name: 'Extra Cheese', nameAr: 'جبنة إضافية', price: 5 },
          { id: 'bacon', name: 'Bacon', nameAr: 'لحم مقدد', price: 7 },
        ]},
      ],
    },
    {
      id: 'p2', name: 'Double Smash', nameAr: 'دبل سماش', description: 'Two smashed beef patties with cheddar, caramelized onions.', descriptionAr: 'قطعتان من اللحم المسحوق مع شيدر وبصل مكرمل.', price: 45, image: '', categoryId: 'burgers',
      modifierGroups: [
        { id: 'size', name: 'Size', nameAr: 'الحجم', required: true, options: [
          { id: 's', name: 'Regular', nameAr: 'عادي', price: 0 },
          { id: 'm', name: 'Large', nameAr: 'كبير', price: 10 },
        ]},
      ],
    },
    {
      id: 'p3', name: 'Crispy Chicken', nameAr: 'دجاج مقرمش', description: 'Golden fried chicken breast with pickles and mayo.', descriptionAr: 'صدر دجاج مقلي ذهبي مع مخللات ومايونيز.', price: 28, image: '', categoryId: 'chicken',
      modifierGroups: [],
    },
    {
      id: 'p4', name: 'Grilled Chicken', nameAr: 'دجاج مشوي', description: 'Herb-marinated grilled chicken with garlic sauce.', descriptionAr: 'دجاج مشوي بالأعشاب مع صلصة الثوم.', price: 35, image: '', categoryId: 'chicken',
      modifierGroups: [],
    },
    {
      id: 'p5', name: 'French Fries', nameAr: 'بطاطس مقلية', description: 'Crispy golden fries with seasoning.', descriptionAr: 'بطاطس مقلية مقرمشة مع توابل.', price: 12, image: '', categoryId: 'sides',
      modifierGroups: [],
    },
    {
      id: 'p6', name: 'Onion Rings', nameAr: 'حلقات البصل', description: 'Crunchy battered onion rings.', descriptionAr: 'حلقات بصل مقرمشة.', price: 15, image: '', categoryId: 'sides',
      modifierGroups: [],
    },
    {
      id: 'p7', name: 'Cola', nameAr: 'كولا', description: 'Chilled carbonated cola drink.', descriptionAr: 'مشروب كولا غازي مثلج.', price: 8, image: '', categoryId: 'drinks',
      modifierGroups: [],
    },
    {
      id: 'p8', name: 'Fresh Juice', nameAr: 'عصير طازج', description: 'Freshly squeezed orange juice.', descriptionAr: 'عصير برتقال طازج.', price: 14, image: '', categoryId: 'drinks',
      modifierGroups: [],
    },
    {
      id: 'p9', name: 'Chocolate Cake', nameAr: 'كيك شوكولاتة', description: 'Rich chocolate cake with ganache.', descriptionAr: 'كيك شوكولاتة غني مع غاناش.', price: 22, image: '', categoryId: 'desserts',
      modifierGroups: [],
    },
  ],
  activeCategory: 'burgers',
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
  },
});

export const { setActiveCategory } = menuSlice.actions;
export default menuSlice.reducer;
