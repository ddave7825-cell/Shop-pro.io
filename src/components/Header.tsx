/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, User, Heart, Compass, History } from 'lucide-react';
import { CartItem, UserProfile } from '../types';

interface HeaderProps {
  currentView: 'home' | 'catalog' | 'product' | 'portal' | 'cart' | 'admin' | 'auth';
  setView: (view: 'home' | 'catalog' | 'product' | 'portal' | 'cart' | 'admin' | 'auth') => void;
  cart: CartItem[];
  user: UserProfile;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setView,
  cart,
  user,
  onOpenCart,
}) => {
  const totalCartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
        {/* Logo / Brand */}
        <button
          id="btn-nav-home"
          onClick={() => setView('home')}
          className="flex items-center space-x-2 text-left focus:outline-none"
        >
          <span className="font-sans text-xl font-black tracking-tight text-blue-600 flex items-center gap-1 p-1">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-lg text-xs uppercase font-black tracking-wider">shop</span>
            <span className="text-stone-950 font-black text-lg tracking-tight -ml-0.5">pro</span>
          </span>
        </button>

        {/* Action icons */}
        <div className="flex items-center space-x-3">
          <button
            id="btn-nav-catalog"
            onClick={() => setView('catalog')}
            title="Catalogue"
            className={`rounded-full p-2 transition-colors ${
              currentView === 'catalog'
                ? 'bg-stone-100 text-stone-950'
                : 'text-stone-650 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <Compass className="h-5 w-5" />
          </button>

          <button
            id="btn-nav-portal"
            onClick={() => setView('portal')}
            title="Espace Client"
            className={`relative rounded-full p-2 transition-colors ${
              currentView === 'portal'
                ? 'bg-stone-100 text-stone-950'
                : 'text-stone-655 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <User className="h-5 w-5" />
            {user.wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            id="btn-nav-cart"
            onClick={onOpenCart}
            title="Panier"
            className="relative rounded-full p-2 text-stone-650 transition-colors hover:bg-stone-50 hover:text-stone-900"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalCartQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-between justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white shadow-sm">
                <span className="w-full text-center">{totalCartQuantity}</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
