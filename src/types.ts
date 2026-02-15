export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: 'shampoo' | 'conditioner' | 'mask' | 'serum' | 'scalp_tonic' | 'supplement';

  hair_goals: HairGoal[];
  hair_type_fit: HairType[];
  scalp_fit: ScalpType[];
  free_from: FreeFrom[];
  claims: Claim[];

  inci: string;
  ingredient_flags: IngredientFlags;
  images: string;
  popularity: number;

  offers: Offer[];
  updated_at: string;
  description?: string;
}

export interface Offer {
  merchant: 'notino' | 'hairstore' | 'hairlust' | 'other';
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
}

export interface Filters {
  categories: string[];
  hair_goals: HairGoal[];
  hair_types: HairType[];
  scalp_types: ScalpType[];
  avoid_ingredients: FreeFrom[];
  vegan_only: boolean;
  price_min: number;
  price_max: number;
  brands: string[];
  sort_by: 'match' | 'price' | 'popularity';
}

export interface AnalyticsEvent {
  name: string;
  timestamp: number;
  payload?: Record<string, unknown>;
}
