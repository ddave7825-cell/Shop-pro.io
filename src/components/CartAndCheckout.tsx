/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Tag, Check, CreditCard, ChevronRight, Sparkles, MapPin, Truck } from 'lucide-react';
import { CartItem, UserProfile, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils';

interface CartAndCheckoutProps {
  cart: CartItem[];
  user: UserProfile;
  coupons: { code: string; discount: number }[];
  onUpdateCartQty: (itemId: string, qty: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  onClose: () => void;
  onGotoPortal: () => void;
}

export const CartAndCheckout: React.FC<CartAndCheckoutProps> = ({
  cart,
  user,
  coupons,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  onClose,
  onGotoPortal,
}) => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');

  // Shipping choices
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const shippingCost = shippingMethod === 'standard' ? 0 : 10000;

  // Coupon promo code states
  const [promoInput, setPromoInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Address inputs (defaults values from profile)
  const [checkoutName, setCheckoutName] = useState(user.name);
  const [checkoutAddress, setCheckoutAddress] = useState(user.address);
  const [checkoutPhone, setCheckoutPhone] = useState(user.phone);

  // Credit Card mock inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(user.name.toUpperCase());
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Placed order receipt variables
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Computations
  const subTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = activeCoupon ? activeCoupon.discount : 0;
  // Make sure cart can't go below 0
  const finalTotal = Math.max(subTotal + shippingCost - discountAmount, 0);

  // Try apply code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);

    const codeUpper = promoInput.trim().toUpperCase();

    // Look for valid coupons (either dynamically converted coupons or default system coupons)
    const matched = coupons.find((c) => c.code.toUpperCase() === codeUpper) ||
      (codeUpper === 'BIENVENUE' ? { code: 'BIENVENUE', discount: 15 } : null);

    if (matched) {
      setActiveCoupon(matched);
      setPromoInput('');
    } else {
      setCouponError('Le code promo n’est pas valide.');
    }
  };

  // Submit checkout order
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate random order tracking ID
    const sampleOrderId = `AT-${Math.floor(100000 + Math.random() * 900000)}`;

    onPlaceOrder({
      items: [...cart],
      total: finalTotal,
      status: 'En attente',
      trackingNumber: `TRK-${Math.floor(5000000 + Math.random() * 5000000)}`,
      deliveryMethod: shippingMethod === 'standard' ? 'Standard (Gracieuse)' : 'Express (24h)',
      paymentMethod: `Carte Bancaire (**** ${cardNumber.slice(-4) || '4242'})`,
    });

    setPlacedOrderId(sampleOrderId);
    setStep('success');
    onClearCart();
  };

  // Safe credit card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.substring(0, 2)}/${raw.substring(2, 4)}`;
    }
    setCardExpiry(formatted.substring(0, 5));
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-lg flex-col bg-white shadow-xl border-l border-stone-150">
      {/* Checkout Sidebar Header */}
      <div className="sticky top-0 z-25 flex h-16 items-center justify-between border-b border-stone-100 bg-white px-4">
        <button
          id="btn-close-checkout"
          onClick={onClose}
          className="flex items-center space-x-1.5 text-xs font-bold text-stone-605 hover:text-stone-900"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Fermer</span>
        </button>

        <span className="text-sm font-bold text-stone-900 uppercase tracking-widest font-sans">
          {step === 'cart' ? 'Votre Panier' : step === 'shipping' ? 'Livraison' : step === 'payment' ? 'Paiement' : 'Succès'}
        </span>

        <span className="w-14" /> {/* Spacer */}
      </div>

      {/* Main flow items details */}
      <div className="flex-1 overflow-y-auto">
        {/* Step 1: Cart list */}
        {step === 'cart' && (
          <div className="p-4 pb-24">
            {cart.length === 0 ? (
              <div className="my-16 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-stone-300" />
                <h3 className="mt-4 text-sm font-bold text-stone-800">Votre panier est encore vide</h3>
                <p className="mt-1 text-xs text-stone-400">Ajoutez-y des créations authentiques depuis la boutique.</p>
                <button
                  id="btn-basket-resume"
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-stone-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800"
                >
                  Continuer le shopping
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3.5 rounded-2xl border border-stone-100 bg-white p-3 shadow-sm"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="truncate text-xs font-bold text-stone-800">{item.product.name}</h4>
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-stone-400 font-bold uppercase">
                          {item.selectedColor && (
                            <span className="rounded bg-stone-100 px-1.5 py-0.5">
                              {item.selectedColor.name}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="rounded bg-stone-100 px-1.5 py-0.5">
                              {item.selectedSize}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs font-extrabold text-stone-900">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity edit widget */}
                      <div className="flex flex-col items-center justify-between space-y-1.5">
                        <button
                          id={`btn-remove-${item.id}`}
                          onClick={() => onRemoveFromCart(item.id)}
                          className="rounded-full p-1 text-stone-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex items-center rounded-lg border border-stone-150 bg-stone-50 px-1 py-0.5">
                          <button
                            id={`btn-dec-${item.id}`}
                            onClick={() => onUpdateCartQty(item.id, item.quantity - 1)}
                            className="p-1 hover:text-stone-900"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            id={`btn-inc-${item.id}`}
                            onClick={() => onUpdateCartQty(item.id, item.quantity + 1)}
                            className="p-1 hover:text-stone-900"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input Block */}
                <div className="mt-6 rounded-2xl bg-stone-50 p-4 border border-stone-100">
                  <form onSubmit={handleApplyPromo} className="flex space-x-2">
                    <input
                      id="ip-promo-code"
                      type="text"
                      placeholder="Code promo (ex: BIENVENUE)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold uppercase placeholder-stone-400 focus:outline-none"
                    />
                    <button
                      id="btn-apply-promo"
                      type="submit"
                      className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800"
                    >
                      Appliquer
                    </button>
                  </form>

                  {couponError && <p className="mt-1.5 text-[10px] font-bold text-red-500">{couponError}</p>}
                  {activeCoupon && (
                    <div className="mt-2 flex items-center justify-between rounded bg-amber-50 border border-amber-100 px-3 py-1 text-xs">
                      <span className="flex items-center space-x-1 font-bold text-amber-800">
                        <Tag className="h-3 w-3" />
                        <span>Code "{activeCoupon.code}" actif</span>
                      </span>
                      <span className="font-extrabold text-amber-900">-{formatPrice(activeCoupon.discount)}</span>
                    </div>
                  )}
                </div>

                {/* Totals Summary card */}
                <div className="mt-6 border-t border-stone-100 pt-5 space-y-2.5">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Sous-total</span>
                    <span>{formatPrice(subTotal)}</span>
                  </div>
                  {activeCoupon && (
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>Remise</span>
                      <span className="text-amber-600">-{formatPrice(activeCoupon.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Livraison ({shippingMethod === 'standard' ? 'Standard' : 'Express'})</span>
                    <span>{shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-100 pt-3 text-sm font-black text-stone-900">
                    <span>Total final TTC</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Continue checkout CTA */}
                <div className="mt-8">
                  <button
                    id="btn-checkout-step2"
                    onClick={() => setStep('shipping')}
                    className="w-full flex items-center justify-between rounded-xl bg-stone-900 py-3.5 px-5 text-xs font-bold text-white uppercase tracking-wider hover:bg-stone-800"
                  >
                    <span>Passer à la livraison</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Shipping details */}
        {step === 'shipping' && (
          <div className="p-4">
            <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider flex items-center space-x-1.5 border-b border-stone-100 pb-2">
              <MapPin className="h-4.5 w-4.5 text-stone-400" />
              <span>Coordonnées de Livraison</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                  Nom du destinataire
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                  Téléphone mobile
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                  Adresse postale complète
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={3}
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Delivery service package channel */}
            <h3 className="text-sm font-bold text-stone-900 mt-6 mb-4 uppercase tracking-wider flex items-center space-x-1.5 border-b border-stone-100 pb-2">
              <Truck className="h-4.5 w-4.5 text-stone-400" />
              <span>Mode d’expédition</span>
            </h3>

            <div className="space-y-2">
              {/* Option Standard */}
              <button
                id="btn-ship-standard"
                onClick={() => setShippingMethod('standard')}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-stone-850">Livraison Standard (Colissimo)</p>
                  <p className="text-[10px] text-stone-450 mt-0.5">Livraison chez vous sous 3 à 5 jours.</p>
                </div>
                <span className="text-xs font-extrabold text-stone-900">Offerte</span>
              </button>

              {/* Option Express */}
              <button
                id="btn-ship-express"
                onClick={() => setShippingMethod('express')}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  shippingMethod === 'express'
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-stone-850">Expédition Express (DHL 24h)</p>
                  <p className="text-[10px] text-stone-450 mt-0.5">Livré le lendemain avant 13h.</p>
                </div>
                <span className="text-xs font-extrabold text-stone-900">{formatPrice(10000)}</span>
              </button>
            </div>

            {/* Actions list */}
            <div className="mt-8 flex space-x-3">
              <button
                id="btn-back-to-step1"
                onClick={() => setStep('cart')}
                className="rounded-xl border border-stone-200 px-4 py-3.5 text-xs font-bold text-stone-700 hover:border-stone-350"
              >
                Panier
              </button>
              <button
                id="btn-ship-to-step3"
                onClick={() => setStep('payment')}
                className="flex-1 rounded-xl bg-stone-900 py-3.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-stone-800 text-center"
              >
                Passer au paiement
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <div className="p-4">
            <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider flex items-center space-x-1.5 border-b border-stone-100 pb-2">
              <CreditCard className="h-4.5 w-4.5 text-stone-400" />
              <span>Réglement de la Commande</span>
            </h3>

            {/* Exquisite visual Credit Card graphic */}
            <div className="relative mb-6 aspect-[1.58/1] w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-950 p-5 text-white shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                    ATELIER BANK
                  </p>
                  <div className="mt-1 h-7 w-10 rounded bg-amber-500/10 border border-amber-500/20" />
                </div>
                <span className="font-mono text-xs font-bold text-stone-455">VISA GOLD</span>
              </div>

              {/* Card number representation */}
              <div className="mt-6 font-mono text-base tracking-wider text-stone-200">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              {/* Footer specs of the card */}
              <div className="mt-5 flex justify-between items-end">
                <div>
                  <p className="text-[8px] text-stone-500 uppercase tracking-wider">Titulaire</p>
                  <p className="font-sans text-xs font-semibold tracking-wide text-stone-100 uppercase">
                    {cardName || 'NOM DU TITULAIRE'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] text-stone-500 uppercase tracking-widest">Validité</p>
                  <p className="font-mono text-xs tracking-wider text-stone-150">
                    {cardExpiry || 'MM/AA'}
                  </p>
                </div>
              </div>

              {/* Backside circular overlay */}
              <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-stone-700/20 blur-2xl pointer-events-none" />
            </div>

            {/* Inputs to feed the card graphic */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                  Titulaire de la carte
                </label>
                <input
                  id="card-name"
                  type="text"
                  required
                  placeholder="EX: PIERRE DUPONT"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                  Numéro de carte bancaire
                </label>
                <input
                  id="card-number"
                  type="text"
                  required
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                    Expiration (MM/AA)
                  </label>
                  <input
                    id="card-expiry"
                    type="text"
                    required
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                    Cryptogramme (CVV)
                  </label>
                  <input
                    id="card-cvv"
                    type="password"
                    required
                    maxLength={3}
                    placeholder="***"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Order payment summary */}
              <div className="rounded-xl border border-stone-150 bg-stone-50 p-4 mt-6">
                <div className="flex justify-between items-center text-xs font-bold text-stone-550">
                  <span>Montant de la transaction :</span>
                  <span className="text-sm font-black text-stone-900">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  id="btn-pay-back-step2"
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="rounded-xl border border-stone-200 px-4 py-3.5 text-xs font-bold text-stone-700 hover:border-stone-350 bg-white"
                >
                  Retour
                </button>
                <button
                  id="btn-pay-confirm"
                  type="submit"
                  className="flex-1 rounded-xl bg-stone-900 py-3.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-stone-800 text-center"
                >
                  Payer {formatPrice(finalTotal)}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Success confirmation screen */}
        {step === 'success' && (
          <div className="p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-5">
              <Check className="h-7 w-7 stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 font-sans">Achat Finalisé !</h3>
            <p className="mt-2 text-xs text-stone-500">
              Merci pour votre commande, elle a été enregistrée avec succès.
            </p>

            {/* Invoice card mockup snippet */}
            <div className="mt-6 rounded-2xl bg-stone-50 border border-stone-100 p-5 text-left text-xs text-stone-700">
              <div className="flex justify-between border-b border-stone-200 pb-2.5 font-bold mb-3">
                <span>Réf. Commande:</span>
                <span className="text-stone-950">#{placedOrderId}</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <p><strong>Destinataire :</strong> {checkoutName}</p>
                <p><strong>Adresse :</strong> {checkoutAddress}</p>
                <p><strong>Expédition :</strong> {shippingMethod === 'standard' ? 'Colissimo Standard' : 'Express DHL 24h'}</p>
                <p><strong>Mode de paiement :</strong> Carte Bancaire</p>
              </div>

              <div className="mt-4 border-t border-stone-200 pt-3 flex justify-between font-extrabold text-stone-900 text-xs">
                <span>Montant prélevé :</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <p className="mt-4 text-[10px] text-amber-600 font-bold flex items-center justify-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Vous venez de gagner +{Math.max(Math.round(finalTotal / 5000), 5)} points de fidélité !</span>
            </p>

            <div className="mt-8 space-y-3">
              <button
                id="btn-success-goto-orders"
                onClick={() => {
                  onClose();
                  onGotoPortal();
                }}
                className="w-full rounded-xl bg-stone-900 py-3.5 text-xs font-bold text-white uppercase tracking-widest hover:bg-stone-800"
              >
                Suivre mes colis
              </button>
              <button
                id="btn-success-close"
                onClick={onClose}
                className="w-full text-xs font-bold text-stone-500 hover:text-stone-900"
              >
                Retourner à la boutique
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
