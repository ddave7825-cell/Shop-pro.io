/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Order, CartItem } from '../types';
import { CATEGORIES } from '../data/products';
import { formatPrice } from '../utils';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
  DollarSign,
  Layers,
  Image,
  Tag,
  Briefcase,
  Layers3,
  X,
  PlusCircle,
  Activity,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProductStock: (id: string, inStock: boolean) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onUpdateOrderStatus,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  // New Product Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(199);
  const [newCategory, setNewCategory] = useState('phones');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80');
  const [newSpecsText, setNewSpecsText] = useState('État: Quasi-Neuf (Grade A+)\nGarantie: 12 mois Ateliers.M\nStockage: 128 Go');
  const [selectedHexColor, setSelectedHexColor] = useState('#111827');
  const [selectedColorName, setSelectedColorName] = useState('Noir Absolu');

  // Performance calculations
  const totalSalesRevenue = orders.reduce((acc, current) => acc + current.total, 0);
  const totalOrdersCount = orders.length;
  const averageBasketValue = totalOrdersCount > 0 ? Math.round(totalSalesRevenue / totalOrdersCount) : 0;
  const itemsInStockCount = products.filter((p) => p.inStock).length;

  // Handle addition of product
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc || !newPrice) return;

    // Parse specifications
    const parsedSpecs: Record<string, string> = {};
    newSpecsText.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        parsedSpecs[parts[0].trim()] = parts.slice(1).join(':').trim();
      } else if (line.trim() !== '') {
        parsedSpecs['Spécification'] = line.trim();
      }
    });

    const createdItem: Product = {
      id: `custom-prod-${Date.now()}`,
      name: newName,
      description: newDesc,
      price: Number(newPrice),
      rating: 5.0,
      reviewsCount: 1,
      image: newImage || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600&auto=format&fit=crop&q=80',
      category: newCategory,
      brand: newBrand || 'Refurbished',
      specs: parsedSpecs,
      colors: [{ name: selectedColorName || 'Standard', hex: selectedHexColor || '#000000' }],
      featured: true,
      inStock: true,
    };

    onAddProduct(createdItem);
    setShowAddForm(false);
    
    // reset form fields
    setNewName('');
    setNewDesc('');
    setNewPrice(199);
  };

  return (
    <div className="flex-1 bg-stone-50 text-stone-900 pb-16">
      {/* Admin header */}
      <div className="sticky top-16 z-20 bg-stone-900 px-5 py-4 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <Activity className="h-5 w-5 text-amber-500 animate-pulse" />
          <div>
            <h1 className="text-sm font-bold tracking-tight uppercase">Ateliers.M - Console Admin</h1>
            <p className="text-[10px] text-stone-400">Base de données en direct et gestion en temps réel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-stone-800 p-2 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
          title="Fermer la console"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Admin tabs */}
      <div className="flex bg-white border-b border-stone-200">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'dashboard'
              ? 'border-stone-900 text-stone-900 bg-stone-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Tableau de Bord
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-stone-900 text-stone-900 bg-stone-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Produits ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-stone-900 text-stone-900 bg-stone-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Commandes ({orders.length})
        </button>
      </div>

      {/* TAB 1: DASHBOARD STATS */}
      {activeTab === 'dashboard' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Stat Box 1 */}
            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Chiffre d’Affaires</span>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-xl font-black text-stone-950">{formatPrice(totalSalesRevenue)}</span>
              </div>
              <p className="text-[9px] text-emerald-600 mt-1 flex items-center space-x-1 font-semibold">
                <TrendingUp className="h-3 w-3" />
                <span>+ 100% (Simulation Live)</span>
              </p>
            </div>

            {/* Stat Box 2 */}
            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Commandes Totales</span>
              <div className="mt-2 text-xl font-black text-stone-950">{totalOrdersCount}</div>
              <p className="text-[9px] text-stone-400 mt-1">Duplicata enregistré localement</p>
            </div>

            {/* Stat Box 3 */}
            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Panier Moyen</span>
              <div className="mt-2 text-xl font-black text-stone-950">{formatPrice(averageBasketValue)}</div>
              <p className="text-[9px] text-stone-400 mt-1">Calculé sur l’historique actif</p>
            </div>

            {/* Stat Box 4 */}
            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Indice de Stock</span>
              <div className="mt-2 text-xl font-black text-stone-950">{itemsInStockCount} / {products.length}</div>
              <p className="text-[9px] text-amber-600 mt-1 font-medium">Référence d’articles actifs</p>
            </div>
          </div>

          {/* Quick instructions panel */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
            <h3 className="text-xs font-bold text-amber-950 flex items-center space-x-2">
              <PlusCircle className="h-4.5 w-4.5 text-amber-600" />
              <span>Simulateur d'Administration Réelle</span>
            </h3>
            <p className="text-[11px] text-amber-900 mt-1.5 leading-relaxed">
              Toutes les modifications que vous effectuez sur cette console, comme <strong>désactiver un stock</strong>,
              <strong> supprimer des articles</strong> ou <strong>ajouter de nouveaux téléphones</strong>, sont immédiatement reportées
              dans l'ensemble du site de manière persistante via synchronisation d'état globale.
            </p>
          </div>

          {/* Categories visualization with fake progress bars */}
          <div className="rounded-2xl bg-white border border-stone-150 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-widest mb-3.5">Répartition de l'Inventaire</h3>
            <div className="space-y-3">
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                const pct = products.length > 0 ? (count / products.length) * 100 : 0;
                return (
                  <div key={cat.id} className="text-xs">
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="text-stone-700">{cat.name}</span>
                      <span className="text-stone-950">{count} {count > 1 ? 'articles' : 'article'}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-stone-800 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CONFIGURATION */}
      {activeTab === 'products' && (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-150">
            <span className="text-xs font-extrabold text-stone-700">Gestion de la base catalogue</span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 rounded-xl bg-stone-950 text-white text-[11px] font-bold tracking-wide uppercase hover:bg-stone-850 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter un produit'}</span>
            </button>
          </div>

          {/* Add product form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                onSubmit={handleSubmitProduct}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-stone-200 rounded-2xl p-4 shadow-md space-y-3.5 overflow-hidden"
              >
                <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <PlusCircle className="h-4 w-4 text-amber-500" />
                    <span>Nouveau Produit</span>
                  </h3>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-stone-400 font-bold hover:text-stone-700 text-xs text-right">Annuler</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Nom du produit</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iPhone 15 Pro, Lampe..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-200 p-2 focus:border-stone-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Marque</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apple, Atelier Silva..."
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-200 p-2 focus:border-stone-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Prix (FCFA)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-stone-200 p-2 focus:border-stone-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Catégorie</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-200 p-2 bg-white focus:outline-none"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="Entrez l'URL d'une image Unsplash ou autre..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-200 p-2 text-stone-605 text-stone-600 focus:border-stone-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Description courte</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Fournissez les caractéristiques phares..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-200 p-2 focus:border-stone-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">
                    Spécifications techniques (Une par ligne au format "Nom: Valeur")
                  </label>
                  <textarea
                    rows={3}
                    placeholder="État: Quasi-Neuf (Grade A+)&#10;Garantie: 12 mois Ateliers.M&#10;Stockage: 128 Go"
                    value={newSpecsText}
                    onChange={(e) => setNewSpecsText(e.target.value)}
                    className="w-full font-mono text-[11px] rounded-lg border border-stone-200 p-2 focus:border-stone-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 bg-stone-55 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Option de Couleur (Label)</label>
                    <input
                      type="text"
                      placeholder="e.g. Titane, Noir, Blanc"
                      value={selectedColorName}
                      onChange={(e) => setSelectedColorName(e.target.value)}
                      className="w-full text-[11px] rounded border border-stone-200 p-1.5 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Code Hexa de couleur</label>
                    <input
                      type="color"
                      value={selectedHexColor}
                      onChange={(e) => setSelectedHexColor(e.target.value)}
                      className="w-full h-8 rounded border border-stone-200 p-1 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 font-bold uppercase text-[10px] tracking-wider text-stone-900 rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Enregistrer et publier sur le site
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* List of active database items */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-3 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
              <span className="text-[10px] tracking-wider uppercase font-bold text-stone-500">Produit</span>
              <span className="text-[10px] tracking-wider uppercase font-bold text-stone-500">Actions</span>
            </div>

            <div className="divide-y divide-stone-100 max-h-[380px] overflow-y-auto no-scrollbar">
              {products.map((p) => (
                <div key={p.id} className="p-3.5 flex items-center justify-between hover:bg-stone-50/50">
                  <div className="flex items-center space-x-3 max-w-[70%]">
                    <img
                      src={p.image}
                      alt=""
                      className="h-10 w-10 object-cover rounded-lg border border-stone-100 bg-stone-100"
                    />
                    <div className="truncate text-xs">
                      <h4 className="font-extrabold text-stone-900 truncate">{p.name}</h4>
                      <p className="text-[10px] text-stone-400 font-medium">
                        {p.brand} • <span className="text-amber-600 font-bold capitalize">{p.category}</span>
                      </p>
                      <p className="text-stone-900 font-black mt-0.5">{formatPrice(p.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Stock switch */}
                    <button
                      onClick={() => onUpdateProductStock(p.id, !p.inStock)}
                      className={`text-[9px] px-2 py-1 rounded-full font-bold transition-all ${
                        p.inStock
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-650 border border-red-100'
                      }`}
                    >
                      {p.inStock ? 'En Stock' : 'Rupture'}
                    </button>

                    {/* Delete item */}
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Supprimer cet item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ORDERS CONFIGURATION */}
      {activeTab === 'orders' && (
        <div className="p-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-xs leading-relaxed text-stone-600">
            <p>
              Pour simuler le parcours utilisateur de bout en bout, changez l'état d'avancement d'une commande ci-dessous.
              Le client pourra voir son statut de livraison actualisé en direct sur son <strong>Espace Client</strong>.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-3 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
              <span className="text-[10px] tracking-wider uppercase font-bold text-stone-500">ID & TOTAL COMMANDE</span>
              <span className="text-[10px] tracking-wider uppercase font-bold text-stone-500">SUIVI LIVRAISON</span>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 font-medium">
                Aucune commande n'a encore été passée sur cette session.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 max-h-[380px] overflow-y-auto no-scrollbar">
                {orders.map((order) => (
                  <div key={order.id} className="p-3.5 space-y-2 hover:bg-stone-50/50">
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <span className="font-extrabold text-stone-900 border-b border-amber-300 pb-0.5 mr-2">
                          #{order.id}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">{order.date}</span>
                      </div>
                      <span className="font-black text-stone-950 text-xs">{formatPrice(order.total)}</span>
                    </div>

                    {/* Order items listing */}
                    <div className="text-[10px] text-stone-505 text-stone-500 italic pl-1 truncate">
                      {order.items.map((it) => `${it.quantity}x ${it.product.name} (${it.selectedColor?.name || 'Standard'})`).join(', ')}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-50">
                      <div className="flex items-center space-x-1 text-[10px] text-stone-400">
                        <Truck className="h-3 w-3" />
                        <span className="line-clamp-1 max-w-[120px]">{order.deliveryMethod}</span>
                      </div>

                      {/* Dropdown status switcher */}
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`text-[10px] font-extrabold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer tracking-wider uppercase transition-all ${
                          order.status === 'Livré'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'Expédié'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : order.status === 'En préparation'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-stone-100 text-stone-800 border border-stone-200'
                        }`}
                      >
                        <option value="En attente">En attente</option>
                        <option value="En préparation">En préparation</option>
                        <option value="Expédié">Expédié</option>
                        <option value="Livré">Livré</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
