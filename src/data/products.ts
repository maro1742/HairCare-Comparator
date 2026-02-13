import { detectIngredientFlags } from '../lib/ingredients';
import type { Product } from '../types';

type RawProduct = Omit<Product, 'ingredient_flags'>;

const RAW_PRODUCTS: RawProduct[] = [
  {
    id: '1',
    slug: 'olaplex-no4-bond-maintenance-shampoo',
    brand: 'Olaplex',
    name: 'No.4 Bond Maintenance Shampoo',
    category: 'shampoo',
    hair_goals: ['damage', 'frizz'],
    hair_type_fit: ['colored', 'bleached', 'thick'],
    scalp_fit: ['normal', 'dry'],
    free_from: ['parabens', 'sulfates'],
    claims: ['bonding', 'cruelty_free'],
    inci: 'Aqua, Sodium Lauroyl Methyl Isethionate, Cocamidopropyl Betaine, Disodium Laureth Sulfosuccinate, Glycerin, Polyquaternium-10, Bis-Aminopropyl Diglycol Dimaleate, Panthenol, Aloe Barbadensis Leaf Juice, Citric Acid, Sodium Benzoate, Potassium Sorbate, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    popularity: 92,
    offers: [
      { merchant: 'notino', price_pln: 159.00, url: 'https://example.com/out/notino/olaplex-no4?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 165.00, url: 'https://example.com/out/hairstore/olaplex-no4?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '2',
    slug: 'kerastase-nutritive-bain-satin-2',
    brand: 'Kerastase',
    name: 'Nutritive Bain Satin 2',
    category: 'shampoo',
    hair_goals: ['dryness', 'frizz'],
    hair_type_fit: ['thick', 'colored'],
    scalp_fit: ['normal', 'dry'],
    free_from: [],
    claims: ['keratin'],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycol Distearate, Sodium Chloride, Glycerin, Polyquaternium-10, Hydrolyzed Wheat Protein, Niacinamide, Salicylic Acid, Citric Acid, Sodium Benzoate, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceskerastase-bain-satin/400/400',
    popularity: 85,
    offers: [
      { merchant: 'notino', price_pln: 124.00, url: 'https://example.com/out/notino/kerastase-bain-satin?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '3',
    slug: 'olaplex-no5-bond-maintenance-conditioner',
    brand: 'Olaplex',
    name: 'No.5 Bond Maintenance Conditioner',
    category: 'conditioner',
    hair_goals: ['damage', 'frizz', 'dryness'],
    hair_type_fit: ['colored', 'bleached', 'thick'],
    scalp_fit: ['normal'],
    free_from: ['parabens', 'sulfates'],
    claims: ['bonding', 'cruelty_free'],
    inci: 'Aqua, Cetearyl Alcohol, PPG-3 Benzyl Ether Myristate, Behentrimonium Methosulfate, Bis-Aminopropyl Diglycol Dimaleate, Panthenol, Glycerin, Aloe Barbadensis Leaf Juice, Citric Acid, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesolaplex-no5/400/400',
    popularity: 90,
    offers: [
      { merchant: 'notino', price_pln: 155.00, url: 'https://example.com/out/notino/olaplex-no5?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 162.00, url: 'https://example.com/out/hairstore/olaplex-no5?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '4',
    slug: 'loreal-absolut-repair-shampoo',
    brand: "L'Oreal Professionnel",
    name: 'Absolut Repair Shampoo',
    category: 'shampoo',
    hair_goals: ['damage', 'dryness'],
    hair_type_fit: ['thick', 'colored'],
    scalp_fit: ['normal', 'dry'],
    free_from: [],
    claims: ['protein'],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Sodium Chloride, Hydrolyzed Wheat Protein, Quinoa Protein, Lactic Acid, Dimethicone, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesloreal-absolut-repair/400/400',
    popularity: 82,
    offers: [
      { merchant: 'notino', price_pln: 89.00, url: 'https://example.com/out/notino/loreal-absolut-repair?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '5',
    slug: 'redken-acidic-bonding-concentrate-shampoo',
    brand: 'Redken',
    name: 'Acidic Bonding Concentrate Shampoo',
    category: 'shampoo',
    hair_goals: ['damage', 'frizz'],
    hair_type_fit: ['colored', 'bleached'],
    scalp_fit: ['normal'],
    free_from: ['sulfates'],
    claims: ['bonding'],
    inci: 'Aqua, Sodium Lauroyl Methyl Isethionate, Cocamidopropyl Betaine, Glycerin, Citric Acid, Dimethicone, Polyquaternium-10, Sodium Benzoate, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesredken-acidic/400/400',
    popularity: 80,
    offers: [
      { merchant: 'notino', price_pln: 99.00, url: 'https://example.com/out/notino/redken-acidic?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 105.00, url: 'https://example.com/out/hairstore/redken-acidic?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '6',
    slug: 'davines-oi-shampoo',
    brand: 'Davines',
    name: 'OI Shampoo',
    category: 'shampoo',
    hair_goals: ['frizz', 'dryness'],
    hair_type_fit: ['thick', 'curly'],
    scalp_fit: ['normal', 'dry'],
    free_from: ['sulfates', 'parabens'],
    claims: ['vegan', 'cruelty_free'],
    inci: 'Aqua, Disodium Laureth Sulfosuccinate, Cocamidopropyl Betaine, Glycerin, Roucou Oil, Tocopherol, Citric Acid, Sodium Benzoate, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesdavines-oi/400/400',
    popularity: 78,
    offers: [
      { merchant: 'notino', price_pln: 109.00, url: 'https://example.com/out/notino/davines-oi?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '7',
    slug: 'moroccanoil-hydrating-shampoo',
    brand: 'Moroccanoil',
    name: 'Hydrating Shampoo',
    category: 'shampoo',
    hair_goals: ['dryness', 'frizz'],
    hair_type_fit: ['thick', 'curly'],
    scalp_fit: ['normal', 'dry'],
    free_from: ['parabens'],
    claims: ['cruelty_free'],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Glycerin, Keratin, Dimethicone, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesmoroccanoil-hydrating/400/400',
    popularity: 88,
    offers: [
      { merchant: 'notino', price_pln: 119.00, url: 'https://example.com/out/notino/moroccanoil?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 125.00, url: 'https://example.com/out/hairstore/moroccanoil?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '8',
    slug: 'nioxin-system-2-cleanser-shampoo',
    brand: 'Nioxin',
    name: 'System 2 Cleanser Shampoo',
    category: 'shampoo',
    hair_goals: ['hairloss', 'volume'],
    hair_type_fit: ['fine'],
    scalp_fit: ['normal', 'oily'],
    free_from: ['silicones'],
    claims: [],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Niacinamide, Caffeine, Biotin, Peppermint Oil, Glycerin, Citric Acid, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesnioxin-system2/400/400',
    popularity: 75,
    offers: [
      { merchant: 'notino', price_pln: 79.00, url: 'https://example.com/out/notino/nioxin-system2?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '9',
    slug: 'vichy-dercos-anti-dandruff-shampoo',
    brand: 'Vichy',
    name: 'Dercos Anti-Dandruff Shampoo',
    category: 'shampoo',
    hair_goals: ['dandruff', 'oily_scalp'],
    hair_type_fit: ['fine', 'straight'],
    scalp_fit: ['oily', 'dandruff'],
    free_from: ['parabens', 'silicones'],
    claims: [],
    inci: 'Aqua, Sodium Laureth Sulfate, Piroctone Olamine, Salicylic Acid, Selenium Disulfide, Glycerin, Cocamidopropyl Betaine, Niacinamide, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesvichy-dercos/400/400',
    popularity: 83,
    offers: [
      { merchant: 'notino', price_pln: 59.00, url: 'https://example.com/out/notino/vichy-dercos?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '10',
    slug: 'ducray-squanorm-anti-dandruff-shampoo',
    brand: 'Ducray',
    name: 'Squanorm Anti-Dandruff Shampoo',
    category: 'shampoo',
    hair_goals: ['dandruff'],
    hair_type_fit: ['fine', 'straight', 'thick'],
    scalp_fit: ['dandruff', 'oily'],
    free_from: ['parabens'],
    claims: [],
    inci: 'Aqua, Sodium Laureth Sulfate, Zinc Pyrithione, Kelual DS, Cocamidopropyl Betaine, Glycerin, Citric Acid, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesducray-squanorm/400/400',
    popularity: 70,
    offers: [
      { merchant: 'notino', price_pln: 54.00, url: 'https://example.com/out/notino/ducray-squanorm?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '11',
    slug: 'wella-fusion-intense-repair-shampoo',
    brand: 'Wella Professionals',
    name: 'Fusion Intense Repair Shampoo',
    category: 'shampoo',
    hair_goals: ['damage', 'dryness'],
    hair_type_fit: ['thick', 'colored', 'bleached'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: ['protein'],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycol Distearate, Silk Amino Acids, Dimethicone, Glycerin, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceswella-fusion/400/400',
    popularity: 76,
    offers: [
      { merchant: 'notino', price_pln: 69.00, url: 'https://example.com/out/notino/wella-fusion?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 75.00, url: 'https://example.com/out/hairstore/wella-fusion?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '12',
    slug: 'schwarzkopf-bc-peptide-repair-rescue-shampoo',
    brand: 'Schwarzkopf',
    name: 'BC Peptide Repair Rescue Shampoo',
    category: 'shampoo',
    hair_goals: ['damage'],
    hair_type_fit: ['thick', 'colored'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: ['protein'],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Hydrolyzed Keratin, Panthenol, Dimethicone, Glycerin, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesschwarzkopf-bc/400/400',
    popularity: 72,
    offers: [
      { merchant: 'notino', price_pln: 55.00, url: 'https://example.com/out/notino/schwarzkopf-bc?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '13',
    slug: 'matrix-so-silver-shampoo',
    brand: 'Matrix',
    name: 'So Silver Shampoo',
    category: 'shampoo',
    hair_goals: ['damage'],
    hair_type_fit: ['bleached', 'colored'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: [],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Violet Pigment, Glycerin, Citric Acid, Dimethicone, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesmatrix-so-silver/400/400',
    popularity: 68,
    offers: [
      { merchant: 'notino', price_pln: 59.00, url: 'https://example.com/out/notino/matrix-so-silver?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '14',
    slug: 'kerastase-specifique-bain-prevention',
    brand: 'Kerastase',
    name: 'Specifique Bain Prevention',
    category: 'shampoo',
    hair_goals: ['hairloss', 'volume'],
    hair_type_fit: ['fine'],
    scalp_fit: ['normal', 'sensitive'],
    free_from: [],
    claims: [],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Aminexil, Arginine, Citric Acid, Sodium Benzoate, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceskerastase-specifique/400/400',
    popularity: 79,
    offers: [
      { merchant: 'notino', price_pln: 132.00, url: 'https://example.com/out/notino/kerastase-specifique?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '15',
    slug: 'loreal-absolut-repair-conditioner',
    brand: "L'Oreal Professionnel",
    name: 'Absolut Repair Conditioner',
    category: 'conditioner',
    hair_goals: ['damage', 'dryness'],
    hair_type_fit: ['thick', 'colored'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: ['protein'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Glycerin, Hydrolyzed Wheat Protein, Quinoa Protein, Dimethicone, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesloreal-absolut-cond/400/400',
    popularity: 80,
    offers: [
      { merchant: 'notino', price_pln: 95.00, url: 'https://example.com/out/notino/loreal-absolut-cond?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '16',
    slug: 'redken-acidic-bonding-concentrate-conditioner',
    brand: 'Redken',
    name: 'Acidic Bonding Concentrate Conditioner',
    category: 'conditioner',
    hair_goals: ['damage', 'frizz'],
    hair_type_fit: ['colored', 'bleached'],
    scalp_fit: ['normal'],
    free_from: ['sulfates'],
    claims: ['bonding'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Citric Acid, Glycerin, Amodimethicone, Panthenol, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesredken-acidic-cond/400/400',
    popularity: 78,
    offers: [
      { merchant: 'notino', price_pln: 105.00, url: 'https://example.com/out/notino/redken-acidic-cond?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '17',
    slug: 'moroccanoil-hydrating-conditioner',
    brand: 'Moroccanoil',
    name: 'Hydrating Conditioner',
    category: 'conditioner',
    hair_goals: ['dryness', 'frizz'],
    hair_type_fit: ['thick', 'curly'],
    scalp_fit: ['normal', 'dry'],
    free_from: ['parabens'],
    claims: ['cruelty_free'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Argania Spinosa Kernel Oil, Glycerin, Dimethicone, Panthenol, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesmoroccanoil-cond/400/400',
    popularity: 86,
    offers: [
      { merchant: 'notino', price_pln: 125.00, url: 'https://example.com/out/notino/moroccanoil-cond?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 130.00, url: 'https://example.com/out/hairstore/moroccanoil-cond?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '18',
    slug: 'davines-oi-conditioner',
    brand: 'Davines',
    name: 'OI Conditioner',
    category: 'conditioner',
    hair_goals: ['frizz', 'dryness'],
    hair_type_fit: ['thick', 'curly'],
    scalp_fit: ['normal'],
    free_from: ['sulfates', 'parabens'],
    claims: ['vegan', 'cruelty_free'],
    inci: 'Aqua, Cetearyl Alcohol, Glycerin, Roucou Oil, Tocopherol, Behentrimonium Chloride, Citric Acid, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesdavines-oi-cond/400/400',
    popularity: 76,
    offers: [
      { merchant: 'notino', price_pln: 115.00, url: 'https://example.com/out/notino/davines-oi-cond?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '19',
    slug: 'kerastase-nutritive-masquintense',
    brand: 'Kerastase',
    name: 'Nutritive Masquintense',
    category: 'mask',
    hair_goals: ['dryness', 'damage'],
    hair_type_fit: ['thick', 'colored'],
    scalp_fit: ['normal', 'dry'],
    free_from: [],
    claims: ['keratin', 'protein'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Glycerin, Hydrolyzed Wheat Protein, Royal Jelly, Dimethicone, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceskerastase-masquintense/400/400',
    popularity: 87,
    offers: [
      { merchant: 'notino', price_pln: 195.00, url: 'https://example.com/out/notino/kerastase-masquintense?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 205.00, url: 'https://example.com/out/hairstore/kerastase-masquintense?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '20',
    slug: 'olaplex-no3-hair-perfector',
    brand: 'Olaplex',
    name: 'No.3 Hair Perfector',
    category: 'mask',
    hair_goals: ['damage', 'frizz'],
    hair_type_fit: ['colored', 'bleached', 'thick'],
    scalp_fit: ['normal'],
    free_from: ['parabens', 'sulfates'],
    claims: ['bonding', 'cruelty_free'],
    inci: 'Aqua, Bis-Aminopropyl Diglycol Dimaleate, Propylene Glycol, Cetearyl Alcohol, Behentrimonium Methosulfate, Cetyl Alcohol, Phenoxyethanol, Glycerin, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesolaplex-no3/400/400',
    popularity: 95,
    offers: [
      { merchant: 'notino', price_pln: 139.00, url: 'https://example.com/out/notino/olaplex-no3?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 145.00, url: 'https://example.com/out/hairstore/olaplex-no3?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairlust', price_pln: 149.00, url: 'https://example.com/out/hairlust/olaplex-no3?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '21',
    slug: 'moroccanoil-restorative-hair-mask',
    brand: 'Moroccanoil',
    name: 'Restorative Hair Mask',
    category: 'mask',
    hair_goals: ['damage', 'dryness'],
    hair_type_fit: ['thick', 'colored'],
    scalp_fit: ['normal'],
    free_from: ['parabens'],
    claims: ['protein', 'cruelty_free'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Argania Spinosa Kernel Oil, Shea Butter, Keratin, Panthenol, Dimethicone, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesmoroccanoil-mask/400/400',
    popularity: 84,
    offers: [
      { merchant: 'notino', price_pln: 179.00, url: 'https://example.com/out/notino/moroccanoil-mask?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '22',
    slug: 'wella-fusion-intense-repair-mask',
    brand: 'Wella Professionals',
    name: 'Fusion Intense Repair Mask',
    category: 'mask',
    hair_goals: ['damage', 'dryness'],
    hair_type_fit: ['thick', 'colored', 'bleached'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: ['protein'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Silk Amino Acids, Glycerin, Dimethicone, Panthenol, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceswella-fusion-mask/400/400',
    popularity: 74,
    offers: [
      { merchant: 'notino', price_pln: 85.00, url: 'https://example.com/out/notino/wella-fusion-mask?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '23',
    slug: 'redken-acidic-bonding-concentrate-mask',
    brand: 'Redken',
    name: 'Acidic Bonding Concentrate Mask',
    category: 'mask',
    hair_goals: ['damage', 'frizz'],
    hair_type_fit: ['colored', 'bleached'],
    scalp_fit: ['normal'],
    free_from: ['sulfates'],
    claims: ['bonding'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Citric Acid, Glycerin, Amodimethicone, Panthenol, Tocopherol, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesredken-acidic-mask/400/400',
    popularity: 77,
    offers: [
      { merchant: 'notino', price_pln: 115.00, url: 'https://example.com/out/notino/redken-acidic-mask?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '24',
    slug: 'the-ordinary-multi-peptide-serum',
    brand: 'The Ordinary',
    name: 'Multi-Peptide Serum for Hair Density',
    category: 'serum',
    hair_goals: ['hairloss', 'volume'],
    hair_type_fit: ['fine', 'straight'],
    scalp_fit: ['normal', 'oily'],
    free_from: ['silicones', 'sulfates', 'parabens'],
    claims: ['vegan', 'cruelty_free'],
    inci: 'Aqua, Propanediol, Biotinoyl Tripeptide-1, Acetyl Tetrapeptide-3, Trifolium Pratense Flower Extract, Caffeine, Glycerin, Piroctone Olamine',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesordinary-peptide/400/400',
    popularity: 89,
    offers: [
      { merchant: 'notino', price_pln: 75.00, url: 'https://example.com/out/notino/ordinary-peptide?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '25',
    slug: 'moroccanoil-treatment-oil',
    brand: 'Moroccanoil',
    name: 'Treatment Oil Original',
    category: 'serum',
    hair_goals: ['frizz', 'dryness'],
    hair_type_fit: ['thick', 'curly', 'colored'],
    scalp_fit: ['normal'],
    free_from: ['parabens'],
    claims: ['cruelty_free'],
    inci: 'Cyclomethicone, Dimethicone, Argania Spinosa Kernel Oil, Linseed Extract, Parfum, CI 26100, CI 47000',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesmoroccanoil-oil/400/400',
    popularity: 93,
    offers: [
      { merchant: 'notino', price_pln: 89.00, url: 'https://example.com/out/notino/moroccanoil-oil?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 95.00, url: 'https://example.com/out/hairstore/moroccanoil-oil?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '26',
    slug: 'olaplex-no7-bonding-oil',
    brand: 'Olaplex',
    name: 'No.7 Bonding Oil',
    category: 'serum',
    hair_goals: ['frizz', 'damage'],
    hair_type_fit: ['colored', 'bleached', 'thick'],
    scalp_fit: ['normal'],
    free_from: ['parabens', 'sulfates'],
    claims: ['bonding', 'cruelty_free'],
    inci: 'Dodecane, Coco-Caprylate/Caprate, Bis-Aminopropyl Diglycol Dimaleate, Dimethicone, Moringa Oleifera Seed Oil, Tocopheryl Acetate, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesolaplex-no7/400/400',
    popularity: 88,
    offers: [
      { merchant: 'notino', price_pln: 139.00, url: 'https://example.com/out/notino/olaplex-no7?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '27',
    slug: 'kerastase-genesis-serum-anti-chute',
    brand: 'Kerastase',
    name: 'Genesis Serum Anti-Chute Fortifiant',
    category: 'serum',
    hair_goals: ['hairloss', 'volume'],
    hair_type_fit: ['fine', 'thick'],
    scalp_fit: ['normal', 'sensitive'],
    free_from: ['silicones'],
    claims: [],
    inci: 'Aqua, Aminexil, Caffeine, Ginger Extract, Edelweiss Stem Cells, Glycerin, Niacinamide, Citric Acid',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceskerastase-genesis/400/400',
    popularity: 81,
    offers: [
      { merchant: 'notino', price_pln: 249.00, url: 'https://example.com/out/notino/kerastase-genesis?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '28',
    slug: 'vichy-dercos-aminexil-intensive',
    brand: 'Vichy',
    name: 'Dercos Aminexil Intensive 5',
    category: 'scalp_tonic',
    hair_goals: ['hairloss'],
    hair_type_fit: ['fine', 'straight'],
    scalp_fit: ['normal', 'oily', 'sensitive'],
    free_from: ['silicones', 'parabens'],
    claims: [],
    inci: 'Aqua, Alcohol Denat, Aminexil, Arginine, SP94 Molecule, Glycerin, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesvichy-aminexil/400/400',
    popularity: 82,
    offers: [
      { merchant: 'notino', price_pln: 155.00, url: 'https://example.com/out/notino/vichy-aminexil?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '29',
    slug: 'nioxin-night-density-treatment',
    brand: 'Nioxin',
    name: 'Night Density Rescue Treatment',
    category: 'scalp_tonic',
    hair_goals: ['hairloss', 'volume'],
    hair_type_fit: ['fine'],
    scalp_fit: ['normal'],
    free_from: ['silicones'],
    claims: ['biotin'],
    inci: 'Aqua, Niacinamide, Biotin, Caffeine, Panthenol, Glycerin, Alcohol Denat, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesnioxin-night/400/400',
    popularity: 71,
    offers: [
      { merchant: 'notino', price_pln: 189.00, url: 'https://example.com/out/notino/nioxin-night?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '30',
    slug: 'hairlust-grow-perfect-serum',
    brand: 'Hairlust',
    name: 'Grow Perfect Hair Growth Serum',
    category: 'serum',
    hair_goals: ['hairloss', 'volume'],
    hair_type_fit: ['fine', 'straight', 'thick'],
    scalp_fit: ['normal', 'oily'],
    free_from: ['silicones', 'sulfates', 'parabens'],
    claims: ['vegan', 'cruelty_free'],
    inci: 'Aqua, Glycerin, Anagain, Baicapil, Biotin, Caffeine, Niacinamide, Panthenol, Citric Acid',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceshairlust-grow/400/400',
    popularity: 77,
    offers: [
      { merchant: 'hairlust', price_pln: 149.00, url: 'https://example.com/out/hairlust/grow-perfect?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '31',
    slug: 'hairlust-hair-formula-gummies',
    brand: 'Hairlust',
    name: 'Hair Formula Gummies',
    category: 'supplement',
    hair_goals: ['hairloss', 'volume'],
    hair_type_fit: ['fine', 'thick', 'straight', 'curly'],
    scalp_fit: ['normal', 'oily', 'dry', 'sensitive'],
    free_from: [],
    claims: ['vegan', 'biotin'],
    inci: 'Biotin, Zinc, Selenium, Folic Acid, Vitamin B12, Vitamin D, Coconut Oil, Pectin',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceshairlust-gummies/400/400',
    popularity: 73,
    offers: [
      { merchant: 'hairlust', price_pln: 129.00, url: 'https://example.com/out/hairlust/gummies?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '32',
    slug: 'priorin-capsules',
    brand: 'Priorin',
    name: 'Kapsulki na Wypadanie Wlosow',
    category: 'supplement',
    hair_goals: ['hairloss'],
    hair_type_fit: ['fine', 'thick'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: ['biotin'],
    inci: 'Millet Extract, Biotin, Pantothenic Acid, L-Cystine, Wheat Germ Oil, Gelatin',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facespriorin/400/400',
    popularity: 69,
    offers: [
      { merchant: 'notino', price_pln: 95.00, url: 'https://example.com/out/notino/priorin?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '33',
    slug: 'shea-moisture-coconut-hibiscus-shampoo',
    brand: 'SheaMoisture',
    name: 'Coconut & Hibiscus Curl & Shine Shampoo',
    category: 'shampoo',
    hair_goals: ['frizz', 'dryness'],
    hair_type_fit: ['curly', 'thick'],
    scalp_fit: ['normal', 'dry'],
    free_from: ['sulfates', 'parabens', 'silicones'],
    claims: ['vegan', 'cruelty_free'],
    inci: 'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Glycerin, Cocos Nucifera Oil, Silk Protein, Hibiscus Sabdariffa Extract, Panthenol',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesshea-moisture/400/400',
    popularity: 81,
    offers: [
      { merchant: 'notino', price_pln: 49.00, url: 'https://example.com/out/notino/shea-moisture?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '34',
    slug: 'cantu-shea-butter-conditioner',
    brand: 'Cantu',
    name: 'Shea Butter Leave-In Conditioning Repair Cream',
    category: 'conditioner',
    hair_goals: ['frizz', 'dryness', 'damage'],
    hair_type_fit: ['curly', 'thick'],
    scalp_fit: ['normal'],
    free_from: ['sulfates', 'silicones', 'parabens'],
    claims: [],
    inci: 'Aqua, Glycerin, Butyrospermum Parkii Butter, Cetearyl Alcohol, Behentrimonium Chloride, Shea Oil, Macadamia Oil, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facescantu-shea/400/400',
    popularity: 79,
    offers: [
      { merchant: 'notino', price_pln: 35.00, url: 'https://example.com/out/notino/cantu-shea?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '35',
    slug: 'kerastase-resistance-masque-force-architecte',
    brand: 'Kerastase',
    name: 'Resistance Masque Force Architecte',
    category: 'mask',
    hair_goals: ['damage', 'dryness'],
    hair_type_fit: ['thick', 'colored', 'bleached'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: ['keratin', 'protein'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Ceramide R, Vita-Ciment, Glycerin, Dimethicone, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceskerastase-force/400/400',
    popularity: 84,
    offers: [
      { merchant: 'notino', price_pln: 205.00, url: 'https://example.com/out/notino/kerastase-force?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 215.00, url: 'https://example.com/out/hairstore/kerastase-force?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '36',
    slug: 'schwarzkopf-got2b-volumaniac-spray',
    brand: 'Schwarzkopf',
    name: 'got2b Volumaniac Bodifying Spray',
    category: 'serum',
    hair_goals: ['volume'],
    hair_type_fit: ['fine', 'straight'],
    scalp_fit: ['normal', 'oily'],
    free_from: ['parabens'],
    claims: [],
    inci: 'Aqua, Alcohol Denat, VP/VA Copolymer, PEG-12 Dimethicone, Panthenol, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesgot2b-volume/400/400',
    popularity: 65,
    offers: [
      { merchant: 'notino', price_pln: 25.00, url: 'https://example.com/out/notino/got2b-volume?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '37',
    slug: 'kerastase-elixir-ultime-oil',
    brand: 'Kerastase',
    name: 'Elixir Ultime Original Oil',
    category: 'serum',
    hair_goals: ['frizz', 'dryness'],
    hair_type_fit: ['thick', 'colored'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: [],
    inci: 'Cyclopentasiloxane, Dimethicone, Camellia Oil, Argan Oil, Maize Oil, Pracaxi Oil, Tocopherol, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceskerastase-elixir/400/400',
    popularity: 86,
    offers: [
      { merchant: 'notino', price_pln: 195.00, url: 'https://example.com/out/notino/kerastase-elixir?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 205.00, url: 'https://example.com/out/hairstore/kerastase-elixir?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '38',
    slug: 'phyto-phytocyane-treatment',
    brand: 'Phyto',
    name: 'Phytocyane Anti-Hair Loss Treatment',
    category: 'scalp_tonic',
    hair_goals: ['hairloss'],
    hair_type_fit: ['fine', 'thick'],
    scalp_fit: ['normal', 'sensitive'],
    free_from: ['silicones', 'sulfates', 'parabens'],
    claims: ['vegan'],
    inci: 'Aqua, Viburnum Prunifolium Bark Extract, Ginkgo Biloba, Biotin, Grape Seed Extract, Glycerin',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesphyto-cyane/400/400',
    popularity: 72,
    offers: [
      { merchant: 'notino', price_pln: 165.00, url: 'https://example.com/out/notino/phyto-cyane?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '39',
    slug: 'head-shoulders-citrus-fresh-shampoo',
    brand: 'Head & Shoulders',
    name: 'Citrus Fresh Anti-Dandruff Shampoo',
    category: 'shampoo',
    hair_goals: ['dandruff', 'oily_scalp'],
    hair_type_fit: ['fine', 'straight', 'thick'],
    scalp_fit: ['oily', 'dandruff'],
    free_from: [],
    claims: [],
    inci: 'Aqua, Sodium Laureth Sulfate, Sodium Lauryl Sulfate, Zinc Pyrithione, Cocamidopropyl Betaine, Glycol Distearate, Dimethicone, Citrus Limon Extract, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceshead-shoulders/400/400',
    popularity: 74,
    offers: [
      { merchant: 'notino', price_pln: 22.00, url: 'https://example.com/out/notino/head-shoulders?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '40',
    slug: 'aussie-3-minute-miracle-moist',
    brand: 'Aussie',
    name: '3 Minute Miracle Moist Deep Treatment',
    category: 'mask',
    hair_goals: ['dryness', 'frizz'],
    hair_type_fit: ['thick', 'curly'],
    scalp_fit: ['normal'],
    free_from: ['parabens'],
    claims: ['cruelty_free'],
    inci: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Glycerin, Australian Macadamia Nut Oil, Aloe Vera, Jojoba Oil, Dimethicone, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesaussie-miracle/400/400',
    popularity: 71,
    offers: [
      { merchant: 'notino', price_pln: 29.00, url: 'https://example.com/out/notino/aussie-miracle?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '41',
    slug: 'matrix-biolage-volumebloom-shampoo',
    brand: 'Matrix',
    name: 'Biolage VolumeBloom Shampoo',
    category: 'shampoo',
    hair_goals: ['volume'],
    hair_type_fit: ['fine', 'straight'],
    scalp_fit: ['normal', 'oily'],
    free_from: ['parabens'],
    claims: [],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Gossypium Herbaceum Seed Extract, Glycerin, Citric Acid, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesmatrix-volumebloom/400/400',
    popularity: 67,
    offers: [
      { merchant: 'notino', price_pln: 55.00, url: 'https://example.com/out/notino/matrix-volumebloom?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '42',
    slug: 'loreal-serie-expert-vitamino-color-shampoo',
    brand: "L'Oreal Professionnel",
    name: 'Serie Expert Vitamino Color Shampoo',
    category: 'shampoo',
    hair_goals: ['damage'],
    hair_type_fit: ['colored', 'bleached'],
    scalp_fit: ['normal'],
    free_from: ['sulfates', 'parabens'],
    claims: [],
    inci: 'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Glycerin, Tocopherol, Resveratrol, Citric Acid, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesloreal-vitamino/400/400',
    popularity: 78,
    offers: [
      { merchant: 'notino', price_pln: 75.00, url: 'https://example.com/out/notino/loreal-vitamino?aff=demo123', last_checked: '2026-02-12' },
      { merchant: 'hairstore', price_pln: 82.00, url: 'https://example.com/out/hairstore/loreal-vitamino?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '43',
    slug: 'hairlust-split-fix-hair-mask',
    brand: 'Hairlust',
    name: 'Split Fix Hair Mask',
    category: 'mask',
    hair_goals: ['damage', 'dryness', 'frizz'],
    hair_type_fit: ['thick', 'curly', 'colored'],
    scalp_fit: ['normal'],
    free_from: ['silicones', 'sulfates', 'parabens'],
    claims: ['vegan', 'cruelty_free'],
    inci: 'Aqua, Cetearyl Alcohol, Glycerin, Shea Butter, Hydrolyzed Pea Protein, Coconut Oil, Tocopherol, Citric Acid',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceshairlust-split-fix/400/400',
    popularity: 74,
    offers: [
      { merchant: 'hairlust', price_pln: 119.00, url: 'https://example.com/out/hairlust/split-fix?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '44',
    slug: 'kerastase-blond-absolu-bain-ultra-violet',
    brand: 'Kerastase',
    name: 'Blond Absolu Bain Ultra-Violet',
    category: 'shampoo',
    hair_goals: ['damage'],
    hair_type_fit: ['bleached', 'colored'],
    scalp_fit: ['normal'],
    free_from: [],
    claims: ['protein'],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Hyaluronic Acid, Edelweiss Flower Extract, Ultraviolet Pigment, Glycerin, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=faceskerastase-blond/400/400',
    popularity: 83,
    offers: [
      { merchant: 'notino', price_pln: 135.00, url: 'https://example.com/out/notino/kerastase-blond?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  },
  {
    id: '45',
    slug: 'plantur-39-phyto-caffeine-shampoo',
    brand: 'Plantur 39',
    name: 'Phyto-Caffeine Shampoo',
    category: 'shampoo',
    hair_goals: ['hairloss', 'volume'],
    hair_type_fit: ['fine'],
    scalp_fit: ['normal', 'sensitive'],
    free_from: ['silicones'],
    claims: [],
    inci: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Caffeine, Niacinamide, Zinc PCA, White Tea Extract, Glycerin, Parfum',
    images: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=facesplantur39/400/400',
    popularity: 70,
    offers: [
      { merchant: 'notino', price_pln: 42.00, url: 'https://example.com/out/notino/plantur39?aff=demo123', last_checked: '2026-02-12' }
    ],
    updated_at: '2026-02-12'
  }
];

export function buildProducts(): Product[] {
  return RAW_PRODUCTS.map(p => ({
    ...p,
    ingredient_flags: detectIngredientFlags(p.inci)
  }));
}

export const PRODUCTS = buildProducts();
