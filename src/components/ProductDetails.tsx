/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Star, Heart, Check, Plus, Minus, Shield, Sparkles, MessageSquare } from 'lucide-react';
import { Product, CartItem, Review } from '../types';
import { MOCK_REVIEWS } from '../data/products';
import { motion } from 'motion/react';
import { formatPrice } from '../utils';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  userWishlist: string[];
  toggleWishlist: (productId: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  onAddToCart,
  userWishlist,
  toggleWishlist,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Review states (initially load mock reviews)
  const [reviews, setReviews] = useState<Review[]>(() => {
    return MOCK_REVIEWS[product.id] || [];
  });
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isFavorite = userWishlist.includes(product.id);

  // Recalculate average rating dynamically for absolute fidelity
  const dynamicRating = useMemo(() => {
    if (reviews.length === 0) return product.rating;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  }, [reviews, product.rating]);

  // Handle post new comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !newComment.trim()) return;

    const addedReview: Review = {
      id: `review-user-${Date.now()}`,
      userName: reviewerName,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([addedReview, ...reviews]);
    setReviewerName('');
    setNewComment('');
    setNewRating(5);
    setShowReviewForm(false);
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    onAddToCart({
      product,
      quantity,
      selectedColor,
      selectedSize,
    });
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  return (
    <div className="bg-stone-50 pb-24">
      {/* Detail Header / Nav overlay */}
      <div className="sticky top-16 z-20 flex items-center justify-between bg-white/80 px-4 py-3 border-b border-stone-100 backdrop-blur-md">
        <button
          id="btn-back-to-catalog"
          onClick={onBack}
          className="flex items-center space-x-1.5 rounded-full bg-white p-2 text-stone-700 shadow-sm hover:bg-stone-50 border border-stone-100 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span className="text-xs font-bold font-sans">Retour</span>
        </button>

        <span className="text-xs font-extrabold text-stone-500 uppercase tracking-widest">
          Fiche produit
        </span>

        <button
          id="btn-toggle-wishlist-detail"
          onClick={() => toggleWishlist(product.id)}
          className="rounded-full bg-white p-2 text-stone-500 shadow-sm hover:text-red-500 hover:bg-stone-50 border border-stone-100 transition-all"
        >
          <Heart
            className={`h-4.5 w-4.5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-500'
            }`}
          />
        </button>
      </div>

      <div className="mx-auto max-w-lg">
        {/* Product Image Carousel block */}
        <div className="relative aspect-square w-full bg-white flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full rounded-2xl object-cover shadow-sm"
          />
          {!product.inStock && (
            <div className="absolute inset-x-0 bottom-0 py-3 text-center bg-stone-900/80 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              Cet article n’est plus en stock
            </div>
          )}
        </div>

        {/* Product Basic Info */}
        <div className="mt-2 bg-white px-5 py-6 shadow-sm border-t border-stone-100">
          <span className="text-xs font-extrabold tracking-widest text-stone-400 uppercase">
            {product.brand}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-stone-900">{product.name}</h1>

          <div className="mt-3 flex items-center space-x-4">
            <div className="flex items-center text-amber-500">
              <Star className="h-4.5 w-4.5 fill-current" />
              <span className="ml-1 text-sm font-extrabold text-stone-805">{dynamicRating}</span>
              <span className="ml-1 text-xs text-stone-400">
                ({reviews.length} {reviews.length > 1 ? 'avis' : 'avis'})
              </span>
            </div>
            <span className="h-4 w-px bg-stone-200" />
            <span className="text-xl font-black text-stone-950">{formatPrice(product.price)}</span>
          </div>

          <p className="mt-4 text-stone-600 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Variants Selector */}
        {product.inStock && (
          <div className="mt-2 bg-white px-5 py-6 shadow-sm border-y border-stone-100">
            {/* Color Swatch Selector */}
            <div>
              <span className="block text-xs font-extrabold text-stone-400 uppercase tracking-widest">
                Choix de la nuance :{' '}
                <span className="font-bold text-stone-900 capitalize">{selectedColor.name}</span>
              </span>
              <div className="mt-3 flex space-x-3.5">
                {product.colors.map((color) => {
                  const isColorSelected = selectedColor.name === color.name;
                  return (
                    <button
                      id={`btn-color-${color.name}`}
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`relative h-9 w-9 rounded-full border border-stone-200 shadow-inner flex items-center justify-center transition-all ${
                        isColorSelected
                          ? 'ring-2 ring-stone-900 ring-offset-2 scale-110'
                          : 'hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      {isColorSelected && (
                        <Check
                          className={`h-4 w-4 ${
                            color.hex === '#F3F4F6' || color.hex === '#E5E7EB' || color.hex === '#E6DFD3'
                              ? 'text-stone-900'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Options (if any) */}
            {product.sizes && (
              <div className="mt-6 border-t border-stone-100 pt-5">
                <span className="block text-xs font-extrabold text-stone-400 uppercase tracking-widest">
                  Taille de l’objet : <span className="text-stone-950 font-bold">{selectedSize}</span>
                </span>
                <div className="mt-3 flex space-x-2">
                  {product.sizes.map((size) => {
                    const isSizeSelected = selectedSize === size;
                    return (
                      <button
                        id={`btn-size-${size}`}
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-xl px-4 py-2.5 text-xs font-bold border transition-all ${
                          isSizeSelected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector and CTA Button */}
            <div className="mt-6 border-t border-stone-100 pt-5 flex items-center justify-between space-x-4">
              <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 px-1 py-1">
                <button
                  id="btn-qty-decrement"
                  onClick={decrementQty}
                  className="rounded-lg p-2 text-stone-550 hover:bg-white active:scale-90 transition-all"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-stone-900">{quantity}</span>
                <button
                  id="btn-qty-increment"
                  onClick={incrementQty}
                  className="rounded-lg p-2 text-stone-550 hover:bg-white active:scale-90 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                id="btn-add-to-cart-cta"
                onClick={handleAddToCart}
                disabled={addedFeedback}
                className={`relative flex h-12 flex-1 items-center justify-center rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  addedFeedback
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-98'
                }`}
              >
                {addedFeedback ? (
                  <span className="flex items-center space-x-1.5 animate-bounce">
                    <Check className="h-4 w-4" />
                    <span>Ajouté au panier</span>
                  </span>
                ) : (
                  <span>Ajouter au panier</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Specifications Section */}
        <div className="mt-2 bg-white px-5 py-6 shadow-sm border-t border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
            Caractéristiques techniques
          </h2>
          <div className="overflow-hidden rounded-xl border border-stone-100">
            <table className="w-full text-left text-xs">
              <tbody>
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <tr
                    key={key}
                    className={`border-b border-stone-100 last:border-0 ${
                      idx % 2 === 0 ? 'bg-stone-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-stone-500 w-1/3">{key}</td>
                    <td className="px-4 py-3 text-stone-800">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center space-x-3 text-stone-500 text-xs text-stone-500">
            <Shield className="h-4 w-4 text-stone-400" />
            <span>Garantie constructeur de 2 ans et retour gratuit sous 30 jours.</span>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-2 bg-white px-5 py-6 shadow-sm border-y border-stone-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Avis Clients ({reviews.length})
              </h2>
              <div className="mt-1 flex items-center text-amber-500 text-xs">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="ml-1 font-bold text-stone-800">{dynamicRating}/5</span>
              </div>
            </div>

            <button
              id="btn-toggle-review-form"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center space-x-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-700 hover:border-stone-300 transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Publier un avis</span>
            </button>
          </div>

          {/* New Review Form Drawer */}
          {showReviewForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              onSubmit={handleSubmitComment}
              className="mb-6 rounded-2xl bg-stone-50 p-4 border border-stone-100"
            >
              <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-widest mb-3">
                Votre avis compte
              </h3>

              <div className="space-y-3">
                {/* Reviewer Name */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Votre prénom / nom
                  </label>
                  <input
                    id="reviewer-name-input"
                    type="text"
                    required
                    placeholder="Sébastien G."
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500/20"
                  />
                </div>

                {/* Rating selection (Interactive Stars) */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Attribution des étoiles
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        id={`btn-star-rate-${stars}`}
                        key={stars}
                        type="button"
                        onClick={() => setNewRating(stars)}
                        className="text-amber-400 hover:scale-110 transition-all focus:outline-none"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            stars <= newRating ? 'fill-current text-amber-500' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment area */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Votre commentaire
                  </label>
                  <textarea
                    id="reviewer-comment-input"
                    required
                    rows={3}
                    placeholder="Racontez-nous votre ressenti..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500/20"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    id="btn-cancel-review"
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="rounded-lg bg-stone-200 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-300"
                  >
                    Annuler
                  </button>
                  <button
                    id="btn-submit-review"
                    type="submit"
                    className="rounded-lg bg-stone-900 px-4.5 py-1.5 text-xs font-bold text-white hover:bg-stone-800"
                  >
                    Soumettre l’avis
                  </button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="py-4 text-center text-stone-400 text-xs">
              Aucun avis disponible pour le moment. Soyez le premier à donner votre avis !
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">{review.userName}</span>
                    <span className="text-[10px] text-stone-400">{review.date}</span>
                  </div>
                  <div className="mt-1 flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= review.rating ? 'fill-current' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
