import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import { HAIR_TYPE_LABELS } from '../lib/constants';
import { trackEvents } from '../lib/track';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  position: number;
}

export default function ProductCard({ product, position }: ProductCardProps) {
  const bestOffer = product.offers.reduce((a, b) => a.price_pln < b.price_pln ? a : b);

  const handleOutboundClick = (e: React.MouseEvent, merchant: string, price: number) => {
    e.stopPropagation();
    trackEvents.outbound_click(product.id, merchant, 'product_card', position, price);
  };

  const hairTypes = product.hair_type_fit
    .map(type => HAIR_TYPE_LABELS[type])
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-6 group flex flex-col sm:flex-row gap-6">

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
          <div className="flex flex-wrap gap-2 pt-1">
            {product.cosmetic_function && (
              <span className="px-3 py-1 bg-accent/5 text-accent-dark rounded-full text-[10px] font-black uppercase tracking-wider border border-accent/10">
                {product.cosmetic_function}
              </span>
            )}
            {hairTypes && (
              <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/10">
                Włosy: {hairTypes}
              </span>
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
    </div>
  );
}
