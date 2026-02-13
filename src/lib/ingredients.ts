import type { IngredientFlags } from '../types';

const INGREDIENT_LISTS = {
  silicones: ['dimethicone', 'amodimethicone', 'cyclopentasiloxane', 'cyclohexasiloxane', 'trimethicone', 'dimethiconol', 'phenyl trimethicone'],
  sulfates: ['sodium laureth sulfate', 'sodium lauryl sulfate', 'ammonium lauryl sulfate', 'ammonium laureth sulfate'],
  parabens: ['methylparaben', 'propylparaben', 'butylparaben', 'ethylparaben'],
  drying_alcohols: ['alcohol denat', 'isopropyl alcohol', 'sd alcohol', 'denatured alcohol'],
  fragrance: ['parfum', 'fragrance', 'aroma']
};

export function detectIngredientFlags(inci: string): IngredientFlags {
  const lower = inci.toLowerCase();

  return {
    has_silicones: INGREDIENT_LISTS.silicones.some(ing => lower.includes(ing)),
    has_sulfates: INGREDIENT_LISTS.sulfates.some(ing => lower.includes(ing)),
    has_parabens: INGREDIENT_LISTS.parabens.some(ing => lower.includes(ing)),
    has_drying_alcohols: INGREDIENT_LISTS.drying_alcohols.some(ing => lower.includes(ing)),
    has_fragrance: INGREDIENT_LISTS.fragrance.some(ing => lower.includes(ing))
  };
}

export function parseInciString(inci: string): string[] {
  return inci.split(',').map(s => s.trim()).filter(Boolean);
}

export function getIngredientExplanation(flag: keyof IngredientFlags): string {
  const explanations: Record<keyof IngredientFlags, string> = {
    has_silicones: 'Silikony tworzą osłonę na włosach — łatwiejsze do rozczesywania, ale mogą się gromadzić.',
    has_sulfates: 'Silne detergenty — mogą wysuszać włosy, szczególnie farbowane.',
    has_parabens: 'Konserwanty — bezpieczne, ale niektórzy chcą ich unikać.',
    has_drying_alcohols: 'Alkohol denaturowany wysusza — unikaj, jeśli włosy są suche.',
    has_fragrance: 'Zapach może podrażniać wrażliwą skórę głowy.'
  };
  return explanations[flag];
}
