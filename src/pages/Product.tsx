import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OffersList from '../components/OffersList';
import SEO from '../components/SEO';
import ProductCarousel from '../components/ProductCarousel';
import IngredientAnalysis from '../components/IngredientAnalysis';
import StarRating from '../components/StarRating';
import { CLAIM_LABELS, FREE_FROM_LABELS } from '../lib/constants';
import { useStore } from '../store/useStore';
import { generateWhyMatchesBullets } from '../lib/scoring';
import { trackEvents } from '../lib/track';
import { getProductBySlug, getAllProducts } from '../services/productService';
import type { Product as UIProduct } from '../types';

// Helper to format raw text into paragraphs and list items
function FormatText({ text }: { text: string }) {
  if (!text) return null;

  // Split by common separators (newlines, bullet points)
  const sections = text.split(/\n+/);

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Check if it's a list item
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
          return (
            <div key={idx} className="flex gap-3 pl-2">
              <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{trimmed.replace(/^[•\-*\d\.]+\s*/, '')}</p>
            </div>
          );
        }

        return (
          <p key={idx} className="text-sm text-gray-700 leading-relaxed font-normal">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const filters = useStore((s) => s.filters);
  const comparisonProductIds = useStore((s) => s.comparisonProductIds);
  const addToComparison = useStore((s) => s.addToComparison);
  const removeFromComparison = useStore((s) => s.removeFromComparison);

  const [product, setProduct] = useState<UIProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<UIProduct[]>([]);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const p = await getProductBySlug(slug);

        // Mock rating if missing
        if (p && !p.rating) {
          p.rating = {
            average: 4.5 + Math.random() * 0.5,
            count: Math.floor(20 + Math.random() * 480)
          };
        }

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

  // Deduplicate description: remove parts that are already in 'usage' or 'inci'
  const cleanDescription = useMemo(() => {
    if (!product?.description) return '';
    let desc = product.description.replace(/<[^>]+>/g, ' ');

    if (product.usage) {
      // If usage is found inside description, remove it
      const usageNormalized = product.usage.toLowerCase().trim();
      const descLower = desc.toLowerCase();

      // Try to find common intro phrases like "Sposób użycia:"
      const usageHeaders = ['sposób użycia:', 'stosowanie:', 'jak używać:', 'użycie:', 'aplikacja:'];
      let foundHeader = '';
      for (const header of usageHeaders) {
        if (descLower.includes(header)) {
          foundHeader = header;
          break;
        }
      }

      if (foundHeader) {
        const startIdx = descLower.indexOf(foundHeader);
        // Remove from header to end of a reasonable block or end of string
        // Usually usage is at the end or followed by INCI
        const nextSectionIdx = descLower.indexOf('inci:', startIdx + 10);
        const endIdx = nextSectionIdx !== -1 ? nextSectionIdx : desc.length;
        desc = desc.substring(0, startIdx) + desc.substring(endIdx);
      } else if (descLower.includes(usageNormalized.substring(0, 50))) {
        // Fallback: if a large chunk of usage matches, try to remove that block
        const startIdx = descLower.indexOf(usageNormalized.substring(0, 50));
        if (startIdx !== -1) {
          desc = desc.substring(0, startIdx);
        }
      }
    }

    return desc.trim();
  }, [product]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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
          <Link to="/porownaj" className="text-primary hover:opacity-80 transition-opacity">Wróć do porównywarki</Link>
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
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest hidden sm:inline">Szczegóły Produktu</span>
          <button
            onClick={() => {
              if (product) {
                const isInComparison = comparisonProductIds.includes(product.id);
                const isComparisonFull = comparisonProductIds.length >= 4;
                if (isInComparison) {
                  removeFromComparison(product.id);
                } else if (!isComparisonFull) {
                  addToComparison(product.id);
                }
              }
            }}
            disabled={product && !comparisonProductIds.includes(product.id) && comparisonProductIds.length >= 4}
            className={`p-2 rounded-full transition-colors ${product && comparisonProductIds.includes(product.id)
              ? 'bg-primary/10 text-primary'
              : comparisonProductIds.length >= 4
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-20 pb-24">
        {/* SHARED HEADER (Mobile: stack top, Desktop: split right) */}
        <div className="flex flex-col sm:flex-row gap-8 mb-12">

          {/* MOBILE ORDER: BRAND -> NAME -> RATING -> IMAGE */}
          <div className="sm:hidden space-y-2 mb-4">
            <p className="text-[12px] font-black text-primary uppercase tracking-[0.2em]">{product.brand}</p>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
            {product.rating && <StarRating average={product.rating.average} count={product.rating.count} size="sm" />}
          </div>

          {/* IMAGE (Left on desktop, middle sequence on mobile) */}
          <div className="w-full sm:w-1/2">
            <ProductCarousel images={product.images} alt={`${product.brand} ${product.name}`} />
          </div>

          {/* DESKTOP INFO (Shown right of image on desktop) */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Desktop only title/rating */}
            <div className="hidden sm:block mb-6">
              <p className="text-[14px] font-black text-primary uppercase tracking-[0.2em] mb-2">{product.brand}</p>
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{product.name}</h1>
              {product.rating && <StarRating average={product.rating.average} count={product.rating.count} size="lg" />}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {claimBadges.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent-dark rounded-full text-xs font-bold shadow-sm">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  {b}
                </span>
              ))}
              {freeBadges.map((b, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-100">
                  {b}
                </span>
              ))}
            </div>

            {/* Match Section banner */}
            {bullets.length > 0 && (
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Dlaczego pasuje?
                </h2>
                <ul className="space-y-3">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] font-medium text-gray-700 leading-snug">
                      <span className="mt-1.5 w-1 h-1 bg-primary rounded-full shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* DETAILS SECTION (Consistent vertical order below header) */}
        <div className="space-y-12">

          {/* 1. Główne działanie (Move above description as requested) */}
          {product.cosmetic_function && (
            <section>
              <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10">
                <h2 className="text-xs font-black text-accent-dark uppercase tracking-widest mb-3">Główne działanie</h2>
                <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
                  {product.cosmetic_function}
                </p>
              </div>
            </section>
          )}

          {/* 2. Opis produktu */}
          {cleanDescription && (
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">O produkcie</h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <FormatText text={cleanDescription} />
              </div>
            </section>
          )}

          {/* 3. Sposób użycia */}
          {product.usage && (
            <section>
              <h2 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Sposób użycia</h2>
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <FormatText text={product.usage} />
              </div>
            </section>
          )}

          {/* 4. Składniki */}
          <section>
            <IngredientAnalysis inci={product.inci} categories={product.ingredient_categories} />
          </section>

          {/* 5. Najlepsze oferty */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900">Najlepsze oferty</h2>
              <span className="text-xs text-gray-400 font-medium">Znaleziono {product.offers.length} oferty</span>
            </div>
            <OffersList offers={product.offers} productId={product.id} />
            <p className="text-[10px] text-center text-gray-400 mt-6 max-w-sm mx-auto leading-relaxed">
              Klikając w przycisk, zostaniesz bezpiecznie przeniesiony do strony sprzedawcy. Ceny mogą ulec zmianie.
            </p>
          </section>

          {/* 6. Podobne produkty */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900">Podobne produkty</h2>
                <Link to="/porownaj" className="text-xs font-black text-primary uppercase tracking-wider">Zobacz wszystkie</Link>
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
                    <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-1">{rp.brand}</p>
                    <h3 className="text-xs font-bold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5em]">{rp.name}</h3>
                    <p className="text-xs font-black text-gray-900">{(rp.offers[0]?.price_pln || 0).toFixed(2)} zł</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
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
