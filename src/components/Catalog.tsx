/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Check, Star, Heart, X, Sparkles } from 'lucide-react';
import { Product, UserProfile } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils';

interface CatalogProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  user: UserProfile;
  toggleWishlist: (productId: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  comparedIds?: string[];
  onAddToCompare?: (productId: string) => void;
  onRemoveFromCompare?: (productId: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  onProductClick,
  user,
  toggleWishlist,
  selectedCategory,
  setSelectedCategory,
  comparedIds = [],
  onAddToCompare,
  onRemoveFromCompare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-amber-100 text-stone-900 rounded-sm px-0.5 font-medium">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (onlyInStock) count++;
    if (sortBy !== 'recommended') count++;
    return count;
  }, [selectedCategory, onlyInStock, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('recommended');
    setOnlyInStock(false);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesStock = !onlyInStock || product.inStock;

      return matchesSearch && matchesCategory && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first, then name
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, onlyInStock, sortBy]);

  return (
    <div className="px-4 py-4 pb-20">
      {/* Title block */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Catalogue d’Objets</h1>
        <p className="mt-1 text-sm text-stone-500">Un design intelligent, sculpté pour le quotidien.</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <label htmlFor="catalog-search" className="sr-only">
          Rechercher par nom ou description
        </label>
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          id="catalog-search"
          type="text"
          placeholder="Rechercher par nom, description ou marque..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pr-10 pl-10 text-sm font-medium text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:bg-white focus:ring-1 focus:ring-stone-500/20 focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            id="clear-search"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-600 animate-fade-in"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Live search feedback helper */}
      {searchQuery && (
        <div className="mb-4 text-xs font-semibold text-stone-600 bg-amber-50/60 border border-amber-100/60 rounded-lg p-2.5 flex items-center justify-between">
          <span>
            Recherche de <strong className="text-stone-900 border-b border-amber-300">"{searchQuery}"</strong> dans les noms et descriptions
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-stone-800 font-bold">
            {filteredProducts.length} {filteredProducts.length > 1 ? 'résultats' : 'résultat'}
          </span>
        </div>
      )}

      {/* Category Pills (Swipable horizontaly on mobile) */}
      <div className="no-scrollbar -mx-4 mb-5 flex overflow-x-auto px-4 pb-1 space-x-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              id={`cat-pill-${cat.id}`}
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Quick Filter Info & Action Buttons */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-xs font-bold text-stone-800">
            {filteredProducts.length} {filteredProducts.length > 1 ? 'produits' : 'produit'}
          </span>
          {activeFiltersCount > 0 && (
            <button
              id="btn-reset-filters"
              onClick={resetFilters}
              className="text-[11px] font-medium text-amber-600 underline underline-offset-2 hover:text-amber-800"
            >
              Réinitialiser ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Filter Drawer Toggle & Quick Sort Dropdown */}
        <div className="flex items-center space-x-2">
          {/* Quick toggle for stock */}
          <button
            id="btn-toggle-stock"
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              onlyInStock
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>En Stock</span>
          </button>

          {/* Quick Sort Toggle Button */}
          <button
            id="btn-mobile-filters"
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center space-x-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-stone-300 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Trier</span>
          </button>
        </div>
      </div>

      {/* Product List - Beautiful responsive grid */}
      {filteredProducts.length === 0 ? (
        <div className="my-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <Search className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-stone-800">Aucun produit ne correspond à vos critères</p>
          <p className="mt-1 text-xs text-stone-500">Essayez de modifier vos filtres ou mot-clés.</p>
          <button
            id="btn-empty-reset"
            onClick={resetFilters}
            className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 transition-colors"
          >
            Voir tous les produits
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 gap-4"
        >
          {filteredProducts.map((product) => {
            const isFavorite = user.wishlist.includes(product.id);
            return (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col justify-start rounded-2xl bg-white border border-stone-100 p-2 shadow-sm hover:shadow-md transition-all"
              >
                {/* Heart Button */}
                <button
                  id={`btn-wishlist-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 shadow-sm text-stone-600 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-500'
                    }`}
                  />
                </button>

                {/* Highly Visual Image Container */}
                <div
                  className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-50 cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-[1px]">
                      <span className="rounded-md bg-stone-900 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                        Épuisé
                      </span>
                    </div>
                  )}
                  {product.featured && product.inStock && (
                    <div className="absolute bottom-2 left-2 flex items-center space-x-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-extrabold text-stone-900 shadow-sm">
                      <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                      <span>COUP DE CŒUR</span>
                    </div>
                  )}
                </div>

                {/* Product Meta */}
                <div className="mt-3 flex flex-1 flex-col justify-between px-1">
                  <div className="cursor-pointer" onClick={() => onProductClick(product)}>
                    <p className="text-[11px] font-medium tracking-wide text-stone-400 uppercase">
                      {highlightText(product.brand, searchQuery)}
                    </p>
                    <h3 className="mt-0.5 line-clamp-1 text-sm font-bold text-stone-800 group-hover:text-stone-900 transition-colors">
                      {highlightText(product.name, searchQuery)}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-stone-505 text-stone-500 leading-relaxed min-h-[2rem]">
                      {highlightText(product.description, searchQuery)}
                    </p>
                    <div className="mt-2 flex items-center space-x-1 text-amber-500 text-xs">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="font-bold text-stone-850">{product.rating}</span>
                      <span className="text-[10px] text-stone-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-1">
                    <span className="text-base font-extrabold text-stone-900">{formatPrice(product.price)}</span>
                    <div className="flex items-center space-x-1.5">
                      {/* Compare Trigger Button */}
                      {onAddToCompare && onRemoveFromCompare && (
                        <button
                          id={`btn-toggle-compare-${product.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (comparedIds.includes(product.id)) {
                              onRemoveFromCompare(product.id);
                            } else {
                              onAddToCompare(product.id);
                            }
                          }}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                            comparedIds.includes(product.id)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-800'
                          }`}
                          title={comparedIds.includes(product.id) ? "Retirer de la comparaison" : "Comparer ce modèle"}
                        >
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        id={`btn-view-${product.id}`}
                        onClick={() => onProductClick(product)}
                        className="rounded-lg bg-stone-55 text-stone-800 border border-stone-200 px-2.5 py-1 text-xs font-bold transition-all hover:bg-stone-900 hover:text-white"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Sort / Interactive Filter Drawer Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-sm"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl bg-white px-5 py-6 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <span className="text-base font-bold text-stone-900">Options de Tri</span>
                <button
                  id="btn-close-sort-drawer"
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full bg-stone-100 p-1.5 text-stone-500 hover:bg-stone-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Selection items */}
              <div className="mt-4 space-y-2">
                {[
                  { id: 'recommended', label: 'Recommandé (Sélection Atelier)' },
                  { id: 'price-asc', label: 'Prix : du moins cher au plus cher' },
                  { id: 'price-desc', label: 'Prix : du plus cher au moins cher' },
                  { id: 'rating', label: 'Mieux notés (Commentaires des clients)' },
                ].map((option) => {
                  const isSelected = sortBy === option.id;
                  return (
                    <button
                      id={`sort-opt-${option.id}`}
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id as any);
                        setShowMobileFilters(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-stone-50 font-bold text-stone-900'
                          : 'text-stone-605 hover:bg-stone-50'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-stone-900" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <button
                  id="btn-apply-filters"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full rounded-xl bg-stone-900 py-3.5 text-sm font-bold text-white hover:bg-stone-800 transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
