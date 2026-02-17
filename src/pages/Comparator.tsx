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
    const result = products.filter(p => {
      if (searchQuery && !`${p.brand} ${p.name}`.toLowerCase().includes(searchQuery)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
      if (filters.vegan_only && !p.claims.includes('vegan')) return false;

      const bestPrice = Math.min(...p.offers.map(o => o.price_pln));
      if (bestPrice < filters.price_min || bestPrice > filters.price_max) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;

      const score = matchScore(p, filters);
      if (score <= -900) return false;

      return true;
    });

    if (filters.sort_by === 'price') {
      result.sort((a, b) => Math.min(...a.offers.map(o => o.price_pln)) - Math.min(...b.offers.map(o => o.price_pln)));
    } else if (filters.sort_by === 'popularity') {
      result.sort((a, b) => b.popularity - a.popularity);
    } else {
      result.sort((a, b) => matchScore(b, filters) - matchScore(a, filters));
    }

    return result;
  }, [filters, searchQuery]);

  useEffect(() => {
    trackEvents.view_list('comparator', filtered.length);
  }, [filtered.length]);

  return (
    <>
      <SEO title="Porównywarka kosmetyków" description="Porównaj kosmetyki do włosów — filtruj po składzie, typie włosów i cenie." />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Porównywarka</h1>
            <div className="flex items-center gap-3">
              <SortDropdown />
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Filtry
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <FilterChips />
            <Link to="/quiz" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors">
              Zrób quiz &rarr; ustaw filtry
            </Link>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block">
            <FilterPanel availableBrands={availableBrands} />
          </div>

          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Filtry</h2>
                  <button onClick={() => setFiltersOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterPanel availableBrands={availableBrands} />
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
                <button onClick={() => useStore.getState().clearFilters()} className="text-sm text-teal-600 hover:text-teal-700">
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
