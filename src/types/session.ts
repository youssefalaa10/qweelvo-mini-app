export interface SessionInfo {
  tenantId: string;
  userId: string;
  branchId: string | null;
  expiresAt: string;
  termsAccepted: boolean;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  floor: string;
  landmark: string;
}

export interface Branch {
  id: string;
  name: string;
  nameAr?: string;
  address?: string;
  addressAr?: string;
  location?: string;
  isOpen?: boolean;
  distance?: string;
}

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

export interface MenuCategory {
  id: string;
  name: string;
  nameAr: string;
}

export interface MenuItem {
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

export interface CartModifier {
  id?: string;
  name: string;
  nameAr: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  modifiers: CartModifier[];
  specialInstructions?: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
}
