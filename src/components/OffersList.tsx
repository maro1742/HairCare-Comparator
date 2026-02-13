import type { Offer } from '../types';
import { formatPrice, formatDateAgo } from '../lib/format';
import { MERCHANT_LABELS } from '../lib/constants';
import { trackEvents } from '../lib/track';

interface OffersListProps {
  offers: Offer[];
  productId: string;
}

export default function OffersList({ offers, productId }: OffersListProps) {
  const sorted = [...offers].sort((a, b) => a.price_pln - b.price_pln);

  return (
    <div className="space-y-3">
      {sorted.map((offer, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
          <div>
            <p className="font-medium text-gray-900">{MERCHANT_LABELS[offer.merchant] || offer.merchant}</p>
            <p className="text-xs text-gray-400">Sprawdzono: {formatDateAgo(offer.last_checked)}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-900">{formatPrice(offer.price_pln)}</span>
            <a
              href={offer.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={() => trackEvents.outbound_click(productId, offer.merchant, 'offers_list', i, offer.price_pln)}
              className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
            >
              Sklep
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
