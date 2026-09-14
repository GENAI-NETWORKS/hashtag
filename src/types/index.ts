// ============================================================
// Shared TypeScript types for Hashtag e-commerce
// ============================================================

export type Role = 'CUSTOMER' | 'ADMIN';
export type OrderStatus = 'PENDING' | 'DESIGN_CONFIRMED' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type CouponType = 'PERCENTAGE' | 'FIXED';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  roleType?: string;
  gender?: string;
  source?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Address {
  id: number;
  userId: number;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  _count?: { products: number };
}

export interface ProductVariant {
  id: number;
  productId: number;
  size?: string;
  color?: string;
  material?: string;
  priceModifier: number;
  stock: number;
  sku?: string;
  isActive: boolean;
}

export interface Customization {
  id: number;
  productId: number;
  variantId?: number;
  designUrl?: string;
  textOverlays?: TextOverlay[];
  config?: Record<string, unknown>;
  previewUrl?: string;
}

export interface TextOverlay {
  id: string;
  text: string;
  font: string;
  color: string;
  size: number;
  x: number;
  y: number;
  bold: boolean;
  italic: boolean;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  images: string[];
  tags?: string[];
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  avgRating: number;
  reviewCount: number;
  metaTitle?: string;
  metaDesc?: string;
  createdAt: string;
  category?: Category;
  variants?: ProductVariant[];
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  variantId?: number;
  customizationId?: number;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
  customization?: Customization;
}

// Local cart item for Zustand (before server sync)
export interface LocalCartItem {
  id: string; // temp UUID
  productId: number;
  variantId?: number;
  customizationId?: number;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
  customization?: Customization;
}

export interface Order {
  id: number;
  userId: number;
  addressId: number;
  couponId?: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  estimatedDelivery?: string;
  createdAt: string;
  address?: Address;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId?: number;
  customizationId?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
  variant?: ProductVariant;
  customization?: Customization;
}

export interface OrderStatusHistory {
  id: number;
  orderId: number;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrder: number;
  isActive: boolean;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { name: string };
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter/Sort types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  color?: string;
  size?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  search?: string;
  page?: number;
  limit?: number;
}

// Checkout
export interface CheckoutData {
  addressId: number;
  couponCode?: string;
  notes?: string;
}

// Admin analytics
export interface AnalyticsData {
  ordersToday: number;
  revenueToday: number;
  ordersThisWeek: number;
  revenueThisWeek: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: Array<{ product: Product; orderCount: number; revenue: number }>;
  ordersByStatus: Record<OrderStatus, number>;
  revenueByDay: Array<{ date: string; revenue: number; orders: number }>;
}
