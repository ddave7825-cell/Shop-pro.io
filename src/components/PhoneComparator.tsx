/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { X, Check, ArrowDownUp, Star, ShoppingCart, HelpCircle, Eye, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils';

interface PhoneComparatorProps {
  products: Product[];
  comparedIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, color?: { name: string; hex: string }) => void;
}

export const PhoneComparator: React.FC<PhoneComparatorProps> = ({
  products,
  comparedIds,
  onRemoveFromCompare,
  onClearCompare,
  onProductClick,
  onAddToCart,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get the selected products for comparison
  const comparedProducts = products.filter((p) => comparedIds.includes(p.id));

  if (comparedIds.length === 0) return null;

  // Key specifications for smartphones or other devices to align side-by-side
  const specFields = [
    { label: 'Prix', value: (p: Product) => formatPrice(p.price), highlight: true },
    { label: 'État Esthétique', value: (p: Product) => p.specs['État'] || 'Grade A (Excellent)' },
    { label: 'Santé Batterie', value: (p: Product) => p.specs['Santé Batterie'] || 'Batterie certifiée > 95%' },
    { label: 'Stockage', value: (p: Product) => p.specs['Stockage'] || '128 Go standard' },
    { label: 'Taille d’Écran', value: (p: Product) => p.specs['Écran'] || '6.1" à 6.8" fluide' },
    { label: 'Garantie Offerte', value: (p: Product) => p.specs['Garantie'] || '12 mois Garantie Shop Pro' },
    { label: 'Processeur / Capteur', value: (p: Product) => p.specs['Processeur'] || p.specs['Capteur photo'] || p.specs['Caméra'] || 'Puce optimisée' },
    { label: 'Disponibilité', value: (p: Product) => p.inStock ? '✅ En Stock (Livré ce jour)' : '❌ Rupture temporaire' },
  ];

  // Helper to find the best rating etc.
  const bestRating = Math.max(...comparedProducts.map((p) => p.rating));
  const lowestPrice = Math.min(...comparedProducts.map((p) => p.price));

  return (
    <>
      {/* Floating Bottom comparison bar / tray */}
      <div className="fixed right-4 bottom-4 left-4 z-40 mx-auto max-w-lg">
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 180 }}
          className="rounded-2xl bg-stone-900 px-4 py-3.5 shadow-2xl text-white flex items-center justify-between border border-stone-800"
        >
          <div className="flex items-center space-x-3.5">
            <div className="flex -space-x-2.5">
              {comparedProducts.map((p) => (
                <div key={p.id} className="relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-9 w-9 rounded-full object-cover border-2 border-stone-900 bg-stone-800"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => onRemoveFromCompare(p.id)}
                    className="absolute -top-1 -right-1 rounded-full bg-stone-800 p-0.5 text-stone-400 hover:text-white"
                    title="Retirer"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Comparateur de Modèles</p>
              <p className="text-[10px] text-stone-400 font-medium">
                {comparedProducts.length} sélectionné{comparedProducts.length > 1 ? 's' : ''} (max 3)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClearCompare}
              className="text-[10px] font-bold text-stone-400 hover:text-white transition-colors tracking-wide uppercase mr-1"
            >
              Vider
            </button>
            <button
              id="btn-trigger-compare-modal"
              onClick={() => setIsOpen(true)}
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-black tracking-wider uppercase text-white shadow hover:bg-blue-500 flex items-center space-x-1 transition-all active:scale-95 duration-150"
            >
              <ArrowDownUp className="h-3.5 w-3.5" />
              <span>Comparer</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Comparison Specifications Modal Overlays */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 24, stiffness: 190 }}
              className="fixed inset-x-4 top-10 bottom-10 z-50 mx-auto flex max-w-xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-120 p-5 bg-stone-50">
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600">
                    <ArrowDownUp className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-stone-900">Comparateur de Smartphones</h2>
                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Analyse comparative premium shop-pro</p>
                  </div>
                </div>
                <button
                  id="btn-close-comparator"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-stone-200/60 p-1.5 text-stone-500 hover:bg-stone-300 transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Scrollable specs wrapper */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Product quick info cards row */}
                <div className={`grid gap-3 grid-cols-${comparedProducts.length} border-b border-stone-100 pb-5`}>
                  {comparedProducts.map((product) => {
                    const isLowestPrice = comparedProducts.length > 1 && product.price === lowestPrice;
                    return (
                      <div key={product.id} className="relative flex flex-col items-center text-center p-2 rounded-2xl bg-stone-50/70 border border-stone-200/50">
                        {/* Remove button */}
                        <button
                          onClick={() => onRemoveFromCompare(product.id)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-stone-200 p-1 text-stone-500 hover:text-red-500 hover:bg-red-55 hover:scale-105 transition-all"
                          title="Supprimer la comparaison"
                        >
                          <X className="h-3 w-3" />
                        </button>

                        <div className="aspect-square w-16 overflow-hidden rounded-xl bg-white shadow-sm border border-stone-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <span className="mt-2 text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">{product.brand}</span>
                        <h3 className="mt-1 line-clamp-2 text-xs font-black text-stone-800 leading-tight min-h-[2rem]">
                          {product.name}
                        </h3>

                        {/* Badges */}
                        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
                          {isLowestPrice && (
                            <span className="text-[8px] font-black tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded uppercase border border-emerald-150">
                              Meilleur Prix
                            </span>
                          )}
                          {product.rating === bestRating && comparedProducts.length > 1 && (
                            <span className="text-[8px] font-black tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded uppercase border border-amber-150 flex items-center space-x-0.5">
                              <span>★ Top</span>
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs font-black text-blue-600">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Side-by-side spec grid values */}
                <div className="space-y-4">
                  {specFields.map((field, specIdx) => (
                    <div key={specIdx} className="rounded-xl border border-stone-150 bg-white p-3 shadow-sm">
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-2 border-b border-stone-50 pb-1">
                        {field.label}
                      </h4>
                      <div className={`grid gap-3 grid-cols-${comparedProducts.length}`}>
                        {comparedProducts.map((p) => {
                          const val = field.value(p);
                          const isSpecialHighlight = field.highlight && p.price === lowestPrice;
                          return (
                            <div
                              key={p.id}
                              className={`text-xs p-1.5 rounded-lg ${
                                isSpecialHighlight
                                  ? 'bg-emerald-55 border border-emerald-200/50 font-semibold text-emerald-800'
                                  : 'text-stone-700'
                              }`}
                            >
                              {val}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Action button row for compared products */}
                <div className={`grid gap-3 grid-cols-${comparedProducts.length} pt-4`}>
                  {comparedProducts.map((product) => (
                    <div key={product.id} className="space-y-1.5">
                      <button
                        onClick={() => {
                          onAddToCart(product, product.colors[0]);
                          setIsOpen(false);
                        }}
                        id={`btn-comp-cart-${product.id}`}
                        className={`w-full py-2 px-1 rounded-xl text-[10px] font-extrabold tracking-wider uppercase text-white shadow flex items-center justify-center space-x-1 transition-all ${
                          product.inStock
                            ? 'bg-stone-900 hover:bg-stone-800'
                            : 'bg-stone-300 cursor-not-allowed text-stone-500 shadow-none'
                        }`}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>Prendre</span>
                      </button>
                      <button
                        onClick={() => {
                          onProductClick(product);
                          setIsOpen(false);
                        }}
                        id={`btn-comp-view-${product.id}`}
                        className="w-full py-1.5 border border-stone-200 hover:bg-stone-100 rounded-xl text-[10px] font-bold text-stone-600 flex items-center justify-center space-x-0.5 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Détails</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom notice and general trust parameters */}
              <div className="bg-stone-50 border-t border-stone-150 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-stone-500">
                  <AlertCircle className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                  <span className="text-[10px] font-semibold leading-none">Tous nos téléphones sont certifiés d'origine</span>
                </div>
                <span className="text-[10px] text-stone-400 font-bold">Atelier Shop Pro (2026)</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
