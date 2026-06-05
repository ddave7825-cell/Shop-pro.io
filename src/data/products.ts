/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Review } from '../types';

export const CATEGORIES = [
  { id: 'all', name: 'Tous' },
  { id: 'phones', name: 'Smartphones (Quasi-Neufs)' },
  { id: 'maison', name: 'Maison & Décor' },
  { id: 'tech', name: 'Tech & Audio' },
  { id: 'studio', name: 'Studio & Papeterie' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'phone-0',
    name: 'iPhone 15 Pro Max (Titane Désert) - Quasi-Neuf',
    description: 'Le fleuron absolu d’Apple dans son état le plus pur. Boîtier titane premium, zoom optique 5x de pointe et puce A17 Pro. Aucune rayure (Grade A+ - État Vitrine). Batterie certifiée d’origine à 99% d’état de santé.',
    price: 695000,
    rating: 4.9,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    category: 'phones',
    brand: 'Apple',
    specs: {
      'État': 'Quasi-Neuf (Grade A+ - État Vitrine)',
      'Santé Batterie': '99% (Certifiée d’origine)',
      'Garantie': '12 mois Garantie Ateliers.M',
      'Stockage': '256 Go',
      'Écran': 'Super Retina XDR OLED 6.7"',
      'Processeur': 'Puce A17 Pro hexacœur',
    },
    colors: [
      { name: 'Titane Désert', hex: '#C2B29F' },
      { name: 'Titane Naturel', hex: '#8E8E93' },
      { name: 'Titane Noir', hex: '#1C1C1E' }
    ],
    featured: true,
    inStock: true,
  },
  {
    id: 'phone-1',
    name: 'iPhone 15 Pro (Titane) - Quasi-Neuf',
    description: 'Smartphone haut de gamme. État impeccable (Grade A+), sans aucune rayure visible. Batterie certifiée d’origine avec santé à 98%. Livré dans son coffret avec câble de recharge USB-C rapide.',
    price: 545000,
    rating: 4.8,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
    category: 'phones',
    brand: 'Apple',
    specs: {
      'État': 'Quasi-Neuf (Grade A+ - État Vitrine)',
      'Santé Batterie': '98% (Certifiée d’origine)',
      'Garantie': '12 mois Garantie Ateliers.M',
      'Stockage': '128 Go',
      'Écran': 'Super Retina XDR OLED 6.1"',
      'Processeur': 'Puce A17 Pro hexacœur',
    },
    colors: [
      { name: 'Titane Naturel', hex: '#8E8E93' },
      { name: 'Titane Noir', hex: '#1C1C1E' }
    ],
    featured: true,
    inStock: true,
  },
  {
    id: 'phone-1-pm',
    name: 'iPhone 14 Pro Max (Violet Intense) - Quasi-Neuf',
    description: 'L’incroyable iPhone 14 Pro Max avec Dynamic Island et appareil photo principal de 48 Mpx. Écran ultra-lumineux sans aucune trace d’usure (Grade A). Testé et certifié par nos ingénieurs.',
    price: 495000,
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1695048065007-df95c6907840?w=600&auto=format&fit=crop&q=80',
    category: 'phones',
    brand: 'Apple',
    specs: {
      'État': 'Quasi-Neuf (Grade A - Micro-traces de vie)',
      'Santé Batterie': '96% (Parfait état de santé)',
      'Garantie': '12 mois Garantie Ateliers.M',
      'Stockage': '128 Go',
      'Écran': 'Super Retina XDR OLED 6.7"',
      'Capteur photo': 'Capteur principal 48 Mpx',
    },
    colors: [
      { name: 'Violet Intense', hex: '#3B3542' },
      { name: 'Or Impérial', hex: '#F4E2C5' },
      { name: 'Noir Sidéral', hex: '#1F2022' }
    ],
    featured: true,
    inStock: true,
  },
  {
    id: 'phone-1-13p',
    name: 'iPhone 13 Pro (Bleu Alpin) - Quasi-Neuf',
    description: 'Écran ProMotion 120Hz et triple capteur légendaire. Un smartphone robuste au design iconique. Livré sous film protecteur, chargeur rapide 20W inclus par Ateliers.M.',
    price: 350000,
    rating: 4.7,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    category: 'phones',
    brand: 'Apple',
    specs: {
      'État': 'Quasi-Neuf (Grade A - Très bon état)',
      'Santé Batterie': '95% (Hautement performante)',
      'Garantie': '12 mois Garantie Ateliers.M',
      'Stockage': '128 Go',
      'Écran': 'Super Retina XDR OLED 6.1" ProMotion',
    },
    colors: [
      { name: 'Bleu Alpin', hex: '#A7C1D1' },
      { name: 'Argent Royal', hex: '#E2E8F0' },
      { name: 'Graphite', hex: '#4B5563' }
    ],
    featured: false,
    inStock: true,
  },
  {
    id: 'phone-1-12',
    name: 'iPhone 12 (Noir Absolu) - Quasi-Neuf',
    description: 'Le best-seller indétronable. Design angulaire ultra-léger et connectique 5G. État esthétique proche du neuf (Grade A+ - Reconditionné France), testé rigoureusement sur 45 points de contrôle.',
    price: 210000,
    rating: 4.6,
    reviewsCount: 48,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
    category: 'phones',
    brand: 'Apple',
    specs: {
      'État': 'Quasi-Neuf (Grade A+ - Certifié Vitrine)',
      'Santé Batterie': '94% (Grande longévité)',
      'Garantie': '12 mois Garantie Ateliers.M',
      'Stockage': '128 Go',
      'Écran': 'Super Retina XDR OLED 6.1"',
    },
    colors: [
      { name: 'Noir Absolu', hex: '#111827' },
      { name: 'Blanc Pur', hex: '#F9FAFB' },
      { name: 'Rouge (Product)', hex: '#EF4444' }
    ],
    featured: false,
    inStock: true,
  },
  {
    id: 'phone-2',
    name: 'Samsung Galaxy S24 Ultra - Quasi-Neuf',
    description: 'Le fleuron ultime de Samsung dopé à l’intelligence artificielle Galaxy AI. Écran somptueux ultra-lumineux et zoom x100. État esthétique exceptionnel, fourni avec son stylet S-Pen d’origine.',
    price: 650000,
    rating: 4.9,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    category: 'phones',
    brand: 'Samsung',
    specs: {
      'État': 'Quasi-Neuf (Grade A - Micro-traces imperceptibles)',
      'Santé Batterie': '96% (Testée complète)',
      'Garantie': '12 mois Garantie Ateliers.M',
      'Stockage': '256 Go',
      'Écran': 'Dynamic AMOLED 2X 6.8" 120Hz',
      'Caméra': 'Capteur principal 200 Mpx',
    },
    colors: [
      { name: 'Noir Titane', hex: '#212121' },
      { name: 'Gris Sidéral', hex: '#616161' }
    ],
    featured: true,
    inStock: true,
  },
  {
    id: 'phone-3',
    name: 'Google Pixel 8 Pro - Quasi-Neuf',
    description: 'L’intelligence photographique Google ultime avec Magic Eraser et Best Take. État proche du neuf (Grade A+), aucun choc ni rayure. Verre trempé premium pré-installé par nos techniciens.',
    price: 390000,
    rating: 4.7,
    reviewsCount: 22,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    category: 'phones',
    brand: 'Google',
    specs: {
      'État': 'Quasi-Neuf (Grade A+ - Reconditionné France)',
      'Santé Batterie': '97% (Qualité premium)',
      'Garantie': '12 mois Garantie Ateliers.M',
      'Stockage': '128 Go',
      'Écran': 'OLED LTPO Super Actua 6.7"',
    },
    colors: [
      { name: 'Porcelaine', hex: '#FAF9F6' },
      { name: 'Bleu Cosmique', hex: '#A0C4DF' }
    ],
    featured: false,
    inStock: true,
  },
  {
    id: 'prod-1',
    name: 'Lampe d’Ambiance Ovale',
    description: 'Une lampe de table sculpturale en céramique avec une lumière chaude modulable. Conçue pour apaiser votre espace de travail ou votre table de chevet avec un design organique intemporel.',
    price: 55000,
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    category: 'maison',
    brand: 'Nórdic Design',
    specs: {
      'Matériau': 'Grès émaillé et verre opale',
      'Source de lumière': 'LED intégrée 5W (variable)',
      'Dimensions': 'Hauteur 24cm, Diamètre 16cm',
      'Alimentation': 'Câble USB-C tressé (1.5m)',
    },
    colors: [
      { name: 'Sable', hex: '#E6DFD3' },
      { name: 'Charbon', hex: '#2A2A2A' },
      { name: 'Terre cuite', hex: '#C07C64' }
    ],
    featured: true,
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'Casque Audio Sans Fil "Aether"',
    description: 'Le summum du minimalisme sonore. Annulation active du bruit hybride, autonomie de 40 heures et matériaux ultra-confortables en aluminium et cuir de pomme végétal.',
    price: 165000,
    rating: 4.9,
    reviewsCount: 86,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    category: 'tech',
    brand: 'Aether Lab',
    specs: {
      'Transducteurs': 'Néodyme 40mm personnalisés',
      'Autonomie': 'Jusqu’à 40 heures (sans ANC)',
      'Port de charge': 'USB-C (charge rapide 10 min = 5h)',
      'Connectivité': 'Bluetooth 5.2 & Entrée Jack 3.5mm',
    },
    colors: [
      { name: 'Argent Lunaire', hex: '#D1D5DB' },
      { name: 'Noir Absolu', hex: '#111827' }
    ],
    featured: true,
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'Organisateur de Bureau en Chêne',
    description: 'Taillé dans une seule pièce de chêne certifié FSC, cet organisateur permet de ranger votre téléphone, vos stylos et petits accessoires avec élégance géométrique.',
    price: 30000,
    rating: 4.6,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    category: 'studio',
    brand: 'Atelier Silva',
    specs: {
      'Matériau': 'Chêne massif huilé',
      'Finition': 'Huile de lin naturelle sans COV',
      'Dimensions': '30cm x 12cm x 3cm',
      'Compartiments': '4 zones magnétiques intégrées',
    },
    colors: [
      { name: 'Chêne Naturel', hex: '#D7A15C' },
      { name: 'Noyer Foncé', hex: '#5C4033' }
    ],
    featured: false,
    inStock: true,
  },
  {
    id: 'prod-4',
    name: 'Cafetière pour Infusion à Froid Spatiale',
    description: 'Un extracteur d’infusion à froid esthétique en verre borosilicate double paroi. Préparez un café incroyablement doux, fruité et faible en acidité sans quitter votre cuisine.',
    price: 45000,
    rating: 4.7,
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    category: 'maison',
    brand: 'Koffee Lab',
    specs: {
      'Matériau': 'Verre borosilicate résistant à la chaleur',
      'Filtre': 'Micro-maille en acier inoxydable 304',
      'Capacité': '850ml (env. 6 tasses)',
      'Nettoyage': 'Compatible lave-vaisselle',
    },
    colors: [
      { name: 'Verre Clair', hex: '#F3F4F6' },
      { name: 'Fumé Sombre', hex: '#4B5563' }
    ],
    featured: true,
    inStock: true,
  },
  {
    id: 'prod-5',
    name: 'Enceinte Bluetooth de Poche "Bulle"',
    description: 'Petite par la taille, immense par le son. Cette enceinte en aluminium recyclé est étanche (IPX7) et propose une diffusion sonore enveloppante à 360 degrés.',
    price: 50000,
    rating: 4.5,
    reviewsCount: 55,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    category: 'tech',
    brand: 'Aether Lab',
    specs: {
      'Haut-parleur': 'Radiateurs passifs doubles, 10W',
      'Étanchéité': 'IPX7 (immersion 1m pendant 30 min)',
      'Autonomie': '15 heures à volume moyen',
      'Batterie': 'Recharge complète en 2h',
    },
    colors: [
      { name: 'Gros Sel', hex: '#E5E7EB' },
      { name: 'Sauge Sauvage', hex: '#8FBC8F' },
      { name: 'Bleu Crépuscule', hex: '#1E3A8A' }
    ],
    featured: false,
    inStock: true,
  },
  {
    id: 'prod-6',
    name: 'Carnet de Notes à Grille Quadrillée',
    description: 'Carnet haut de gamme avec reliure suisse à plat. Papier japonais sans acide 120g idéal pour l’écriture à l’encre, l’esquisse ou l’organisation bullet journal.',
    price: 15000,
    rating: 4.9,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    category: 'studio',
    brand: 'Paper Kraft',
    specs: {
      'Format': 'A5 (148 x 210 mm)',
      'Nombre de pages': '160 pages numérotées',
      'Type de papier': 'Papier de riz ultra-lisse 120g/m²',
      'Reliure': 'Couture Singer apparente ouverte à plat',
    },
    colors: [
      { name: 'Gris Brume', hex: '#9CA3AF' },
      { name: 'Vert Forêt', hex: '#14532D' },
      { name: 'Jaune Safran', hex: '#D97706' }
    ],
    sizes: ['Format A5', 'Format Pocket A6'],
    featured: false,
    inStock: true,
  },
  {
    id: 'prod-7',
    name: 'Support d’Écran Rotatif Ergonomique',
    description: 'Élevez votre flux de travail et votre posture. Fabriqué en contreplaqué bouleau cintré robuste avec une base en acier feutré pour protéger le bureau et ranger le clavier dessous.',
    price: 75000,
    rating: 4.7,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    category: 'studio',
    brand: 'Atelier Silva',
    specs: {
      'Matériau': 'Contreplaqué de bouleau d’Europe du Nord',
      'Charge maximale': 'Pouvant supporter jusqu’à 25 kg',
      'Dimensions': '54cm x 22cm x 11.5cm',
      'Espace inférieur': 'Dégagement de 9.5cm pour clavier',
    },
    colors: [
      { name: 'Bouleau Clair', hex: '#F3E5AB' },
      { name: 'Teinté Ébène', hex: '#1F2937' }
    ],
    featured: true,
    inStock: false,
  },
  {
    id: 'prod-8',
    name: 'Bougie Parfumée "Brumes de l’Est"',
    description: 'Un parfum apaisant de cèdre fumé, d’aiguilles de pin fraîches et d’ambre doux formulé avec de la cire de soja biologique coulée à la main dans un pot en argile durable réutilisable.',
    price: 20000,
    rating: 4.4,
    reviewsCount: 63,
    image: 'https://images.unsplash.com/photo-1603006905393-0d4bfc876f82?w=600&auto=format&fit=crop&q=80',
    category: 'maison',
    brand: 'Nórdic Design',
    specs: {
      'Cire': '100% Cire de soja naturelle sans OGM',
      'Mèche': 'Mèche double en bois de cerisier crépitant',
      'Autonomie de brûlage': 'Environ 55 heures',
      'Poids net': '240g',
    },
    colors: [
      { name: 'Grès Brut', hex: '#D2B48C' }
    ],
    featured: false,
    inStock: true,
  }
];

