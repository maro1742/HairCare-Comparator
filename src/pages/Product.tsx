import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OffersList from '../components/OffersList';
import SEO from '../components/SEO';
import ProductCarousel from '../components/ProductCarousel';
import IngredientAnalysis from '../components/IngredientAnalysis';
import { CLAIM_LABELS, FREE_FROM_LABELS } from '../lib/constants';
import { useStore } from '../store/useStore';
import { generateWhyMatchesBullets } from '../lib/scoring';
import { trackEvents } from '../lib/track';
import { getProductBySlug, getAllProducts } from '../services/productService';
import type { Product as UIProduct } from '../types';

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const filters = useStore((s) => s.filters);

  const [product, setProduct] = useState<UIProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<UIProduct[]>([]);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const p = await getProductBySlug(slug);
        setProduct(p);

        if (p) {
          trackEvents.view_product(p.id);
          // Load related products
          const all = await getAllProducts();
          const related = all.filter(rp =>
            rp.id !== p.id &&
            rp.category === p.category
          ).slice(0, 4);
          setRelatedProducts(related);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const bullets = useMemo(() => {
    if (!product) return [];
    return generateWhyMatchesBullets(product, filters);
  }, [product, filters]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Ładowanie produktu...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt nie znalezioniony</h1>
          <Link to="/porownaj" className="text-teal-600 hover:text-teal-700">Wróć do porównywarki</Link>
        </main>
        <Footer />
      </>
    );
  }

  const claimBadges = product.claims.map(c => CLAIM_LABELS[c]).filter(Boolean);
  const freeBadges = product.free_from.map(f => FREE_FROM_LABELS[f]).filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title={`${product.brand} ${product.name}`}
        description={`${product.brand} ${product.name} — sprawdź skład INCI, ceny i opinie.`}
      />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Szczegóły Produktu</span>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-20 pb-24">
        {/* Product Images */}
        <div className="mb-8">
          <ProductCarousel images={product.images} alt={`${product.brand} ${product.name}`} />
        </div>

        {/* Product Info */}
        <div className="mb-10">
          <p className="text-[12px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">{product.brand}</p>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">{product.name}</h1>

          <div className="flex flex-wrap gap-2">
            {claimBadges.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold shadow-sm">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                {b}
              </span>
            ))}
            {freeBadges.map((b, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-100">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Match Section */}
        {bullets.length > 0 && (
          <section className="bg-cyan-50/50 rounded-3xl p-8 mb-10 border border-cyan-100 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-gray-900">Dlaczego pasuje?</h2>
            </div>
            <ul className="space-y-4">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-4 text-[15px] font-medium text-gray-700 leading-relaxed">
                  <div className="mt-1 w-5 h-5 bg-cyan-400/20 text-cyan-500 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* INCI Section */}
        <IngredientAnalysis inci={product.inci} categories={product.ingredient_categories} />

        {/* Usage & Function */}
        {(product.usage || product.cosmetic_function) && (
          <section className="mb-10 grid sm:grid-cols-2 gap-6">
            {product.cosmetic_function && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Funkcja</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{product.cosmetic_function}</p>
              </div>
            )}
            {product.usage && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Sposób użycia</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{product.usage}</p>
              </div>
            )}
          </section>
        )}

        {/* Offers Section */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">Najlepsze oferty</h2>
            <span className="text-xs text-gray-400 font-medium">Znaleziono {product.offers.length} oferty</span>
          </div>
          <OffersList offers={product.offers} productId={product.id} />
          <p className="text-[10px] text-center text-gray-400 mt-6 max-w-sm mx-auto leading-relaxed">
            Klikając w przycisk, zostaniesz bezpiecznie przeniesiony do strony sprzedawcy. Ceny mogą ulec zmianie.
          </p>
        </section>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">Podobne produkty</h2>
              <Link to="/porownaj" className="text-xs font-black text-cyan-400 uppercase tracking-wider">Zobacz wszystkie</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(rp => (
                <Link
                  key={rp.id}
                  to={`/produkt/${rp.slug}`}
                  className="group bg-white rounded-3xl border border-gray-100 p-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-3">
                    <img
                      src={rp.images[0]}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-wider mb-1">{rp.brand}</p>
                  <h3 className="text-xs font-bold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5em]">{rp.name}</h3>
                  <p className="text-xs font-black text-gray-900">{(rp.offers[0]?.price_pln || 0).toFixed(2)} zł</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Disclaimer fix padding for mobile */}
      <div className="bg-gray-50 py-10 px-4">
        <p className="max-w-md mx-auto text-[10px] text-gray-400 text-center leading-relaxed italic">
          Utrzymujemy się dzięki prowizjom od zakupów dokonanych u naszych partnerów. Nasze recenzje i porównania pozostają jednak niezależne i obiektywne, a cena dla Ciebie zawsze pozostaje taka sama.
        </p>
      </div>
    </div>
  );
}
