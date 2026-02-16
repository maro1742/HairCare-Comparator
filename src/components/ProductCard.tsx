import { Link } from 'react-router-dom';
import type { Product, Filters } from '../types';
import { formatPrice } from '../lib/format';
import { matchScore } from '../lib/scoring';
import { CLAIM_LABELS, FREE_FROM_LABELS } from '../lib/constants';
import MatchLabel from './MatchLabel';
import { trackEvents } from '../lib/track';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: Product;
  filters: Filters;
  position: number;
}

export default function ProductCard({ product, filters, position }: ProductCardProps) {
  const score = matchScore(product, filters);
  const bestOffer = product.offers.reduce((a, b) => a.price_pln < b.price_pln ? a : b);
  const badges = [
    ...product.claims.map(c => CLAIM_LABELS[c]).filter(Boolean),
    ...product.free_from.map(f => FREE_FROM_LABELS[f]).filter(Boolean)
  ].slice(0, 3);

  const comparisonProductIds = useStore((s) => s.comparisonProductIds);
  const addToComparison = useStore((s) => s.addToComparison);
  const removeFromComparison = useStore((s) => s.removeFromComparison);

  const isInComparison = comparisonProductIds.includes(product.id);
  const isComparisonFull = comparisonProductIds.length >= 4;

  const handleOutboundClick = (e: React.MouseEvent, merchant: string, price: number) => {
    e.stopPropagation();
    trackEvents.outbound_click(product.id, merchant, 'product_card', position, price);
  };

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison) {
      removeFromComparison(product.id);
    } else if (!isComparisonFull) {
      addToComparison(product.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 group relative">
      {/* Comparison Button */}
      <button
        onClick={handleComparisonToggle}
        disabled={!isInComparison && isComparisonFull}
        className={`absolute top-4 right-4 z-10 p-2 rounded-lg transition-all ${isInComparison
            ? 'bg-teal-500 text-white shadow-md'
            : isComparisonFull
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200'
          }`}
        title={isInComparison ? 'Usuń z porównania' : isComparisonFull ? 'Limit 4 produktów' : 'Dodaj do porównania'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      <div className="flex gap-5">
        <Link to={`/produkt/${product.slug}`} className="shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-background relative">
            <img
              src={product.images[0]}
              alt={`${product.brand} ${product.name}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <p className="text-xs text-primary/60 uppercase tracking-wider font-semibold">{product.brand}</p>
                <Link to={`/produkt/${product.slug}`}>
                  <h3 className="font-semibold text-primary text-base sm:text-lg leading-tight hover:text-secondary transition-colors line-clamp-2">{product.name}</h3>
                </Link>
              </div>
              {(filters.hair_goals.length > 0 || filters.hair_types.length > 0) && (
                <MatchLabel score={score} />
              )}
            </div>

            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {badges.map((badge, i) => (
                  <span key={i} className="px-2.5 py-0.5 bg-background text-primary/70 border border-primary/5 rounded-full text-[10px] font-medium tracking-wide uppercase">{badge}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 sm:mt-0 pt-2 border-t border-primary/5">
            <span className="text-xl font-bold text-primary">{formatPrice(bestOffer.price_pln)}</span>
            <a
              href={bestOffer.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={(e) => handleOutboundClick(e, bestOffer.merchant, bestOffer.price_pln)}
              className="inline-flex items-center px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              Do sklepu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
