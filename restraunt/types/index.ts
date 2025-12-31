/**
 * Order Status Types
 */
export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';

/**
 * Order Item - Individual menu item in an order
 */
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  specialInstructions?: string;
}

/**
 * Order - Main order object
 */
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  specialInstructions?: string;
  estimatedPrepTime?: number; // in minutes
}

/**
 * Restaurant Profile
 */
export interface RestaurantProfile {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isOpen: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Auth Session
 */
export interface AuthSession {
  restaurantId: string;
  restaurantName: string;
  email: string;
  token?: string;
  createdAt: number;
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
