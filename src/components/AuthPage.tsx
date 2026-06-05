/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Shield, Mail, Lock, User, ArrowRight, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleStep, setGoogleStep] = useState<'idle' | 'selecting' | 'loading' | 'success'>('idle');
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState('');

  const handleStandardAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password || (activeTab === 'signup' && !name)) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      setIsLoading(false);
      return;
    }

    // Success Simulation
    setTimeout(() => {
      const mockUser: UserProfile = {
        name: activeTab === 'signup' ? name : (email.split('@')[0] || 'Client'),
        email: email,
        phone: 'Non renseigné',
        address: 'Non renseignée',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        joinedDate: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        points: 50, // Welcome gift points
        membershipTier: 'Bronze',
        wishlist: [],
      };
      setIsLoading(false);
      onLoginSuccess(mockUser);
    }, 1200);
  };

  const startGoogleSignIn = () => {
    setGoogleStep('selecting');
  };

  const selectGoogleAccount = (googleEmail: string, dispName: string) => {
    setSelectedGoogleEmail(googleEmail);
    setGoogleStep('loading');

    setTimeout(() => {
      const targetUser: UserProfile = {
        name: dispName,
        email: googleEmail,
        phone: '06 42 89 51 03',
        address: '14 Rue de la Manufacture, 75011 Paris',
        avatar: googleEmail.includes('david') 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : `https://api.dicebear.com/7.x/adventurer/svg?seed=${googleEmail}`,
        joinedDate: 'Juin 2026',
        points: 155,
        membershipTier: 'Argent',
        wishlist: ['phone-1', 'prod-1'],
      };
      setGoogleStep('success');
      setTimeout(() => {
        onLoginSuccess(targetUser);
      }, 1000);
    }, 1500);
  };

  const handleCustomGoogleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    selectGoogleAccount(email, email.split('@')[0]);
  };

  return (
    <div className="flex-1 bg-stone-50 px-5 py-8" id="google-auth-page">
      <div className="mx-auto max-w-sm">
        
        {/* Back and title */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Retour au magasin
          </button>
          <div className="text-[10px] uppercase tracking-widest font-bold bg-amber-500/10 text-amber-800 px-2.5 py-1 rounded-full flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Sécurisé</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Espace Client</h1>
          <p className="mt-1 text-xs text-stone-500">Inscrivez-vous pour commander et cumuler des points Club</p>
        </div>

        {/* Tab switcher */}
        <div className="bg-stone-200/60 p-1 rounded-xl flex mb-6">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-white shadow text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Se Connecter
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'signup' ? 'bg-white shadow text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Créer un compte
          </button>
        </div>

        <AnimatePresence mode="wait">
          {googleStep === 'idle' ? (
            <motion.div
              key="auth-forms"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Google OAuth Quick Button */}
              <button
                type="button"
                id="btn-google-auth-trigger"
                onClick={startGoogleSignIn}
                className="w-full relative flex items-center justify-center space-x-3 rounded-xl border border-stone-200 bg-white py-3 px-4 shadow-sm hover:bg-stone-50 hover:border-stone-300 transition-colors cursor-pointer group"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.927h6.6c-.29 1.5-.145 2.1-.145 2.1l3.523 2.733c2.062-1.9 3.255-4.7 3.255-7.7c-.012.012-.012.012-.033.012"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.523-2.733c-1.1.74-2.5 1.18-4.437 1.18c-3.4 0-6.27-2.3-7.3-5.4L1.08 17.26C3.12 21.2 7.24 24 12 24"
                  />
                  <path
                    fill="#FBBC05"
                    d="M4.7 14.14c-.26-.77-.41-1.6-.41-2.46s.15-1.69.41-2.46L1.08 6.74C.39 8.12 0 10.02 0 12s.39 3.88 1.08 5.26z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0C7.24 0 3.12 2.8 1.08 6.74L4.7 9.22c1.03-3.1 3.9-5.4 7.3-4.47"
                  />
                </svg>
                <span className="text-xs font-bold text-stone-700 group-hover:text-stone-900">
                  {activeTab === 'login' ? 'Se connecter avec Google' : "S'inscrire avec Google"}
                </span>
              </button>

              <div className="relative my-6 text-center">
                <span className="absolute inset-x-0 top-1/2 -z-10 border-t border-stone-200" />
                <span className="bg-stone-50 px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Ou par email
                </span>
              </div>

              {/* Standard email/password forms */}
              <form onSubmit={handleStandardAuth} className="space-y-4">
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Jean Dupont"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500/20"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500/20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start space-x-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wide uppercase transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <>
                      <span>{activeTab === 'login' ? 'Se Connecter' : 'Créer mon Compte'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            /* INTERACTIVE GOOGLE AUTH DIALOG POPUP SIMULATOR */
            <motion.div
              key="google-popup"
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* Header inside Google card */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  {/* Google Custom G Icon */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.927h6.6c-.29 1.5-.145 2.1-.145 2.1l3.523 2.733c2.062-1.9 3.255-4.7 3.255-7.7c-.012.012-.012.012-.033.012"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.523-2.733c-1.1.74-2.5 1.18-4.437 1.18c-3.4 0-6.27-2.3-7.3-5.4L1.08 17.26C3.12 21.2 7.24 24 12 24"
                    />
                    <path
                      fill="#FBBC05"
                      d="M4.7 14.14c-.26-.77-.41-1.6-.41-2.46s.15-1.69.41-2.46L1.08 6.74C.39 8.12 0 10.02 0 12s.39 3.88 1.08 5.26z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0C7.24 0 3.12 2.8 1.08 6.74L4.7 9.22c1.03-3.1 3.9-5.4 7.3-4.47"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-stone-500">Sign in with Google</span>
                </div>
                <button
                  onClick={() => setGoogleStep('idle')}
                  className="text-stone-300 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {googleStep === 'selecting' && (
                <div>
                  <h3 className="text-sm font-bold text-stone-850 mb-3">Sélectionnez un compte</h3>
                  <p className="text-[11px] text-stone-400 mb-4 leading-relaxed">
                    Atelier.M demande l'autorisation d'accéder à votre nom, votre image de profil Google et votre adresse email.
                  </p>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
                    {/* Pre-populated Google handles */}
                    <button
                      onClick={() => selectGoogleAccount('davsdavid45@gmail.com', 'David S.')}
                      className="w-full flex items-center space-x-3 p-2.5 rounded-xl border border-stone-100 hover:border-amber-300 hover:bg-stone-50 transition-all text-left text-xs font-medium cursor-pointer"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        className="h-8 w-8 rounded-full border border-stone-200"
                        alt="David"
                      />
                      <div>
                        <p className="text-stone-900 font-bold">David S.</p>
                        <p className="text-stone-400 text-[10px]">davsdavid45@gmail.com</p>
                      </div>
                    </button>

                    <button
                      onClick={() => selectGoogleAccount('user-demo@google.com', 'Invité Démo')}
                      className="w-full flex items-center space-x-3 p-2.5 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 transition-all text-left text-xs font-medium cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-600">
                        I
                      </div>
                      <div>
                        <p className="text-stone-900 font-bold">Invité Démo</p>
                        <p className="text-stone-400 text-[10px]">user-demo@google.com</p>
                      </div>
                    </button>
                  </div>

                  {/* Input form custom google account */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Utiliser un autre compte :</p>
                    <form onSubmit={handleCustomGoogleAccount} className="flex space-x-1">
                      <input
                        type="email"
                        required
                        placeholder="votre.email@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 rounded-lg border border-stone-200 bg-stone-50 text-[11px] px-2.5 py-1.5 focus:bg-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-stone-900 text-white rounded-lg px-3 text-[11px] font-bold hover:bg-stone-800"
                      >
                        Valider
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {googleStep === 'loading' && (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin mb-4" />
                  <h4 className="text-xs font-bold text-stone-800">Établissement de la connexion sécurisée...</h4>
                  <p className="text-[10px] text-stone-400 mt-1">Connexion de {selectedGoogleEmail} via Google OAuth 2.0</p>
                </div>
              )}

              {googleStep === 'success' && (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 animate-bounce">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800">Connexion Réussie !</h4>
                  <p className="text-[10px] text-stone-400 mt-1">Bienvenue sur votre espace Atelier.M</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
