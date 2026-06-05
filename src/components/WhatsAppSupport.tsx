/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WhatsAppSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  // Number specified by the user: 0556470423
  // Prefixed with Ivory Coast country code: +225
  const waNumber = '2250556470423';
  const displayPhone = '05 56 47 04 23';

  const defaultTopics = [
    {
      id: 'grade',
      label: '✨ État des téléphones (Quasi-neuf ?)',
      query: 'Bonjour Shop Pro ! Pouvez-vous m\'en dire plus sur l\'état de vos smartphones quasi-neufs et les garanties ?'
    },
    {
      id: 'shipping',
      label: '📦 Livraison en Côte d\'Ivoire & Sous-région',
      query: 'Bonjour ! Je réside en Afrique de l\'Ouest, quelles sont vos conditions et délais de livraison à domicile ?'
    },
    {
      id: 'payments',
      label: '💳 Wave, Orange Money et Airtel Cash',
      query: 'Bonjour, je souhaite commander. Quels sont les moyens de paiement disponibles (Wave, Mobile Money) ?'
    },
    {
      id: 'booking',
      label: '📱 Commander un modèle spécifique',
      query: 'Bonjour, je recherche un modèle de smartphone précis qui n\'est pas affiché sur le site. Pouvez-vous m\'aider ?'
    }
  ];

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelectTopic = (topic: typeof defaultTopics[0]) => {
    setSelectedTopic(topic.id);
    setCustomText(topic.query);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg = encodeURIComponent(customText || 'Bonjour Shop Pro, je souhaite avoir une assistance.');
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${finalMsg}`;
    window.open(waUrl, '_blank');
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed right-4 bottom-20 z-40 sm:right-6">
        <button
          id="btn-whatsapp-bubble"
          onClick={isOpen ? handleClose : handleOpen}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all outline-none border border-emerald-400/20"
          aria-label="Service client WhatsApp"
        >
          <MessageCircle className="h-7 w-7" />
          
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow">
              1
            </span>
          )}
        </button>
      </div>

      {/* Interactive Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-45 bg-stone-900/10 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 210 }}
              className="fixed right-4 bottom-36 z-50 w-[calc(100vw-32px)] max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl border border-stone-150 sm:right-6"
            >
              {/* Box Header (Elegant WhatsApp Theme mixed with shop pro branding) */}
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-sky-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-black text-base uppercase">
                        SP
                      </div>
                      <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-400 border-2 border-emerald-500 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-wide">Service Client Shop Pro</h4>
                      <p className="text-[10px] text-emerald-100/90 flex items-center space-x-1">
                        <span>En ligne</span>
                        <span className="text-[8px]">•</span>
                        <span>Réponse en moins de 5 min</span>
                      </p>
                    </div>
                  </div>
                  <button
                    id="btn-whatsapp-close"
                    onClick={handleClose}
                    className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Contents Area */}
              <div className="max-h-[340px] overflow-y-auto bg-stone-50 p-4 space-y-3.5 no-scrollbar">
                {/* Agent Greeting Bubble */}
                <div className="flex flex-col items-start max-w-[85%] bg-white rounded-2xl p-3 shadow-sm border border-stone-150/50">
                  <span className="text-[10px] font-bold text-emerald-600 mb-0.5">Laetitia • Shop Pro</span>
                  <p className="text-xs text-stone-750 leading-relaxed">
                    Akwaba ! Bienvenue chez <strong>Shop Pro</strong>, votre boutique experte de smartphones quasi-neufs d'origine certifiée.
                  </p>
                  <p className="mt-1.5 text-xs text-stone-750 leading-relaxed">
                    Comment puis-je vous aider aujourd'hui ? Choisissez une question fréquente ou décrivez votre souhait ci-dessous.
                  </p>
                  <span className="mt-1 text-[8px] text-stone-400 self-end">À l'instant</span>
                </div>

                {/* Topics Selection Block */}
                <div className="space-y-1.5 pt-1.5">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1 mb-1">Suggestions</p>
                  {defaultTopics.map((topic) => (
                    <button
                      id={`btn-wa-topic-${topic.id}`}
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      className={`w-full text-left rounded-xl p-2.5 text-xs font-semibold border transition-all flex items-start space-x-2 ${
                        selectedTopic === topic.id
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 shadow-sm'
                          : 'border-stone-150 bg-white text-stone-700 hover:bg-stone-100 hover:border-stone-250'
                      }`}
                    >
                      <span className="mt-0.5">•</span>
                      <span>{topic.label}</span>
                    </button>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="rounded-xl bg-amber-50/60 p-3 border border-amber-100 text-stone-800 text-[10px] leading-relaxed space-y-1 flex flex-col">
                  <p className="font-bold text-amber-900 uppercase tracking-wide">📦 Expédition Rapide & Sécurisée</p>
                  <p className="text-stone-600">
                    Livraisons partout à Abidjan (sous 2 heures), au Sénégal, Cameroun, Bénin, et Togo sous 48h/72h.
                  </p>
                  <p className="text-stone-600 font-semibold">
                    📞 WhatsApp direct : {displayPhone}
                  </p>
                </div>
              </div>

              {/* Chat Input Field Container */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-150/60 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-medium text-stone-800 placeholder-stone-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
                <button
                  id="btn-whatsapp-submit"
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 transition-all shadow-md shrink-0"
                  title="Démarrer la discussion sur WhatsApp"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
