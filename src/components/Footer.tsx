/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Compass, Award, LifeBuoy } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-100 bg-white py-10 mt-auto">
      <div className="mx-auto max-w-lg px-6 text-center">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          <div className="flex items-start space-x-2.5">
            <Compass className="h-5 w-5 text-stone-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-[11px] font-bold text-stone-900 uppercase tracking-wider">Conçu pour durer</h4>
              <p className="text-[10px] text-stone-400 mt-0.5">Des matériaux nobles, durables et éco-conçus.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2.5">
            <Award className="h-5 w-5 text-stone-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-[11px] font-bold text-stone-900 uppercase tracking-wider">Programme Fidélité</h4>
              <p className="text-[10px] text-stone-400 mt-0.5">Gagnez des points et débloquez des avantages exclusifs.</p>
            </div>
          </div>
        </div>

        <span className="font-sans text-lg font-black tracking-tight text-blue-600 flex items-center justify-center gap-1 mb-2">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-lg text-xs uppercase font-black tracking-wider">shop</span>
          <span className="text-stone-950 font-black text-base tracking-tight -ml-0.5">pro</span>
        </span>
        
        <p className="mt-2 text-[11px] text-stone-400 leading-relaxed">
          Votre univers de smartphones haut de gamme quasi-neufs et accessoires premium. Tous nos téléphones sont certifiés d'origine, minutieusement testés sur 45 points de contrôle et assortis d'une garantie de 12 mois.
        </p>

        <p className="mt-1.5 text-[10px] text-stone-500 font-bold">
          💳 Wave • Orange Money • MTN MoMo • Cash à la livraison
        </p>

        <div className="mt-4 flex justify-center space-x-4 text-[10px] font-semibold text-stone-500">
          <a href="#mention" className="hover:text-stone-900">Garantie 12 Mois</a>
          <span>•</span>
          <a href="#privacy" className="hover:text-stone-900">Livraison Rapide</a>
          <span>•</span>
          <a href="#support" className="hover:text-stone-900">WhatsApp : 0556470423</a>
        </div>

        <p className="mt-6 text-[9px] font-medium tracking-wider text-stone-300 uppercase">
          © 2026 SHOP PRO BOUTIQUE. TOUS DROITS RÉSERVÉS.
        </p>
      </div>
    </footer>
  );
};
