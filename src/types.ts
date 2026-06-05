/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  brand: string;
  specs: Record<string, string>;
  colors: { name: string; hex: string }[];
  sizes?: string[];
  featured?: boolean;
  inStock: boolean;
}

export interface CartItem {
  id: string; // Unique ID composed of product.id + selected color + selected size
  product: Product;
  quantity: number;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  joinedDate: string;
  points: number;
  membershipTier: 'Bronze' | 'Argent' | 'Or';
  wishlist: string[]; // Product IDs
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'En attente' | 'En préparation' | 'Expédié' | 'Livré';
  trackingNumber: string;
  deliveryMethod: string;
  paymentMethod: string;
}
