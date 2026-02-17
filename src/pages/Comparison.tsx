import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ComparisonTable from '../components/ComparisonTable';
import SEO from '../components/SEO';
import { useStore } from '../store/useStore';
import { getAllProducts } from '../services/productService';
import type { Product } from '../types';

export default function Comparison() {
    const comparisonProductIds = useStore((s) => s.comparisonProductIds);
    const clearComparison = useStore((s) => s.clearComparison);
    const filters = useStore((s) => s.filters);
    const addAnalyticsEvent = useStore((s) => s.addAnalyticsEvent);

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        async function loadProducts() {
            try {
                const all = await getAllProducts();
                const comparisonProducts = all.filter(p => comparisonProductIds.includes(p.id));
                setProducts(comparisonProducts);
            } finally {
                setIsLoading(false);
            }
        }
        loadProducts();
    }, [comparisonProductIds]);

    useEffect(() => {
        if (products.length > 0) {
            addAnalyticsEvent({
                name: 'view_comparison',
                timestamp: Date.now(),
                payload: { product_count: products.length }
            });
        }
    }, [products.length, addAnalyticsEvent]);

    return (
        <>
            <SEO
                title="Porównanie produktów"
                description="Porównaj wybrane kosmetyki do włosów — sprawdź różnice w składzie, cenie i dopasowaniu."
            />
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Porównaj</h1>
                            <p className="text-gray-600">
                                {products.length === 0
                                    ? 'Dodaj produkty do porównania'
                                    : `Porównujesz ${products.length} ${products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktów'}`}
                            </p>
                        </div>
                        {products.length > 0 && (
                            <button
                                onClick={() => {
                                    if (isClearing) {
                                        clearComparison();
                                        setIsClearing(false);
                                    } else {
                                        setIsClearing(true);
                                        // Reset after 3 seconds
                                        setTimeout(() => setIsClearing(false), 3000);
                                    }
                                }}
                                className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${isClearing
                                        ? 'bg-red-600 text-white shadow-lg scale-105 active:scale-95'
                                        : 'text-red-600 hover:bg-red-50'
                                    }`}
                            >
                                {isClearing ? 'Kliknij, aby potwierdzić' : 'Wyczyść wszystko'}
                            </button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Brak produktów do porównania</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Dodaj produkty do porównania, klikając ikonę porównania na kartach produktów lub na stronie szczegółów produktu.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/porownaj"
                                className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
                            >
                                Przeglądaj produkty
                            </Link>
                            <Link
                                to="/quiz"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Zrób quiz
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <ComparisonTable products={products} filters={filters} />

                        {products.length < 4 && (
                            <div className="mt-8 text-center">
                                <Link
                                    to="/porownaj"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-teal-500 text-teal-600 font-medium rounded-xl hover:bg-teal-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Dodaj kolejny produkt ({products.length}/4)
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}
