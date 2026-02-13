import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { PRODUCTS } from '../data/products';
import { CATEGORIES, categoryBySlug, getCategoryForProduct } from '../data/categories';
import { useStore } from '../store/useStore';
import { matchScore } from '../lib/scoring';
import { trackEvents } from '../lib/track';

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const filters = useStore((s) => s.filters);
  const category = categoryBySlug(slug || '');

  const categoryProducts = useMemo(() => {
    if (!slug) return [];
    const prods = PRODUCTS.filter(p => getCategoryForProduct(p).includes(slug));

    if (filters.sort_by === 'price') {
      prods.sort((a, b) => Math.min(...a.offers.map(o => o.price_pln)) - Math.min(...b.offers.map(o => o.price_pln)));
    } else if (filters.sort_by === 'popularity') {
      prods.sort((a, b) => b.popularity - a.popularity);
    } else {
      prods.sort((a, b) => matchScore(b, filters) - matchScore(a, filters));
    }

    return prods;
  }, [slug, filters]);

  useEffect(() => {
    trackEvents.view_list('category_' + slug, categoryProducts.length);
  }, [slug, categoryProducts.length]);

  if (!category) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategoria nie znaleziona</h1>
          <Link to="/porownaj" className="text-teal-600 hover:text-teal-700">Wroc do porownywarki</Link>
        </main>
        <Footer />
      </>
    );
  }

  const relatedCategories = CATEGORIES.filter(c => c.slug !== slug).slice(0, 3);
  const topProducts = categoryProducts.slice(0, 3);

  return (
    <>
      <SEO title={category.name} description={category.description} />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${category.color} rounded-2xl p-8 mb-8`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{category.name}</h1>
          </div>
          <p className="text-gray-700 max-w-2xl leading-relaxed">{category.intro}</p>
        </div>

        <div className="space-y-4 mb-12">
          {categoryProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} filters={filters} position={i} />
          ))}
          {categoryProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8">Brak produktow w tej kategorii.</p>
          )}
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Powiazane kategorie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedCategories.map(cat => (
              <Link key={cat.slug} to={`/kategoria/${cat.slug}`} className={`${cat.color} rounded-xl p-5 hover:shadow-md transition-shadow`}>
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="font-semibold text-gray-900 mt-2">{cat.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {topProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top produkty w tej kategorii</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topProducts.map(p => {
                const bestOffer = p.offers.reduce((a, b) => a.price_pln < b.price_pln ? a : b);
                return (
                  <Link key={p.id} to={`/produkt/${p.slug}`} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <img src={p.images} alt={p.name} className="w-full h-40 object-cover rounded-lg bg-gray-50 mb-3" />
                    <p className="text-xs text-gray-400 uppercase">{p.brand}</p>
                    <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                    <p className="text-teal-600 font-bold mt-1">od {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(bestOffer.price_pln)}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
