export const HAIR_GOAL_LABELS: Record<string, string> = {
  dryness: 'Suchość',
  damage: 'Zniszczenie',
  frizz: 'Puszenie',
  volume: 'Objętość',
  dandruff: 'Łupież',
  hairloss: 'Wypadanie',
  oily_scalp: 'Przetłuszczanie',
  sensitive_scalp: 'Wrażliwa skóra głowy'
};

export const HAIR_TYPE_LABELS: Record<string, string> = {
  fine: 'Cienkie',
  thick: 'Grube',
  curly: 'Kręcone',
  straight: 'Proste',
  colored: 'Farbowane',
  bleached: 'Rozjaśniane'
};

export const SCALP_TYPE_LABELS: Record<string, string> = {
  oily: 'Przetłuszczająca się',
  dry: 'Sucha',
  sensitive: 'Wrażliwa',
  dandruff: 'Z łupieżem',
  normal: 'Normalna'
};

export const FREE_FROM_LABELS: Record<string, string> = {
  silicones: 'Bez silikonów',
  sulfates: 'Bez sulfatów',
  parabens: 'Bez parabenów',
  drying_alcohols: 'Bez wysuszających alkoholi'
};

export const CLAIM_LABELS: Record<string, string> = {
  vegan: 'Wegański',
  cruelty_free: 'Cruelty Free',
  keratin: 'Z keratyną',
  protein: 'Z proteinami',
  bonding: 'Bonding',
  biotin: 'Z biotyną'
};

export const CATEGORY_LABELS: Record<string, string> = {
  shampoo: 'Szampon',
  conditioner: 'Odżywka',
  mask: 'Maska',
  serum: 'Serum',
  scalp_tonic: 'Tonik do skóry głowy',
  supplement: 'Suplement',
  styling: 'Stylizacja',
  other: 'Inne'
};

export const SORT_OPTIONS = [
  { value: 'match' as const, label: 'Najlepsze dopasowanie' },
  { value: 'price' as const, label: 'Najtańsze' },
  { value: 'popularity' as const, label: 'Najpopularniejsze' }
];

export const MERCHANT_LABELS: Record<string, string> = {
  notino: 'Notino',
  hairstore: 'Hairstore',
  hairlust: 'Hairlust',
  other: 'Inny sklep'
};
