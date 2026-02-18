import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import { HAIR_TYPE_LABELS } from '../lib/constants';
import { trackEvents } from '../lib/track';
import { useStore } from '../store/useStore';
import StarRating from './StarRating';
import { calculateAppCost } from '../utils/calculateAppCost';
import { parsePEHFromDescription } from '../utils/pehParser';

interface ProductCardProps {
  product: Product;
  position: number;
}

export default function ProductCard({ product, position }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const addToComparison = useStore((s) => s.addToComparison);
  const removeFromComparison = useStore((s) => s.removeFromComparison);
  const isInComparison = useStore((s) => s.isInComparison(product.id));
  const comparisonCount = useStore((s) => s.comparisonProductIds.length);
  const hairLength = useStore((s) => s.filters.hair_length || 'medium');

  const bestOffer = product.offers.reduce((a, b) => a.price_pln < b.price_pln ? a : b);

  // Cost per application calculation
  let costPerApp = null;
  const isCalculatableCategory = ['shampoo', 'conditioner', 'mask', 'serum'].includes(product.category);

  if (isCalculatableCategory && product.volume_ml && bestOffer.price_pln) {
    costPerApp = calculateAppCost(
      bestOffer.price_pln,
      product.volume_ml,
      product.category as any,
      hairLength
    );
  }

  const handleOutboundClick = (e: React.MouseEvent, merchant: string, price: number) => {
    e.stopPropagation();
    trackEvents.outbound_click(product.id, merchant, 'product_card', position, price);
  };

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison) {
      removeFromComparison(product.id);
    } else if (comparisonCount < 4) {
      addToComparison(product.id);
    }
  };

  const hairTypes = product.hair_type_fit
    .map(type => HAIR_TYPE_LABELS[type])
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-6 group flex flex-col sm:flex-row gap-6 relative">

      {/* 1. ZDJĘCIE (Image) */}
      <Link
        to={`/produkt/${product.slug}`}
        className="shrink-0 flex items-center justify-center w-full sm:w-48"
      >
        <div className="w-48 h-48 sm:w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 relative group/img">
          <img
            src={product.images[0]}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="space-y-3">
          {/* 2. MARKA & 3. NAZWA PRODUKTU & 4. POJEMNOŚĆ */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.2em]">
                {product.brand}
              </span>
              {product.capacity && (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  {product.capacity}
                </span>
              )}
            </div>
            <Link to={`/produkt/${product.slug}`}>
              <h3 className="font-extrabold text-gray-900 text-lg sm:text-2xl leading-tight hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* 5. OPINIE (StarRating) */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <StarRating average={product.rating.average} count={product.rating.count} size="sm" />
            </div>
          )}

          {/* 6. FUNKCJA PRODUKTU & 7. TYP WŁOSÓW */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {product.cosmetic_function && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-3 py-1 bg-accent/5 text-accent-dark border border-accent/10 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${isExpanded ? 'whitespace-normal rounded-xl' : 'line-clamp-1 max-w-[300px]'}`}>
                  {product.cosmetic_function}
                </span>
                {product.cosmetic_function.length > 40 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-secondary transition-colors cursor-pointer shrink-0 py-1"
                  >
                    {isExpanded ? 'Zwiń' : '...więcej'}
                  </button>
                )}
              </div>
            )}
            {hairTypes && (
              <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/10">
                Włosy: {hairTypes}
              </span>
            )}
            {product.description && (
              (() => {
                const peh = parsePEHFromDescription(product.description);
                if (peh.proteins === 0 && peh.emollients === 0 && peh.humectants === 0) return null;
                return (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-wider cursor-help"
                    title="Analiza składu na podstawie opisu: P (Proteiny) – odbudowa, E (Emolienty) – wygładzenie i ochrona, H (Humektanty) – nawilżenie."
                  >
                    <span className="text-gray-400">PEH:</span>
                    <span className="text-blue-600">P: {peh.proteins}%</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-green-600">E: {peh.emollients}%</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-orange-600">H: {peh.humectants}%</span>
                  </div>
                );
              })()
            )}
          </div>

        </div>

        {/* Pricing & CTA Section */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
          {/* 9. CENA */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cena od</span>
            <span className="text-xl sm:text-3xl font-black text-gray-900 tracking-tighter">
              {formatPrice(bestOffer.price_pln)}
            </span>
            {costPerApp !== null && (
              <div
                className="text-[10px] sm:text-xs text-teal-600 font-bold mt-1 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100 inline-flex items-center gap-1 cursor-help"
                title="Szacowany koszt jednego użycia na podstawie ceny, pojemności produktu oraz wskazanej długości włosów."
              >
                <span className="shrink-0">✨ Koszt na mycie:</span>
                <span className="text-teal-700">{costPerApp.toFixed(2)} zł</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">

            {/* 10. PRZYCISK SZCZEGÓŁY */}
            <Link
              to={`/produkt/${product.slug}`}
              className="px-4 py-2.5 bg-gray-50 text-gray-700 text-xs font-black rounded-xl hover:bg-gray-100 transition-all border border-gray-200 uppercase tracking-wide"
            >
              Szczegóły
            </Link>

            {/* 11. PRZYCISK IDŹ DO SKLEPU */}
            <a
              href={bestOffer.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={(e) => handleOutboundClick(e, bestOffer.merchant, bestOffer.price_pln)}
              className="inline-flex items-center px-6 py-2.5 bg-primary text-white text-xs sm:text-sm font-black rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 transform active:scale-95 uppercase tracking-wider"
            >
              Do sklepu
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* COMPARISON TOGGLE BUTTON - CORNER */}
      <button
        onClick={handleComparisonToggle}
        title={isInComparison ? "Usuń z porównania" : "Dodaj do porównania"}
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-xl transition-all border shadow-sm z-10 flex items-center justify-center ${isInComparison
          ? 'bg-accent border-accent text-accent-dark shadow-md'
          : 'bg-white/80 border-gray-100 text-gray-400 hover:text-primary hover:bg-white hover:border-gray-200'
          }`}
      >
        <svg className={`w-5 h-5 ${isInComparison ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    </div>
  );
}
