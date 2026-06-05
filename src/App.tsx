/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { ProductDetails } from './components/ProductDetails';
import { CustomerPortal } from './components/CustomerPortal';
import { CartAndCheckout } from './components/CartAndCheckout';
import { Footer } from './components/Footer';
import { CatalogSkeleton, ProductDetailsSkeleton } from './components/Skeletons';
import { Product, CartItem, UserProfile, Order } from './types';
import { PRODUCTS } from './data/products';
import { AuthPage } from './components/AuthPage';
import { AdminPanel } from './components/AdminPanel';
import { PhoneComparator } from './components/PhoneComparator';
import { WhatsAppSupport } from './components/WhatsAppSupport';
import { ShoppingBag, ArrowRight, Sparkles, Compass, Shield, Zap, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from './utils';

// Default User state to offer immediate loyalty sandbox testing (150 points let's them convert instantly!)
const DEFAULT_USER: UserProfile = {
  name: 'David S.',
  email: 'david.s@design.fr',
  phone: '06 42 89 51 03',
  address: '14 Rue de la Manufacture, 75011 Paris',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  joinedDate: 'Janvier 2026',
  points: 155,
  membershipTier: 'Argent',
  wishlist: ['prod-1', 'prod-4'],
};

// Default initial order details to let the client inspect the live delivery status tracker instantly
const DEFAULT_ORDERS: Order[] = [
  {
    id: 'AT-895101',
    date: '03 Juin 2026',
    items: [
      {
        id: 'prod-3-Chêne Naturel',
        product: PRODUCTS[2], // Wood desk organizer
        quantity: 1,
        selectedColor: { name: 'Chêne Naturel', hex: '#D7A15C' },
      },
    ],
    total: 30000,
    status: 'Expédié',
    trackingNumber: 'TRK-98510255',
    deliveryMethod: 'Colissimo Standard',
    paymentMethod: 'Carte Bancaire (**** 8951)',
  },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const [currentView, setView] = useState<'home' | 'catalog' | 'product' | 'portal' | 'admin' | 'auth'>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);

  // --- TELEPHONE / SMARTPHONE COMPARATOR STATES ---
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  const handleAddToCompare = (productId: string) => {
    if (comparedIds.includes(productId)) return;
    if (comparedIds.length >= 3) {
      alert("Vous pouvez comparer un maximum de 3 smartphones simultanément. Retirez en un pour pouvoir ajouter ce modèle !");
      return;
    }
    setComparedIds((prev) => [...prev, productId]);
  };

  const handleRemoveFromCompare = (productId: string) => {
    setComparedIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleClearCompare = () => {
    setComparedIds([]);
  };

  // --- PERSISTED APP STATES WITH LOCAL STORAGE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('atelier_products_v2');
    return local ? JSON.parse(local) : PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('atelier_cart_v1');
    return local ? JSON.parse(local) : [];
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const local = localStorage.getItem('atelier_user_v1');
    return local ? JSON.parse(local) : DEFAULT_USER;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('atelier_orders_v1');
    return local ? JSON.parse(local) : DEFAULT_ORDERS;
  });

  const [coupons, setCoupons] = useState<{ code: string; discount: number }[]>(() => {
    const local = localStorage.getItem('atelier_coupons_v1');
    return local ? JSON.parse(local) : [{ code: 'BIENVENUE', discount: 15 }];
  });

  // Save states to local storage on edits
  useEffect(() => {
    localStorage.setItem('atelier_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('atelier_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_user_v1', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('atelier_orders_v1', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_coupons_v1', JSON.stringify(coupons));
  }, [coupons]);

  // --- ADMIN ACTIONS SUITE ---
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleDeleteProduct = (prodId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
  };

  const handleUpdateProductStock = (prodId: string, isAvailable: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, inStock: isAvailable } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  const handleLogout = () => {
    const guestUser: UserProfile = {
      name: 'Utilisateur Invité',
      email: 'non-connecte@google.com',
      phone: 'Non renseigné',
      address: 'Non renseignée',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedDate: 'Juin 2026',
      points: 0,
      membershipTier: 'Bronze',
      wishlist: [],
    };
    setUser(guestUser);
    setView('portal');
  };

  // --- NAVIGATION CALLBACK CALIBRATORS ---
  const handleSelectProduct = (product: Product) => {
    setIsProductLoading(true);
    setActiveProduct(product);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setIsProductLoading(false);
    }, 700);
  };

  const handleBackToCatalog = () => {
    setIsCatalogLoading(true);
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setIsCatalogLoading(false);
    }, 700);
  };

  const handleJumpToCategory = (catId: string) => {
    setIsCatalogLoading(true);
    setSelectedCategory(catId);
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setIsCatalogLoading(false);
    }, 700);
  };

  // --- ACTIONS - CART MANAGEMENT ---
  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const uniqueId = `${item.product.id}-${item.selectedColor?.name || ''}-${item.selectedSize || ''}`;

    setCart((prevCart) => {
      const idx = prevCart.findIndex((x) => x.id === uniqueId);
      if (idx > -1) {
        const copy = [...prevCart];
        copy[idx].quantity += item.quantity;
        return copy;
      } else {
        return [...prevCart, { ...item, id: uniqueId }];
      }
    });
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- ACTIONS - USER & WISHLIST CONTROLS ---
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
  };

  const toggleWishlist = (productId: string) => {
    setUser((prevUser) => {
      const alreadyFav = prevUser.wishlist.includes(productId);
      const nextWishlist = alreadyFav
        ? prevUser.wishlist.filter((id) => id !== productId)
        : [...prevUser.wishlist, productId];

      return {
        ...prevUser,
        wishlist: nextWishlist,
      };
    });
  };

  const handleAddCoupon = (newCoupon: { code: string; discount: number }) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  // --- ACTIONS - ORDERS CONTROLS ---
  const handlePlaceOrder = (newOrderMeta: Omit<Order, 'id' | 'date'>) => {
    const placedOrder: Order = {
      ...newOrderMeta,
      id: `AT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    // Append to list, increment loyalty points (+1 point per 5000 FCFA spent)
    const extraPoints = Math.max(Math.round(newOrderMeta.total / 5000), 5);

    setOrders((prev) => [placedOrder, ...prev]);
    setUser((prevUser) => {
      const nextPoints = prevUser.points + extraPoints;
      // Upgrade tiers depending on points tally
      const nextTier = nextPoints >= 800 ? 'Or' : nextPoints >= 300 ? 'Argent' : 'Bronze';

      return {
        ...prevUser,
        points: nextPoints,
        membershipTier: nextTier,
      };
    });
  };

  // Allow simulator to test tracking phases inside CustomerPortal
  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const stages: Order['status'][] = ['En attente', 'En préparation', 'Expédié', 'Livré'];
        const currentIdx = stages.indexOf(order.status);
        const nextIdx = currentIdx < stages.length - 1 ? currentIdx + 1 : currentIdx;

        return {
          ...order,
          status: stages[nextIdx],
        };
      })
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Blue cover page splash screen with elegant transition */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, transition: { duration: 0.5, ease: 'easeIn' } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-850 text-white"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.55, ease: 'easeOut' }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="flex items-center space-x-2">
                <span className="bg-white text-blue-600 px-4 py-1.5 rounded-2xl text-2xl uppercase font-black tracking-widest shadow-xl">
                  shop
                </span>
                <span className="text-white font-black text-4xl tracking-tight -ml-1">
                  pro
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold tracking-widest text-blue-100 uppercase opacity-90 animate-pulse">
                Technologie Quasi-Neuve & Premium
              </p>
              
              {/* Soft loader spinner bar */}
              <div className="mt-8 h-1 w-28 overflow-hidden rounded-full bg-blue-900/40">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="h-full w-12 rounded-full bg-white"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Header with responsive controls */}
      <Header
        currentView={currentView}
        setView={(v) => {
          setActiveProduct(null);
          if (v === 'catalog') {
            setIsCatalogLoading(true);
            setView('catalog');
            setTimeout(() => {
              setIsCatalogLoading(false);
            }, 700);
          } else {
            setView(v);
          }
        }}
        cart={cart}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main app area structured as a single mobile preview card frame */}
      <main className="flex-1">
        <div className="mx-auto max-w-lg bg-white min-h-[calc(100vh-4rem)] flex flex-col shadow-sm border-x border-stone-100">
          <AnimatePresence mode="wait">
            {/* HOME SCREEN VIEW */}
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col flex-1"
              >
                {/* Visual Editorial Hero Banner */}
                <div className="relative overflow-hidden bg-stone-900 px-6 py-12 text-white">
                  <div className="relative z-10">
                    <span className="flex items-center space-x-1 text-[10px] font-extrabold tracking-widest text-stone-400 uppercase">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                      <span>Collection d’Été 2026</span>
                    </span>
                    <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight">
                      L’épure au service <br />du quotidien.
                    </h2>
                    <p className="mt-2.5 max-w-[280px] text-xs text-stone-300 leading-relaxed">
                      Des objets sculptés avec sincérité. Une harmonie parfaite entre esthétisme scandinave et fonctions intelligentes.
                    </p>

                    <div className="mt-6 flex space-x-3">
                      <button
                        id="btn-hero-catalog"
                        onClick={() => handleJumpToCategory('all')}
                        className="flex items-center space-x-1.5 rounded-xl bg-white px-5 py-3 text-xs font-bold text-stone-950 transition-transform active:scale-95 shadow-md"
                      >
                        <span>Parcourir</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      
                      <button
                        id="btn-hero-fidelity"
                        onClick={() => setView('portal')}
                        className="rounded-xl border border-white/20 hover:border-white/40 px-4 py-3 text-xs font-bold text-white transition-colors"
                      >
                        Espace Client
                      </button>
                    </div>
                  </div>

                  {/* Aesthetic geometric ambient orb decoration */}
                  <div className="absolute top-1/2 -right-8 h-48 w-48 -translate-y-1/2 rounded-full bg-stone-850 opacity-80" />
                </div>

                {/* Micro Category Circles */}
                <div className="px-5 py-6">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-widest mb-4">
                    Inspirations du moment
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'maison', name: 'Maison', desc: 'Lumière & Céramique', color: 'bg-stone-100 hover:bg-stone-200' },
                      { id: 'tech', name: 'Tech & Audio', desc: 'Écoute sensorielle', color: 'bg-stone-100 hover:bg-stone-200' },
                      { id: 'studio', name: 'Studio', desc: 'Rangement & Papier', color: 'bg-stone-100 hover:bg-stone-200' },
                    ].map((cat) => (
                      <button
                        id={`btn-home-cat-${cat.id}`}
                        key={cat.id}
                        onClick={() => handleJumpToCategory(cat.id)}
                        className={`rounded-2xl p-4 text-left border border-stone-100/60 cursor-pointer transition-transform duration-200 active:scale-98 ${cat.color}`}
                      >
                        <h4 className="text-xs font-bold text-stone-900 leading-tight">{cat.name}</h4>
                        <p className="mt-1 text-[9px] text-stone-500 leading-none">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loyalty quick banner advertisement */}
                <div className="mx-5 mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-xl bg-amber-500 p-2 text-stone-950">
                      <Gift className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-950">Inscrivez-vous au Club</h4>
                      <p className="text-[10px] text-amber-900 mt-0.5">Cumulez des précieux points à chaque commande.</p>
                    </div>
                  </div>
                  <button
                    id="btn-home-go-portal"
                    onClick={() => setView('portal')}
                    className="rounded-full bg-stone-900 p-2 text-white hover:bg-stone-800"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Curated selection rows - "Coups de Coeur" */}
                <div className="px-5 py-3 flex-1 bg-gradient-to-b from-white to-stone-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Nos incontournables</span>
                    </h3>
                    <button
                      id="btn-see-all-curated"
                      onClick={() => handleJumpToCategory('all')}
                      className="text-xs font-extrabold text-stone-800 underline underline-offset-4 hover:text-stone-950 flex items-center space-x-0.5"
                    >
                      <span>Voir tout</span>
                    </button>
                  </div>

                  {/* Horizontal visual slider of featured items */}
                  <div className="no-scrollbar -mx-2 flex overflow-x-auto space-x-4 px-2 pb-5">
                    {products.filter((p) => p.featured).map((product) => (
                      <div
                        id={`curated-slide-${product.id}`}
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="flex-shrink-0 w-44 rounded-2xl bg-white border border-stone-100 p-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-stone-50">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h4 className="mt-2.5 font-bold text-stone-800 text-xs truncate">{product.name}</h4>
                        <p className="mt-0.5 text-[10px] font-medium text-stone-400 capitalize">{product.brand}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-extrabold text-stone-950">{formatPrice(product.price)}</span>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            ⭐ {product.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Footer />
              </motion.div>
            )}

            {/* CATALOG VIEW */}
            {currentView === 'catalog' && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1"
              >
                {isCatalogLoading ? (
                  <CatalogSkeleton />
                ) : (
                  <Catalog
                    products={products}
                    onProductClick={handleSelectProduct}
                    user={user}
                    toggleWishlist={toggleWishlist}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    comparedIds={comparedIds}
                    onAddToCompare={handleAddToCompare}
                    onRemoveFromCompare={handleRemoveFromCompare}
                  />
                )}
                <Footer />
              </motion.div>
            )}

            {/* PRODUCT SPECIFIC DETAILS SCREEN */}
            {currentView === 'product' && activeProduct && (
              <motion.div
                key="product"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="flex flex-col flex-1"
              >
                {isProductLoading ? (
                  <ProductDetailsSkeleton />
                ) : (
                  <ProductDetails
                    product={activeProduct}
                    onBack={handleBackToCatalog}
                    onAddToCart={handleAddToCart}
                    userWishlist={user.wishlist}
                    toggleWishlist={toggleWishlist}
                  />
                )}
                <Footer />
              </motion.div>
            )}

            {/* CUSTOMER PORTAL PERSONALIZED AREA */}
            {currentView === 'portal' && (
              <motion.div
                key="portal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1"
              >
                <CustomerPortal
                  user={user}
                  orders={orders}
                  products={products}
                  onUpdateProfile={handleUpdateProfile}
                  onAdvanceOrderStatus={handleAdvanceOrderStatus}
                  toggleWishlist={toggleWishlist}
                  onSelectProduct={handleSelectProduct}
                  onAddCoupon={handleAddCoupon}
                  onLogout={handleLogout}
                  onNavigate={(v) => {
                    setView(v);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <Footer />
              </motion.div>
            )}

            {/* ADMIN CONSOLE PANEL VIEW */}
            {currentView === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1"
              >
                <AdminPanel
                  products={products}
                  orders={orders}
                  onAddProduct={handleAddProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onUpdateProductStock={handleUpdateProductStock}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onClose={() => setView('portal')}
                />
                <Footer />
              </motion.div>
            )}

            {/* GOOGLE SIGN IN / SIGN UP OAUTH VIEW */}
            {currentView === 'auth' && (
              <motion.div
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1"
              >
                <AuthPage
                  onLoginSuccess={(loggedInUser) => {
                    setUser(loggedInUser);
                    setView('portal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onCancel={() => setView('portal')}
                />
                <Footer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Slide-over interactive Shopping Basket Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Dark fuzzy backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-40 bg-stone-950/45 backdrop-blur-sm"
            />

            {/* Right frame panel overlay */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-lg"
            >
              <CartAndCheckout
                cart={cart}
                user={user}
                coupons={coupons}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onPlaceOrder={handlePlaceOrder}
                onClose={() => setIsCartOpen(false)}
                onGotoPortal={() => setView('portal')}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Phone comparator tray & modal popup */}
      <PhoneComparator
        products={products}
        comparedIds={comparedIds}
        onRemoveFromCompare={handleRemoveFromCompare}
        onClearCompare={handleClearCompare}
        onProductClick={handleSelectProduct}
        onAddToCart={(product, color) => {
          handleAddToCart({ product, quantity: 1, selectedColor: color });
          setIsCartOpen(true);
        }}
      />

      {/* Floating interactive WhatsApp Customer Support */}
      <WhatsAppSupport />
    </div>
  );
}
