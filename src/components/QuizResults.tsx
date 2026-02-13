import { Link } from 'react-router-dom';
import type { Product, UserProfile, Filters } from '../types';
import { formatPrice } from '../lib/format';
import { matchScore, generateWhyMatchesBullets } from '../lib/scoring';
import MatchLabel from './MatchLabel';
import { trackEvents } from '../lib/track';

interface QuizResultsProps {
  products: Product[];
  profile: UserProfile;
  onRestart: () => void;
}

export default function QuizResults({ products, profile, onRestart }: QuizResultsProps) {
  const filters: Filters = {
    categories: [],
    hair_goals: profile.hair_goals,
    hair_types: profile.hair_type,
    scalp_types: [profile.scalp_type],
    avoid_ingredients: profile.avoid_ingredients,
    vegan_only: profile.prefers_vegan,
    price_min: 0,
    price_max: 999,
    brands: [],
    sort_by: 'match',
  };

  const scored = products
    .map(p => ({ product: p, score: matchScore(p, filters) }))
    .filter(p => p.score > -900)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">TOP 5 dla Ciebie</h2>
        <p className="text-gray-500">Dopasowane na podstawie Twoich odpowiedzi</p>
      </div>

      <div className="space-y-4">
        {scored.map(({ product, score }, i) => {
          const bullets = generateWhyMatchesBullets(product, filters);
          const bestOffer = product.offers.reduce((a, b) => a.price_pln < b.price_pln ? a : b);

          return (
            <div key={product.id} className={`bg-white rounded-xl border ${i < 3 ? 'border-teal-200 shadow-md' : 'border-gray-100'} p-5`}>
              <div className="flex gap-4">
                <Link to={`/produkt/${product.slug}`} className="shrink-0">
                  <img
                    src={product.images}
                    alt={`${product.brand} ${product.name}`}
                    className="w-20 h-20 rounded-lg object-cover bg-gray-50"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-gray-400 uppercase">{product.brand}</span>
                      <Link to={`/produkt/${product.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-teal-600 transition-colors">{product.name}</h3>
                      </Link>
                    </div>
                    <MatchLabel score={score} />
                  </div>

                  {bullets.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {bullets.map((b, j) => (
                        <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
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
                      onClick={() => trackEvents.outbound_click(product.id, bestOffer.merchant, 'quiz_results', i, bestOffer.price_pln)}
                      className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Najtansza oferta
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <Link
          to="/porownaj"
          className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors text-center"
        >
          Zastosuj filtry w porownywarce
        </Link>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Zmien odpowiedzi
        </button>
      </div>
    </div>
  );
}
