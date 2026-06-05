/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Order } from '../types';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Cpu, 
  Truck, 
  Gift, 
  Check, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Barcode 
} from 'lucide-react';

interface OrderTimelineProps {
  order: Order;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const stages: {
    key: Order['status'];
    labelFr: string;
    labelEn: string;
    description: string;
    icon: React.ComponentType<any>;
  }[] = [
    {
      key: 'En attente',
      labelFr: 'En attente / Reçu',
      labelEn: 'Ordered',
      description: 'Votre commande a été reçue avec succès.',
      icon: ShoppingBag,
    },
    {
      key: 'En préparation',
      labelFr: 'En préparation',
      labelEn: 'Preparing',
      description: 'Contrôle technique rigoureux de votre téléphone.',
      icon: Cpu,
    },
    {
      key: 'Expédié',
      labelFr: 'Expédié',
      labelEn: 'Shipped',
      description: 'Colis remis au transporteur pour la livraison.',
      icon: Truck,
    },
    {
      key: 'Livré',
      labelFr: 'Livré',
      labelEn: 'Delivered',
      description: 'Remis en mains propres à votre adresse.',
      icon: Gift,
    },
  ];

  const currentIdx = stages.findIndex((s) => s.key === order.status);
  
  // Calculate estimated dates based on order date
  const getSimulatedDate = (stepIdx: number) => {
    try {
      const orderDate = new Date(order.date);
      if (isNaN(orderDate.getTime())) return '';
      
      const addedDays = stepIdx * 1; // 1 day per stage
      const targetDate = new Date(orderDate.getTime() + addedDays * 24 * 60 * 60 * 1000);
      
      return targetDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="rounded-xl border border-stone-150 bg-stone-50/50 p-4 font-sans mt-3">
      {/* Overview Metadata Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-150 pb-3 mb-4 text-[11px]">
        <div className="flex items-center space-x-1.5 text-stone-500 font-bold">
          <Clock className="h-3.5 w-3.5 text-blue-600" />
          <span>Statut :</span>
          <span className="text-stone-900 bg-stone-100 px-2 py-0.5 rounded uppercase text-[10px] font-black">
            {order.status}
          </span>
        </div>
        
        {order.trackingNumber && (
          <div className="flex items-center space-x-1 text-stone-500 font-bold">
            <Barcode className="h-3.5 w-3.5 text-stone-400" />
            <span>Suivi :</span>
            <span className="text-stone-800 font-mono font-bold bg-white px-2 py-0.5 rounded border border-stone-100">
              {order.trackingNumber}
            </span>
          </div>
        )}
      </div>

      {/* HORIZONTAL TIMELINE DISPLAY (Hidden on small mobile view, shown on tablet/desktop) */}
      <div className="hidden sm:block relative py-4">
        {/* Connection Line background */}
        <div className="absolute top-[28px] left-[5%] right-[5%] h-[3px] bg-stone-200 -z-10 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentIdx / (stages.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex justify-between">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const IconComponent = stage.icon;
            
            return (
              <div key={stage.key} className="flex flex-col items-center flex-1 px-1 text-center">
                {/* Node bubble representation */}
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all ${
                      isCompleted 
                        ? isCurrent
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-4 ring-blue-100'
                          : 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-white text-stone-400 border-stone-200'
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <Check className="h-4 w-4 stroke-[3px]" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                  </motion.div>

                  {/* Little pulsing indicator on active node */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  )}
                </div>

                {/* Direct info label */}
                <span className={`mt-2.5 text-[10px] font-black tracking-tight leading-none block ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-stone-850' : 'text-stone-400'
                }`}>
                  {stage.labelEn}
                </span>
                <span className="text-[9px] font-bold text-stone-450 block mt-0.5">
                  {stage.labelFr}
                </span>

                <span className="text-[8px] text-stone-400 font-mono mt-1 font-semibold">
                  {getSimulatedDate(idx)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* VERTICAL TIMELINE DISPLAY (Symmetric, elegant, mobile-optimized fallback) */}
      <div className="sm:hidden space-y-4 py-2">
        {stages.map((stage, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const IconComponent = stage.icon;

          return (
            <div key={stage.key} className="flex items-start space-x-3.5 relative">
              {/* Connecting line spacer for vertical nodes */}
              {idx < stages.length - 1 && (
                <div 
                  className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
                    idx < currentIdx ? 'bg-emerald-500' : 'bg-stone-250'
                  }`}
                  style={{ height: 'calc(100% + 8px)' }}
                />
              )}

              {/* Status indicator badge wrapper */}
              <div className="relative">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                  isCompleted 
                    ? isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-4 ring-blue-50/50'
                      : 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-white text-stone-400 border-stone-200'
                }`}>
                  {isCompleted && !isCurrent ? (
                    <Check className="h-4.5 w-4.5 stroke-[3px]" />
                  ) : (
                    <IconComponent className="h-4 w-4" />
                  )}
                </div>
                
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </span>
                )}
              </div>

              {/* Textual labels describing this stage */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs font-black tracking-tight ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-stone-850' : 'text-stone-400'
                  }`}>
                    {stage.labelEn} <span className="text-[10px] text-stone-400 font-bold ml-1.5">• {stage.labelFr}</span>
                  </h4>
                  <span className="text-[9px] font-mono font-bold text-stone-400 whitespace-nowrap">
                    {getSimulatedDate(idx)}
                  </span>
                </div>
                
                {isCurrent && (
                  <motion.p 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="text-[10px] text-stone-600 leading-normal mt-1 pr-2 bg-white/70 p-1.5 rounded-lg border border-stone-150 inline-block font-medium"
                  >
                    {stage.description}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Bottom Delivery Footer Alert */}
      <div className="mt-3 bg-white p-2.5 rounded-xl border border-stone-150 flex items-center space-x-2 text-[10px]">
        <MapPin className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 animate-bounce" />
        <div className="text-stone-650 font-medium">
          <strong>Mode de livraison :</strong> {order.deliveryMethod} &bull; <strong>Paiement :</strong> {order.paymentMethod}
        </div>
      </div>
    </div>
  );
};
