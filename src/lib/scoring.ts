import type { Product, Filters } from '../types';

export function matchScore(
  product: Product,
  filters: Filters,
  query: string = ''
): number {
  let score = 0;

  // 0. Search Query boost (High priority)
  if (query) {
    const q = query.toLowerCase();
    const name = product.name.toLowerCase();
    const brand = product.brand.toLowerCase();

    if (name.includes(q) || brand.includes(q)) {
      score += 15; // Strong boost for direct matches
    }
  }

  if (filters.avoid_ingredients.length > 0) {
    for (const avoid of filters.avoid_ingredients) {
      const flagKey = `has_${avoid}` as keyof typeof product.ingredient_flags;
      if (product.ingredient_flags[flagKey]) {
        return -999;
      }
    }
  }

  if (filters.hair_goals.length > 0) {
    const matched = filters.hair_goals.filter(g => product.hair_goals.includes(g)).length;
    score += matched * 3;
  }

  if (filters.hair_types.length > 0) {
    const matched = filters.hair_types.filter(t => product.hair_type_fit.includes(t)).length;
    score += matched > 0 ? 2 : 0;
  }

  if (filters.scalp_types.length > 0) {
    const matched = filters.scalp_types.filter(s => product.scalp_fit.includes(s)).length;
    score += matched > 0 ? 2 : 0;
  }

  if (filters.vegan_only && product.claims.includes('vegan')) {
    score += 1;
  }

  score += product.popularity / 100;

  return score;
}

export function getMatchLabel(score: number): { label: string; color: string } {
  if (score >= 8) return { label: 'Dopasowanie: wysokie', color: 'bg-emerald-100 text-emerald-800' };
  if (score >= 4) return { label: 'Dopasowanie: średnie', color: 'bg-amber-100 text-amber-800' };
  return { label: 'Dopasowanie: niskie', color: 'bg-gray-100 text-gray-800' };
}

export function generateWhyMatchesBullets(product: Product, filters: Filters): string[] {
  const bullets: string[] = [];

  const matchedGoals = filters.hair_goals.filter(g => product.hair_goals.includes(g));
  if (matchedGoals.length > 0) {
    const goalLabels: Record<string, string> = {
      dryness: 'suchości',
      damage: 'zniszczeniu',
      frizz: 'puszeniu',
      volume: 'objętości',
      dandruff: 'łupieżowi',
      hairloss: 'wypadaniu',
      oily_scalp: 'przetłuszczaniu',
      sensitive_scalp: 'wrażliwości'
    };
    const labels = matchedGoals.map(g => goalLabels[g]).join(' i ');
    bullets.push('Dopasowane do ' + labels + ' włosów');
  }

  if (filters.avoid_ingredients.length > 0) {
    const freeLabels: Record<string, string> = {
      silicones: 'bez silikonów — łatwiejsze domywanie',
      sulfates: 'bez sulfatów — delikatne czyszczenie',
      parabens: 'bez parabenów — naturalniejsza formuła',
      drying_alcohols: 'bez wysuszających alkoholi'
    };
    filters.avoid_ingredients.forEach(ing => {
      if (product.free_from.includes(ing) && freeLabels[ing]) {
        bullets.push(freeLabels[ing]);
      }
    });
  }

  if (product.claims.includes('protein') || product.claims.includes('keratin')) {
    bullets.push('Skład ukierunkowany na wzmocnienie i nawilżenie');
  }

  if (product.claims.includes('bonding')) {
    bullets.push('Technologia wiązania chroni włosy przed uszkodzeniami');
  }

  return bullets.slice(0, 3);
}
