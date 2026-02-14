export interface Category {
  slug: string;
  name: string;
  color: string;
  icon: string;
  image?: string;
  description: string;
  intro: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'suche-zniszczone',
    name: 'Suche & Zniszczone',
    color: 'bg-amber-50',
    icon: '\u{1F335}',
    image: '/images/categories/suche-zniszczone.jpg',
    description: 'Regeneracja i nawilżenie dla słabych włosów',
    intro: 'Włosy suche i zniszczone potrzebują intensywnego nawilżenia i regeneracji. Szukaj produktów z emolientami (gliceryna, oleje), proteinami (hydrolizowana keratyna) i delikatnymi składnikami myjącymi. Unikaj silikonów i wysuszających alkoholi, które mogą pogorszyć stan włosów. Poniżej znajdziesz starannie wyselekcjonowane produkty, które pomogą Ci odbudować i nawilżyć włosy.'
  },
  {
    slug: 'wypadanie-cienkie',
    name: 'Wypadanie & Cienkie',
    color: 'bg-blue-50',
    icon: '\u{1F4AA}',
    image: '/images/categories/wypadanie-cienkie.jpg',
    description: 'Wzmocnienie, biotyna i stymulacja wzrostu',
    intro: 'Cienkie włosy potrzebują volumizujących formuł bez dodatkowego ciężaru. Szukaj biotyny, kofeiny, niacynamidu i peptydów. Skoncentruj się na produktach pielęgnacyjnych do skóry głowy, które mogą stymulować wzrost i wzmacniać cebulki. Suplementy diety z biotyną i cynkiem mogą wspomóc ten proces od wewnątrz.'
  },
  {
    slug: 'lupiez-przetluszczanie',
    name: 'Łupież & Przetłuszczanie',
    color: 'bg-green-50',
    icon: '\u{1F33F}',
    image: '/images/categories/lupiez-przetluszczanie.jpg',
    description: 'Czyszczenie i balans dla skóry głowy',
    intro: 'Skóra głowy przetłuszczona wymaga delikatnego czyszczenia bez wysuszania końców. Szukaj piroctone olaminy, kwasu salicylowego i niacynamidu. Unikaj silikonów, które mogą się gromadzić. Regularne stosowanie toników do skóry głowy pomoże utrzymać równowagę i zmniejszyć łupież.'
  },
  {
    slug: 'krecone',
    name: 'Kręcone',
    color: 'bg-pink-50',
    icon: '\u{1F300}',
    image: '/images/categories/krecone.jpg',
    description: 'Nawilżenie i kontrola puszenia',
    intro: 'Włosy kręcone potrzebują dodatkowego nawilżenia i antyoksydantów. Szukaj produktów z emolientami (oleje, gliceryna, allantoina), które zdefiniują loki. Unikaj silikonów, które mogą je obciążyć, i sulfatów, które wysuszają. Metoda curly girl może być dobrym punktem wyjścia do budowania rutyny.'
  },
  {
    slug: 'farbowane-rozjasniane',
    name: 'Farbowane & Rozjaśniane',
    color: 'bg-purple-50',
    icon: '\u{2728}',
    image: '/images/categories/farbowane-rozjasniane.jpg',
    description: 'Ochrona koloru i regeneracja',
    intro: 'Włosy farbowane i rozjaśniane są podatne na uszkodzenia i utratę koloru. Szukaj produktów z proteinami, antyoksydantami (witamina E, C) i technologią bonding. Unikaj silnych sulfatów, które wypłukują kolor. Produkty z filtrem UV pomogą chronić barwę przed blaknięciem.'
  }
];

export const categoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find(c => c.slug === slug);

export function getCategoryForProduct(product: { hair_goals: string[]; hair_type_fit: string[] }): string[] {
  const slugs: string[] = [];

  if (product.hair_goals.includes('dryness') || product.hair_goals.includes('damage')) {
    slugs.push('suche-zniszczone');
  }
  if (product.hair_goals.includes('hairloss') || product.hair_goals.includes('volume')) {
    slugs.push('wypadanie-cienkie');
  }
  if (product.hair_goals.includes('dandruff') || product.hair_goals.includes('oily_scalp')) {
    slugs.push('lupiez-przetluszczanie');
  }
  if (product.hair_type_fit.includes('curly')) {
    slugs.push('krecone');
  }
  if (product.hair_type_fit.includes('colored') || product.hair_type_fit.includes('bleached')) {
    slugs.push('farbowane-rozjasniane');
  }

  return slugs;
}
