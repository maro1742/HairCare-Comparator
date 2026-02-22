import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FilterPanel from '../components/FilterPanel';
import FilterChips from '../components/FilterChips';
import SortDropdown from '../components/SortDropdown';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useStore } from '../store/useStore';
import { getAllProducts } from '../services/productService';
import type { Product } from '../types';
import { matchScore } from '../lib/scoring';
import { formatDate } from '../lib/format';
import { trackEvents } from '../lib/track';

export default function Comparator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const filters = useStore((s) => s.filters);
  const clearFilters = useStore((s) => s.clearFilters);
  const resetAllFilters = useStore((s) => s.resetAllFilters);

  useEffect(() => {
    if (searchParams.get('defaults') === 'true') {
      clearFilters();
      // Usunięcie parametru po zaaplikowaniu, aby odświeżenie strony nie resetowało znów filtrów
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams, clearFilters]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const all = await getAllProducts();
        setProducts(all);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  }, [products]);

  const filtered = useMemo(() => {
    const hasActiveFilters =
      filters.brands.length > 0 ||
      filters.categories.length > 0 ||
      filters.hair_goals.length > 0 ||
      filters.hair_types.length > 0 ||
      filters.scalp_types.length > 0 ||
      filters.avoid_ingredients.length > 0 ||
      filters.vegan_only ||
      (filters.price_min !== '' && filters.price_min > 10) ||
      (filters.price_max !== '' && filters.price_max < 500);

    if (!searchQuery && !hasActiveFilters) {
      return [...products]
        .sort((a, b) => (b.rating?.count ?? b.popularity) - (a.rating?.count ?? a.popularity))
        .slice(0, 10);
    }

    const result = products.filter(p => {
      if (searchQuery && !`${p.brand} ${p.name}`.toLowerCase().includes(searchQuery)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
      if (filters.vegan_only && !p.claims.includes('vegan')) return false;

      if (filters.hair_goals.length > 0 && !filters.hair_goals.some(g => p.hair_goals.includes(g))) return false;
      if (filters.hair_types.length > 0 && !filters.hair_types.some(t => p.hair_type_fit.includes(t))) return false;
      if (filters.scalp_types.length > 0 && !filters.scalp_types.some(s => p.scalp_fit.includes(s))) return false;

      const bestPrice = Math.min(...p.offers.map(o => o.price_pln));
      const minPrice = filters.price_min === '' ? 0 : filters.price_min;
      const maxPrice = filters.price_max === '' ? Infinity : filters.price_max;
      if (bestPrice < minPrice || bestPrice > maxPrice) return false;

      const score = matchScore(p, filters, searchQuery);
      if (score <= -900) return false;

      return true;
    });

    if (filters.sort_by === 'price') {
      result.sort((a, b) => Math.min(...a.offers.map(o => o.price_pln)) - Math.min(...b.offers.map(o => o.price_pln)));
    } else if (filters.sort_by === 'popularity') {
      result.sort((a, b) => (b.rating?.count ?? b.popularity) - (a.rating?.count ?? a.popularity));
    } else {
      result.sort((a, b) => matchScore(b, filters, searchQuery) - matchScore(a, filters, searchQuery));
    }

    return result;
  }, [filters, searchQuery, products]);

  useEffect(() => {
    trackEvents.view_list('comparator', filtered.length);
  }, [filtered.length]);

  return (
    <>
      <SEO title="Porównywarka kosmetyków" description="Porównaj kosmetyki do włosów — filtruj po składzie, typie włosów i cenie." />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4 lg:mb-0">Porównywarka produktów do włosów</h1>

        <div className="sticky top-16 z-30 -mx-4 px-4 py-4 bg-white/95 backdrop-blur-sm border-b border-gray-100 lg:static lg:z-auto lg:mx-0 lg:px-0 lg:py-0 lg:bg-transparent lg:border-0 lg:mb-8 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <SortDropdown />
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 bg-white shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Filtry
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <FilterChips />
              </div>
              <Link to="/quiz" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-teal-100 transition-all border border-teal-100 shadow-sm shrink-0">
                Zrób quiz &rarr; ustaw filtry
              </Link>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 bg-white rounded-xl border border-gray-100 p-5 shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
              <FilterPanel availableBrands={availableBrands} />
            </div>
          </div>

          {filtersOpen && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-6 pb-24">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-gray-900">Filtry</h2>
                    <button onClick={resetAllFilters} className="text-sm text-teal-600 hover:text-teal-700">Wyczyść</button>
                  </div>
                  <button onClick={() => setFiltersOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterPanel availableBrands={availableBrands} hideHeader={true} />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-2">Brak wyników — spróbuj poluzować filtry.</p>
                <button onClick={() => useStore.getState().resetAllFilters()} className="text-sm text-teal-600 hover:text-teal-700">
                  Wyczyść filtry
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} position={i} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-6 text-center">
                  Dane aktualizowane na: {formatDate('2026-02-12')}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="fixed bottom-4 left-4 right-4 lg:hidden z-30">
          <Link
            to="/quiz"
            className="flex items-center justify-center w-full py-3 bg-gray-900 text-white font-medium rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
          >
            Zobacz TOP dla mnie
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
