import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OffersList from '../components/OffersList';
import Badge from '../components/Badge';
import SEO from '../components/SEO';
import { PRODUCTS } from '../data/products';
import { CLAIM_LABELS, FREE_FROM_LABELS, CATEGORY_LABELS } from '../lib/constants';
import { parseInciString, getIngredientExplanation } from '../lib/ingredients';
import { useStore } from '../store/useStore';
import { generateWhyMatchesBullets } from '../lib/scoring';
import { trackEvents } from '../lib/track';
import type { IngredientFlags } from '../types';

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const filters = useStore((s) => s.filters);

  const product = PRODUCTS.find(p => p.slug === slug);

  useEffect(() => {
    if (product) {
      trackEvents.view_product(product.id);
    }
  }, [product]);

  const bullets = useMemo(() => {
    if (!product) return [];
    return generateWhyMatchesBullets(product, filters);
  }, [product, filters]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter(p =>
      p.id !== product.id &&
      p.category === product.category
    ).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt nie znaleziony</h1>
          <Link to="/porownaj" className="text-teal-600 hover:text-teal-700">Wroc do porownywarki</Link>
        </main>
        <Footer />
      </>
    );
  }

  const ingredientList = parseInciString(product.inci);
  const flagEntries = (Object.entries(product.ingredient_flags) as [keyof IngredientFlags, boolean][]).filter(([, v]) => v);
  const claimBadges = product.claims.map(c => CLAIM_LABELS[c]).filter(Boolean);
  const freeBadges = product.free_from.map(f => FREE_FROM_LABELS[f]).filter(Boolean);

  return (
    <>
      <SEO title={`${product.brand} ${product.name}`} description={`${product.brand} ${product.name} — sprawdz sklad INCI, ceny i opinie.`} />
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 rounded-2xl overflow-hidden mb-8">
          <img
            src={product.images}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{CATEGORY_LABELS[product.category]}</p>

          {(claimBadges.length > 0 || freeBadges.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {claimBadges.map((b, i) => <Badge key={`c-${i}`} label={b} variant="teal" />)}
              {freeBadges.map((b, i) => <Badge key={`f-${i}`} label={b} variant="green" />)}
            </div>
          )}
        </div>

        {bullets.length > 0 && (
          <section className="bg-teal-50 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-3">Dlaczego pasuje?</h2>
            <ul className="space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Sklad (INCI)</h2>
          <div className="bg-gray-50 rounded-xl p-4 mb-3">
            <p className="text-xs text-gray-600 font-mono leading-relaxed">{ingredientList.join(', ')}</p>
          </div>
          {flagEntries.length > 0 && (
            <div className="space-y-2">
              {flagEntries.map(([flag]) => (
                <div key={flag} className="flex items-start gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium shrink-0">
                    {flag.replace('has_', '').replace('_', ' ').toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500">{getIngredientExplanation(flag)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Najlepsze oferty</h2>
          <OffersList offers={product.offers} productId={product.id} />
          <p className="text-xs text-gray-400 mt-3">
            Linki moga byc afiliacyjne — nie wplywa to na cene dla Ciebie.
          </p>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Podobne produkty</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(rp => (
                <Link key={rp.id} to={`/produkt/${rp.slug}`} className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-shadow">
                  <img src={rp.images} alt={rp.name} className="w-full h-28 object-cover rounded-lg bg-gray-50 mb-2" />
                  <p className="text-[10px] text-gray-400 uppercase">{rp.brand}</p>
                  <h3 className="text-xs font-semibold text-gray-900 leading-tight">{rp.name}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
