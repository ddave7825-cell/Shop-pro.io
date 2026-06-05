/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Award, ArrowUpRight, Check, Key, History, Heart, Trash2, ArrowRight } from 'lucide-react';
import { UserProfile, Order, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils';
import { OrderTimeline } from './OrderTimeline';

interface CustomerPortalProps {
  user: UserProfile;
  orders: Order[];
  products: Product[];
  onUpdateProfile: (updated: UserProfile) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  toggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddCoupon: (coupon: { code: string; discount: number }) => void;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'catalog' | 'portal' | 'admin' | 'auth') => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  user,
  orders,
  products,
  onUpdateProfile,
  onAdvanceOrderStatus,
  toggleWishlist,
  onSelectProduct,
  onAddCoupon,
  onLogout,
  onNavigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Conversion of loyalty points states
  const [exchangeSuccess, setExchangeSuccess] = useState<string | null>(null);

  // Filter products in user's wishlist
  const wishlistProducts = products.filter((p) => user.wishlist.includes(p.id));

  // Determine points progress
  const nextTierPoints = user.membershipTier === 'Bronze' ? 300 : user.membershipTier === 'Argent' ? 800 : 1500;
  const progressPercent = Math.min(Math.round((user.points / nextTierPoints) * 100), 100);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name,
      email,
      phone,
      address,
    });
    setSaveFeedback(true);
    setIsEditing(false);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  // Redeem 100 points for a smart coupon
  const handleRedeemPoints = () => {
    if (user.points < 100) return;

    // Deduct points
    onUpdateProfile({
      ...user,
      points: user.points - 100,
    });

    const promoCode = `FIDELITE-${Math.floor(1000 + Math.random() * 9000)}`;
    onAddCoupon({ code: promoCode, discount: 5000 });
    setExchangeSuccess(promoCode);

    setTimeout(() => {
      setExchangeSuccess(null);
    }, 15000); // Show for 15 seconds
  };

  return (
    <div className="px-4 py-5 pb-24 bg-stone-50">
      {/* Visual Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-900 px-6 py-6 text-white shadow-md mb-4">
        {/* Absolute logout trigger */}
        <button
          onClick={onLogout}
          id="btn-portal-logout"
          className="absolute top-4 right-4 text-[9px] font-bold uppercase text-stone-400 tracking-wider hover:text-white bg-stone-800 hover:bg-red-900/30 px-2 py-1 rounded transition-all cursor-pointer"
        >
          Déconnexion
        </button>

        <div className="relative z-10 flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-14 w-14 rounded-full border-2 border-white object-cover bg-stone-800"
          />
          <div>
            <h2 className="text-lg font-bold tracking-tight">{user.name}</h2>
            <div className="mt-1 flex items-center space-x-1.5">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                Membre {user.membershipTier}
              </span>
              <span className="text-xs text-stone-300">• {user.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Decorative ambient bubble */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-stone-800/40 blur-2xl" />
      </div>

      {/* Real-time Quick Action Hub: Admin site database & Google account */}
      <div className="grid grid-cols-2 gap-3 mb-6" id="nav-badge-section">
        <button
          onClick={() => onNavigate('admin')}
          className="rounded-2xl border-2 border-stone-900 bg-stone-900 text-white p-3.5 flex flex-col justify-between hover:bg-stone-850 transition-all shadow-sm cursor-pointer group text-left active:scale-98"
        >
          <div className="flex justify-between items-start w-full">
            <Key className="h-4.5 w-4.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold bg-stone-800 text-amber-400 px-2 py-0.5 rounded">
              Console
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold leading-tight">Console Admin</h4>
            <p className="text-[9px] text-stone-400 mt-0.5">Produits, stocks, commandes</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('auth')}
          className="rounded-2xl border border-stone-200 bg-white text-stone-900 p-3.5 flex flex-col justify-between hover:border-stone-300 transition-all shadow-sm cursor-pointer text-left active:scale-98 group"
        >
          <div className="flex justify-between items-start w-full">
            <svg className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.927h6.6c-.29 1.5-.145 2.1-.145 2.1l3.523 2.733c2.062-1.9 3.255-4.7 3.255-7.7c-.012.012-.012.012-.033.012" />
              <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.523-2.733c-1.1.74-2.5 1.18-4.437 1.18c-3.4 0-6.27-2.3-7.3-5.4L1.08 17.26C3.12 21.2 7.24 24 12 24" />
              <path fill="#FBBC05" d="M4.7 14.14c-.26-.77-.41-1.6-.41-2.46s.15-1.69.41-2.46L1.08 6.74C.39 8.12 0 10.02 0 12s.39 3.88 1.08 5.26z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0C7.24 0 3.12 2.8 1.08 6.74L4.7 9.22c1.03-3.1 3.9-5.4 7.3-4.47" />
            </svg>
            <span className="text-[9px] uppercase tracking-wider font-extrabold bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
              Google
            </span>
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold leading-tight">Compte Google</h4>
            <p className="text-[9px] text-stone-500 mt-0.5 font-medium">Connexion & Inscription</p>
          </div>
        </button>
      </div>

      {/* Profile Saved Success Feedback */}
      <AnimatePresence>
        {saveFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 flex items-center space-x-2 rounded-xl bg-emerald-55 bg-emerald-50 border border-emerald-100 p-3 text-xs font-semibold text-emerald-800"
          >
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Changements enregistrés avec succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loyalty Points Panel */}
      <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Programme Fidélité
            </h3>
          </div>
          <span className="text-xs font-extrabold text-stone-500">
            {user.points} <span className="text-[10px] text-stone-400">PTS</span>
          </span>
        </div>

        {/* Level progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1.5">
            <span>Palier Suivant</span>
            <span>{user.points} / {nextTierPoints} pts</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full bg-stone-900 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Points Exchange Reward Engine */}
        <div className="rounded-xl bg-stone-50 p-4 border border-stone-100">
          <p className="text-xs text-stone-500 leading-relaxed mb-3">
            Échangez <strong className="text-stone-800">100 points</strong> de fidélité contre un bon de réduction instantané de <strong className="text-stone-800">{formatPrice(5000)}</strong> applicable lors de votre commande.
          </p>
          <button
            id="btn-redeem-points"
            onClick={handleRedeemPoints}
            disabled={user.points < 100}
            className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
              user.points >= 100
                ? 'bg-amber-500 text-stone-950 hover:bg-amber-600 active:scale-98'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            Échanger 100 pts pour un bon de 5 000 FCFA
          </button>

          {/* Newly printed coupon */}
          <AnimatePresence>
            {exchangeSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0 }}
                className="mt-3 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-center"
              >
                <div className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest">
                  Félicitations ! Votre code promo :
                </div>
                <div className="mt-1 font-mono text-base font-black text-amber-950 tracking-wider">
                  {exchangeSuccess}
                </div>
                <div className="mt-1 text-[9px] text-amber-700">
                  Code copié ! Il a également été ajouté automatiquement à vos coupons disponibles.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Editable / viewable Personal Info Card */}
      <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Informations du Client
          </h3>
          <button
            id="btn-edit-profile-toggle"
            onClick={() => {
              if (isEditing) {
                // reset state if cancel
                setName(user.name);
                setEmail(user.email);
                setPhone(user.phone);
                setAddress(user.address);
              }
              setIsEditing(!isEditing);
            }}
            className="text-xs font-bold text-stone-600 underline hover:text-stone-900"
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Prénom & Nom
              </label>
              <input
                id="edit-profile-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 px-3 text-xs font-semibold focus:border-stone-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Adresse email
              </label>
              <input
                id="edit-profile-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 px-3 text-xs font-semibold focus:border-stone-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Téléphone mobile
              </label>
              <input
                id="edit-profile-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 px-3 text-xs font-semibold focus:border-stone-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Adresse de livraison par défaut
              </label>
              <textarea
                id="edit-profile-address"
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 px-3 text-xs font-semibold focus:border-stone-500 focus:outline-none"
              />
            </div>

            <button
              id="btn-save-profile"
              type="submit"
              className="w-full rounded-xl bg-stone-900 py-3 text-xs font-bold text-white hover:bg-stone-800 transition-colors"
            >
              Enregistrer les options
            </button>
          </form>
        ) : (
          <div className="space-y-3.5">
            <div className="flex items-center space-x-3 text-xs text-stone-700">
              <User className="h-4 w-4 text-stone-400 flex-shrink-0" />
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-stone-700">
              <Mail className="h-4 w-4 text-stone-400 flex-shrink-0" />
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-stone-700">
              <Phone className="h-4 w-4 text-stone-400 flex-shrink-0" />
              <span className="font-medium">{user.phone}</span>
            </div>
            <div className="flex items-start space-x-3 text-xs text-stone-700">
              <MapPin className="h-4 w-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{user.address}</span>
            </div>
          </div>
        )}
      </div>

      {/* Wishlist Shortcut panel */}
      <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm mb-6">
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-3 mb-4">
          <Heart className="h-4.5 w-4.5 text-red-500 fill-red-500" />
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Ma Liste d’Envies ({wishlistProducts.length})
          </h3>
        </div>

        {wishlistProducts.length === 0 ? (
          <p className="text-center py-4 text-xs text-stone-400">
            Votre liste d'envies est vide. Remplissez-le d'inspiration depuis notre catalogue.
          </p>
        ) : (
          <div className="no-scrollbar -mx-2 flex overflow-x-auto space-x-3 px-2 pb-1">
            {wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 w-32 rounded-xl border border-stone-100 p-2 cursor-pointer hover:border-stone-205"
                onClick={() => onSelectProduct(p)}
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-50">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <button
                    id={`btn-remove-wishlist-p-${p.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-1 right-1 rounded-full bg-white/90 p-1 text-stone-500 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <h4 className="mt-1.5 font-bold text-stone-800 text-[11px] truncate">{p.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-stone-900 font-extrabold text-[11px]">{formatPrice(p.price)}</span>
                  <ArrowRight className="h-3 w-3 text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Tracking History */}
      <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-3 mb-4">
          <History className="h-4.5 w-4.5 text-stone-650" />
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Suivi des Commandes ({orders.length})
          </h3>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-stone-400">Vous n'avez pas encore effectué d'achats.</p>
            <p className="text-[10px] text-stone-405 mt-1">Vos commandes apparaîtront ici pour le suivi de livraison.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              return (
                <div key={order.id} className="border-b border-stone-100 last:border-0 pb-5 last:pb-0">
                  {/* Order header details */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div>
                      <span className="font-extrabold text-stone-800">Cde #{order.id}</span>
                      <span className="text-stone-400 ml-2">• {order.date}</span>
                    </div>
                    <span className="font-black text-stone-950">{formatPrice(order.total)}</span>
                  </div>

                  {/* List of ordered items preview */}
                  <div className="flex items-center space-x-1.5 mb-4 overflow-x-auto py-0.5 no-scrollbar">
                    {order.items.map((item, id) => (
                      <div key={id} className="flex-shrink-0 flex items-center space-x-2 rounded-lg bg-stone-50 border border-stone-100 p-1 pr-2">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                        <div className="text-[10px]">
                          <p className="font-bold text-stone-800 truncate max-w-[80px]">{item.product.name}</p>
                          <p className="text-stone-400">Qté: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipment Tracking Progress Timeline */}
                  <div className="mb-4">
                    <OrderTimeline order={order} />
                  </div>

                  {/* Simulation Helper - advance active package (out of convenience & interactive play) */}
                  {order.status !== 'Livré' && (
                    <div className="flex justify-end">
                      <button
                        id={`btn-advance-status-${order.id}`}
                        onClick={() => onAdvanceOrderStatus(order.id)}
                        className="rounded-lg bg-stone-100 hover:bg-stone-200 px-3 py-1.5 text-[10px] font-bold text-stone-700 transition-colors flex items-center space-x-1"
                      >
                        <span>Simuler l’étape suivante</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