export const MOCK_REVIEWS: Record<string, Review[]> = {
  'prod-1': [
    { id: 'r-1', userName: 'Sophie L.', rating: 5, comment: 'Sublime objet ! La lumière est très diffuse et réconfortante le soir. La texture de la céramique est superbe au toucher.', date: '2026-05-12' },
    { id: 'r-2', userName: 'Thomas D.', rating: 4, comment: 'Très beau design minimaliste, se marie parfaitement avec mon intérieur scandinave. Un poil plus petite que je ne pensais.', date: '2026-05-20' }
  ],
  'prod-2': [
    { id: 'r-3', userName: 'Marc-Antoine', rating: 5, comment: 'L’annulation du bruit est bluffante et le design est à des années-lumière des casques en plastique bon marché. Le confort est grandiose.', date: '2026-04-18' },
    { id: 'r-4', userName: 'Chloé B.', rating: 4, comment: 'Excellente qualité sonore, basses précises et riches. L’application compagnon pourrait être un peu plus fournie, mais le casque physique est magnifique.', date: '2026-05-02' }
  ],
  'prod-3': [
    { id: 'r-5', userName: 'Julien T.', rating: 5, comment: 'Simple, robuste, élégant. Ça libère enfin de l’espace proprement sur mon bureau. Magnifique odeur de bois brut à l’ouverture.', date: '2026-05-29' }
  ]
};
