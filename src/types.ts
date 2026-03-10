export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: 'shampoo' | 'conditioner' | 'mask' | 'serum' | 'oil' | 'milk' | 'scalp_tonic' | 'supplement' | 'styling' | 'other';

  hair_goals: HairGoal[];
  hair_type_fit: HairType[];
  scalp_fit: ScalpType[];
  free_from: FreeFrom[];
  claims: Claim[];

  inci: string;
  ingredient_flags: IngredientFlags;
  has_proteins?: boolean;
  has_humectants?: boolean;
  has_emollients?: boolean;
  is_cg_approved?: boolean;
  peh_balance?: string;
  key_ingredients?: string[];
  images: string[];
  popularity: number;
  cosmetic_function?: string;
  usage?: string;
  ingredient_categories?: string[];
  simplified_data?: {
    benefits?: string[];
    key_ingredients?: string[];
  };

  // Technical comparison fields
  volume_ml?: number;
  hair_porosity?: 'LOW' | 'MEDIUM' | 'HIGH';
  category_type?: 'shampoo' | 'conditioner' | 'mask' | 'serum' | 'oil' | 'milk';
  peh_ratio?: string;
  recommended_season?: 'all' | 'winter' | 'summer' | 'spring_fall';

  offers: Offer[];
  updated_at: string;
  description?: string;
  capacity?: string;
  rating?: {
    average: number;
    count: number;
  };
}

export interface Offer {
  merchant: string;
  price_pln: number;
  url: string;
  last_checked: string;
}

export interface IngredientFlags {
  has_silicones: boolean;
  has_sulfates: boolean;
  has_parabens: boolean;
  has_drying_alcohols: boolean;
  has_fragrance: boolean;
}

export type HairGoal = 'dryness' | 'damage' | 'frizz' | 'volume' | 'dandruff' | 'hairloss' | 'oily_scalp' | 'sensitive_scalp';
export type HairType = 'fine' | 'thick' | 'curly' | 'straight' | 'colored' | 'bleached';
export type ScalpType = 'oily' | 'dry' | 'sensitive' | 'dandruff' | 'normal';
export type FreeFrom = 'silicones' | 'sulfates' | 'parabens' | 'drying_alcohols';
export type Claim = 'vegan' | 'cruelty_free' | 'keratin' | 'protein' | 'bonding' | 'biotin';

export interface UserProfile {
  hair_type: HairType[];
  hair_goals: HairGoal[];
  scalp_type: ScalpType;
  avoid_ingredients: FreeFrom[];
  prefers_vegan: boolean;
  hair_length?: 'short' | 'medium' | 'long';
  hair_porosity?: 'low' | 'medium' | 'high';
}

export interface Filters {
  categories: string[];
  hair_goals: HairGoal[];
  hair_types: HairType[];
  scalp_types: ScalpType[];
  avoid_ingredients: FreeFrom[];
  vegan_only: boolean;
  price_min: number | '';
  price_max: number | '';
  brands: string[];
  sort_by: 'match' | 'price' | 'popularity';
  hair_length?: 'short' | 'medium' | 'long';
  hair_porosity?: 'low' | 'medium' | 'high';
  peh_balance: string[];
}

export interface AnalyticsEvent {
  name: string;
  timestamp: number;
  payload?: Record<string, unknown>;
}
