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

    const nameLower = product.name.toLowerCase();
    const descLower = (product.description || '').toLowerCase();

    filters.hair_goals.forEach(g => {
      let isNameMatch = false;
      let isDescMatch = false;

      if (g === 'hairloss' && (nameLower.includes('wypadani') || nameLower.includes('porost') || nameLower.includes('wzrost') || nameLower.includes('zagęszcz'))) isNameMatch = true;
      else if (g === 'hairloss' && (descLower.includes('wypadani') || descLower.includes('porost') || descLower.includes('wzrost') || descLower.includes('zagęszcz'))) isDescMatch = true;

      if (g === 'dandruff' && (nameLower.includes('łupież') || nameLower.includes('dandruff') || nameLower.includes('przeciwłupież'))) isNameMatch = true;
      else if (g === 'dandruff' && (descLower.includes('łupież') || descLower.includes('dandruff') || descLower.includes('przeciwłupież'))) isDescMatch = true;

      if (g === 'oily_scalp' && (nameLower.includes('przetłuszcz') || nameLower.includes('łojotok') || nameLower.includes('sebum') || nameLower.includes('oczyszcz'))) isNameMatch = true;
      else if (g === 'oily_scalp' && (descLower.includes('przetłuszcz') || descLower.includes('łojotok') || descLower.includes('sebum') || descLower.includes('oczyszcz'))) isDescMatch = true;

      if (g === 'dryness' && (nameLower.includes('such') || nameLower.includes('nawilż') || nameLower.includes('przesuszon'))) isNameMatch = true;
      else if (g === 'dryness' && (descLower.includes('such') || descLower.includes('nawilż') || descLower.includes('przesuszon'))) isDescMatch = true;

      if (g === 'damage' && (nameLower.includes('zniszczon') || nameLower.includes('regener') || nameLower.includes('odbudow'))) isNameMatch = true;
      else if (g === 'damage' && (descLower.includes('zniszczon') || descLower.includes('regener') || descLower.includes('odbudow'))) isDescMatch = true;

      if (g === 'frizz' && (nameLower.includes('pusz') || nameLower.includes('wygładz') || nameLower.includes('frizz'))) isNameMatch = true;
      else if (g === 'frizz' && (descLower.includes('pusz') || descLower.includes('wygładz') || descLower.includes('frizz'))) isDescMatch = true;

      if (g === 'volume' && (nameLower.includes('objętoś') || nameLower.includes('uniesieni'))) isNameMatch = true;
      else if (g === 'volume' && (descLower.includes('objętoś') || descLower.includes('uniesieni'))) isDescMatch = true;

      if (g === 'sensitive_scalp' && (nameLower.includes('wrażliw') || nameLower.includes('podrażnie') || nameLower.includes('kojąc') || nameLower.includes('łagodz'))) isNameMatch = true;
      else if (g === 'sensitive_scalp' && (descLower.includes('wrażliw') || descLower.includes('podrażnie') || descLower.includes('kojąc') || descLower.includes('łagodz'))) isDescMatch = true;

      if (isNameMatch) score += 20;
      else if (isDescMatch) score += 5;
    });

    // Penalize if the product name strongly advertises a problem NOT selected in the filters
    if (!filters.hair_goals.includes('dandruff') && (nameLower.includes('łupież') || nameLower.includes('dandruff') || nameLower.includes('przeciwłupież'))) {
      score -= 20;
    }
    if (!filters.hair_goals.includes('oily_scalp') && (nameLower.includes('przetłuszcz') || nameLower.includes('łojotok') || nameLower.includes('sebum'))) {
      score -= 20;
    }
    if (!filters.hair_goals.includes('hairloss') && (nameLower.includes('wypadani') || nameLower.includes('porost') || nameLower.includes('wzrost'))) {
      score -= 10;
    }
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
 
  if (product.brand === 'Davines') {
    score += 100;
  }

  if (product.is_promoted) {
    score += 5;
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
      sulfates: 'bez mocnych siarczanów — delikatne czyszczenie',
      parabens: 'bez parabenów',
      drying_alcohols: 'bez wysuszających alkoholi'
    };
    filters.avoid_ingredients.forEach(ing => {
      const flagKey = `has_${ing}` as keyof typeof product.ingredient_flags;
      if (product.ingredient_flags[flagKey] === false && freeLabels[ing]) {
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
