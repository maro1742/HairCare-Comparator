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

  const compareList = useStore((s) => s.compareList);
  const addToCompare = useStore((s) => s.addToCompare);
  const removeFromCompare = useStore((s) => s.removeFromCompare);
  const isInCompare = compareList.some((p) => p.id === product.id);
  const compareFull = compareList.length >= 4;

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleOutboundClick = (e: React.MouseEvent, merchant: string, price: number) => {
    e.stopPropagation();
    trackEvents.outbound_click(product.id, merchant, 'product_card', position, price);
  };

  return (
    <div className="bg-white rounded-2xl border border-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 group">
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleCompareToggle}
                disabled={!isInCompare && compareFull}
                title={isInCompare ? 'Usuń z porównania' : compareFull ? 'Maksymalnie 4 produkty' : 'Dodaj do porównania'}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all border ${
                  isInCompare
                    ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                    : compareFull
                      ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-primary/70 border-primary/10 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isInCompare ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  )}
                </svg>
                <span className="hidden sm:inline">{isInCompare ? 'W porównaniu' : 'Porównaj'}</span>
              </button>
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
    </div>
  );
}
