import { Link } from 'react-router-dom';
import type { Product, Filters } from '../types';
import { formatPrice } from '../lib/format';
import { matchScore, generateWhyMatchesBullets } from '../lib/scoring';
import { CLAIM_LABELS, FREE_FROM_LABELS } from '../lib/constants';
import MatchLabel from './MatchLabel';
import { trackEvents } from '../lib/track';

interface ProductCardProps {
  product: Product;
  filters: Filters;
  position: number;
}

export default function ProductCard({ product, filters, position }: ProductCardProps) {
  const score = matchScore(product, filters);
  const bullets = generateWhyMatchesBullets(product, filters);
  const bestOffer = product.offers.reduce((a, b) => a.price_pln < b.price_pln ? a : b);
  const badges = [
    ...product.claims.map(c => CLAIM_LABELS[c]).filter(Boolean),
    ...product.free_from.map(f => FREE_FROM_LABELS[f]).filter(Boolean)
  ].slice(0, 3);

  const handleOutboundClick = (e: React.MouseEvent, merchant: string, price: number) => {
    e.stopPropagation();
    trackEvents.outbound_click(product.id, merchant, 'product_card', position, price);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex gap-4">
        <Link to={`/produkt/${product.slug}`} className="shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={product.images}
              alt={`${product.brand} ${product.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
              <Link to={`/produkt/${product.slug}`}>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight hover:text-teal-600 transition-colors">{product.name}</h3>
              </Link>
            </div>
            {(filters.hair_goals.length > 0 || filters.hair_types.length > 0) && (
              <MatchLabel score={score} />
            )}
          </div>

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {badges.map((badge, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-medium">{badge}</span>
              ))}
            </div>
          )}

          {bullets.length > 0 && (
            <ul className="mt-2 space-y-0.5">
              {bullets.map((b, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                  <svg className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-teal-600">{formatPrice(bestOffer.price_pln)}</span>
            <a
              href={bestOffer.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={(e) => handleOutboundClick(e, bestOffer.merchant, bestOffer.price_pln)}
              className="inline-flex items-center px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
            >
              Kup teraz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
