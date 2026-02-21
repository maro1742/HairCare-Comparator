import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PriceTracker from '../components/PriceTracker';
import { CATEGORIES } from '../data/categories';
import { mapToUIProduct } from '../services/productService';
import { useStore } from '../store/useStore';
import ComparisonWidget from '../components/ComparisonWidget';

const PSEOTemplate: React.FC = () => {
    const { category, attribute, problem } = useParams<{ category: string; attribute?: string; problem?: string }>();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const comparisonProductIds = useStore((s) => s.comparisonProductIds);
    const addToComparison = useStore((s) => s.addToComparison);
    const removeFromComparison = useStore((s) => s.removeFromComparison);

    const categoryData = CATEGORIES.find(c => c.slug === category) || { name: category || '', intro: '' };

    // Dynamic naming logic
    const displayCategory = categoryData.name;
    const displayAttribute = attribute ? attribute.charAt(0).toUpperCase() + attribute.slice(1) : '';

    // Polish grammar helpers
    const displayProblem = problem
        ? (problem.toLowerCase().includes('wypadanie') ? 'zapobieganie wypadaniu włosów' : problem.replace(/-/g, ' '))
        : '';

    const locativeCategory = (cat: string) => {
        const normalized = cat.toLowerCase();
        const map: Record<string, string> = {
            'szampony': 'szamponach',
            'odżywki': 'odżywkach',
            'odzywki': 'odżywkach',
            'suche': 'odżywkach',
            'maski': 'maskach',
            'serum': 'serach',
            'krecone': 'produktach do włosów kręconych',
            'kręcone': 'produktach do włosów kręconych'
        };
        return map[normalized] || normalized;
    };

    const genitiveCategory = (cat: string) => {
        const normalized = cat.toLowerCase();
        const map: Record<string, string> = {
            'szampony': 'szamponów',
            'odżywki': 'odżywek',
            'odzywki': 'odżywek',
            'suche': 'odżywek',
            'maski': 'masek',
            'serum': 'ser',
            'krecone': 'produktów do włosów kręconych',
            'kręcone': 'produktów do włosów kręconych'
        };
        return map[normalized] || normalized;
    };

    const formatAttributeOrProblem = () => {
        const parts = [];
        if (attribute) {
            const attrMap: Record<string, string> = {
                'biotyna': 'biotyna',
                'aloes': 'aloes',
                'keratyna': 'keratyna',
                'argan': 'olej arganowy',
                'suche': 'włosy suche',
                'krecone': 'włosy kręcone',
                'kręcone': 'włosy kręcone'
            };
            parts.push(attrMap[attribute.toLowerCase()] || attribute);
        }
        if (problem) {
            const probMap: Record<string, string> = {
                'wypadanie': 'wypadanie włosów',
                'lupiez': 'łupież',
                'łupież': 'łupież',
                'suche': 'włosy suche',
                'zniszczone': 'włosy zniszczone',
                'krecone': 'włosy kręcone',
                'kręcone': 'włosy kręcone'
            };
            parts.push(probMap[problem.toLowerCase()] || problem.replace(/-/g, ' '));
        }

        if (parts.length === 0 && !attribute && !problem && category === 'krecone') {
            return 'włosy kręcone';
        }

        return parts.join(' i ');
    };

    const description = formatAttributeOrProblem();
    const isCategoryCurly = category === 'krecone' || categoryData.name.toLowerCase() === 'kręcone';

    // Avoid "Ranking produktów do włosów kręconych - włosy kręcone"
    const refinedDescription = (isCategoryCurly && description === 'włosy kręcone') ? '' : description;

    const pageTitle = `Ranking: Najlepsze ${displayCategory}${refinedDescription ? ' - ' + refinedDescription : ''} | Dobór pielęgnacji wlosowa.pl`;
    const h1 = `Ranking ${genitiveCategory(displayCategory)}${refinedDescription ? ' - ' + refinedDescription : ''} (2026)`;

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const tables = [
                'products_ceneo',
                'products_bielenda',
                'products_natura',
                'products_insight',
                'products_dsd_deluxe'
            ];

            const fetchFromTable = async (tableName: string) => {
                let query = supabase.from(tableName).select('*');

                if (category) {
                    const typeMap: Record<string, string> = {
                        'szampony': 'shampoo',
                        'odzywki': 'conditioner',
                        'odżywki': 'conditioner',
                        'maski': 'mask',
                        'serum': 'serum',
                        'wcierki': 'serum'
                    };
                    if (typeMap[category]) {
                        query = query.eq('category_type', typeMap[category]);
                    }
                }

                if (problem) {
                    const problemMap: Record<string, string> = {
                        'wypadanie': 'Wypadanie',
                        'lupiez': 'Łupież',
                        'łupież': 'Łupież',
                        'suche': 'Suche',
                        'zniszczone': 'Suche',
                        'krecone': 'Kręcone',
                        'loky': 'Kręcone'
                    };
                    if (problemMap[problem]) {
                        query = query.eq('category', problemMap[problem]);
                    } else {
                        query = query.or(`description.ilike.%${problem}%,name.ilike.%${problem}%`);
                    }
                }

                if (attribute) {
                    query = query.or(`name.ilike.%${attribute}%,description.ilike.%${attribute}%`);
                }

                const { data, error } = await query.limit(10).order('price', { ascending: true });
                return error ? [] : (data || []);
            };

            try {
                const results = await Promise.all(tables.map(fetchFromTable));
                const allProducts = results.flat().map(mapToUIProduct);

                // Sort by Rating (average descending, then count descending)
                const sorted = allProducts.sort((a, b) =>
                    ((b.rating?.average || 0) - (a.rating?.average || 0)) ||
                    ((b.rating?.count || 0) - (a.rating?.count || 0))
                );
                setProducts(sorted.slice(0, 15));
            } catch (err) {
                console.error("Error fetching products from multiple tables:", err);
            }

            setLoading(false);
        }

        fetchProducts();
    }, [category, attribute, problem]);

    // Unique Intro/Outro Logic
    const generateIntro = () => {
        const intros = [
            `Szukasz idealnego rozwiązania dla swoich włosów? Nasz ranking ${displayCategory} ${displayAttribute ? 'zawierających ' + displayAttribute : ''} został stworzony, aby pomóc Ci wybrać produkt najlepiej dopasowany do problemów takich jak ${displayProblem || 'codzienna pielęgnacja'}.`,
            `Wybór odpowiednich kosmetyków to klucz do zdrowych włosów. Sprawdź nasze zestawienie ${displayCategory}, które wyróżniają się wysoką zawartością składników takich jak ${displayAttribute || 'naturalne ekstrakty'}.`,
            `Analizujemy setki produktów, aby dostarczyć Ci rzetelne informacje o ${locativeCategory(displayCategory)}. Jeśli Twoim celem ${displayProblem ? 'jest ' + displayProblem : 'są piękne włosy'}, poniższe zestawienie jest dla Ciebie.`
        ];
        // Use a hash of the URL to pick a stable unique intro
        const index = (category?.length || 0 + (attribute?.length || 0) + (problem?.length || 0)) % intros.length;
        return intros[index];
    };

    return (
        <>
            <SEO
                title={pageTitle}
                description={`Najlepsze ${displayCategory} ${displayAttribute ? 'z ' + displayAttribute : ''}. Ranking i porównanie cen produktów na ${displayProblem || 'problemy z włosami'}.`}
            />
            {/* JSON-LD Schema for SEO */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `Czy stosowanie produktów z kategorii ${displayCategory} na ${displayProblem || 'problemy z włosami'} faktycznie działa?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `Tak, regularne stosowanie produktów z kategorii ${displayCategory} zawierających ${displayAttribute || 'składniki aktywne'} pozwala na znaczną poprawę kondycji włosów.`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `Jak szybko zobaczę efekty stosowania ${genitiveCategory(displayCategory)}?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Pierwsze rezultaty są zazwyczaj widoczne po 2-4 tygodniach regularnego stosowania."
                            }
                        }
                    ]
                })}
            </script>
            {products.length > 0 && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": products.map((p, i) => ({
                            "@type": "ListItem",
                            "position": i + 1,
                            "url": `https://wlosowa.pl/produkt/${p.slug}`,
                            "name": p.name
                        }))
                    })}
                </script>
            )}
            <Header />
            <main className="min-h-screen bg-background pb-20">
                <section className="bg-white border-b border-primary/5 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex mb-4 text-xs text-primary/40 uppercase tracking-widest font-bold items-center gap-2">
                            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Home
                            </Link>
                            <span className="text-primary/20">/</span>
                            <Link to="/porownaj" className="hover:text-primary transition-colors">Rankingi</Link>
                            <span className="text-primary/20">/</span>
                            <span className="text-primary/60">{displayCategory}</span>
                            {attribute && (
                                <>
                                    <span className="text-primary/20">/</span>
                                    <span className="text-primary/60">{displayAttribute}</span>
                                </>
                            )}
                        </nav>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
                            {h1}
                        </h1>
                        <p className="text-lg text-primary/70 max-w-3xl leading-relaxed">
                            {generateIntro()}
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <span className="text-xs font-bold text-primary/40 uppercase tracking-wider self-center mr-2">Szybki wybór:</span>
                        <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-all">Ranking 2026</button>
                        <button className="px-4 py-1.5 bg-white text-primary/60 border border-primary/10 text-xs font-bold rounded-full hover:bg-primary/5 transition-all">Najtańsze</button>
                        <button className="px-4 py-1.5 bg-white text-primary/60 border border-primary/10 text-xs font-bold rounded-full hover:bg-primary/5 transition-all">Naturalne</button>
                        <button className="px-4 py-1.5 bg-white text-primary/60 border border-primary/10 text-xs font-bold rounded-full hover:bg-primary/5 transition-all">Profesjonalne</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3 space-y-6">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : products.length > 0 ? (
                                <>
                                    {products.map((product, idx) => (
                                        <div key={product.id} className="bg-white rounded-3xl p-6 border border-primary/5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                                            {idx === 0 && (
                                                <div className="absolute top-0 right-0 px-4 py-1 bg-amber-400 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-xl shadow-sm">
                                                    Wybór Redakcji
                                                </div>
                                            )}
                                            <Link to={`/produkt/${product.slug}`} className="w-full md:w-32 h-32 shrink-0 bg-primary/5 rounded-2xl overflow-hidden block hover:opacity-90 transition-opacity">
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                                            </Link>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 ${idx < 3 ? 'bg-secondary/10 text-secondary' : 'bg-primary/5 text-primary/60'} text-[10px] font-bold uppercase rounded-md`}>
                                                        #{idx + 1} w rankingu
                                                    </span>
                                                </div>
                                                <Link to={`/produkt/${product.slug}`} className="hover:text-secondary transition-colors inline-block">
                                                    <h3 className="text-xl font-bold text-primary mb-1">{product.name}</h3>
                                                </Link>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="flex text-amber-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating?.average || 0) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-bold text-primary">{product.rating?.average}</span>
                                                    <span className="text-[10px] text-primary/40 font-medium">({product.rating?.count} opinii)</span>
                                                </div>
                                                <p className="text-sm text-primary/60 line-clamp-2 mb-4 leading-relaxed">
                                                    {product.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.peh_ratio && (
                                                        <span className="px-2 py-1 bg-secondary/5 text-secondary text-xs font-medium rounded-lg border border-secondary/10">PEH: {product.peh_ratio}</span>
                                                    )}
                                                    {product.hair_porosity && (
                                                        <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg border border-amber-100">Porowatość: {product.hair_porosity}</span>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const isInCompare = comparisonProductIds.includes(product.id);
                                                            if (isInCompare) {
                                                                removeFromComparison(product.id);
                                                            } else if (comparisonProductIds.length < 4) {
                                                                addToComparison(product.id);
                                                            }
                                                        }}
                                                        disabled={!comparisonProductIds.includes(product.id) && comparisonProductIds.length >= 4}
                                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${comparisonProductIds.includes(product.id)
                                                            ? 'bg-primary text-white border-primary'
                                                            : 'bg-white text-primary/60 border-primary/10 hover:border-primary/30'
                                                            } ${(!comparisonProductIds.includes(product.id) && comparisonProductIds.length >= 4) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                        {comparisonProductIds.includes(product.id) ? 'W porównaniu' : 'Dodaj do porównania'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-64">
                                                <PriceTracker
                                                    currentPrice={product.offers[0]?.price_pln || 0}
                                                    originalPrice={(product.offers[0]?.price_pln || 0) * 1.2}
                                                    merchant={product.brand}
                                                />
                                                <a
                                                    href={product.offers[0]?.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-3 w-full inline-flex items-center justify-center px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-md group"
                                                >
                                                    Sprawdź ofertę
                                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Internal Linking: Related Rankings */}
                                    <div className="mt-12 p-8 bg-white rounded-[40px] border border-primary/5 shadow-sm">
                                        <h2 className="text-2xl font-bold text-primary mb-6">Sprawdź również inne rankingi</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {CATEGORIES.filter(c => c.slug !== category).slice(0, 6).map(relCat => (
                                                <Link
                                                    key={relCat.slug}
                                                    to={`/ranking/${relCat.slug}${attribute ? '/' + attribute : ''}${problem ? '/' + problem : ''}`}
                                                    className="p-4 bg-primary/5 rounded-2xl hover:bg-primary/10 transition-colors group flex items-center justify-between"
                                                >
                                                    <span className="text-sm font-bold text-primary/80 group-hover:text-primary">{relCat.name} {description ? ' - ' + description : ''}</span>
                                                    <svg className="w-4 h-4 text-primary/20 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-primary/20">
                                    <p className="text-primary/40 font-medium">Nie znaleźliśmy produktów pasujących do tych kryteriów.</p>
                                </div>
                            )}
                        </div>

                        <aside className="space-y-6">
                            <div className="bg-primary text-white rounded-[40px] p-8 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full -ml-8 -mb-8 blur-3xl" />
                                <h4 className="text-xl font-bold mb-4 relative z-10 leading-tight">Idealna pielęgnacja dla Twoich włosów?</h4>
                                <p className="text-sm text-white/80 mb-8 relative z-10 font-medium leading-relaxed">
                                    Odpowiedz na 5 pytań i otrzymaj spersonalizowany plan oraz rekomendacje produktów na {description || 'Twój typ włosów'}.
                                </p>
                                <Link to="/quiz" className="w-full inline-flex items-center justify-center px-6 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-white/90 transition-all relative z-10 shadow-lg group-hover:-translate-y-1">
                                    Rozwiąż Quiz
                                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-primary/5 shadow-sm sticky top-6">
                                <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    FAQ: {displayCategory}
                                </h4>
                                <div className="space-y-4">
                                    <div className="text-sm">
                                        <p className="font-bold text-primary mb-1 italic">Czy {displayAttribute || 'stosowanie tych produktów'} faktycznie działa?</p>
                                        <p className="text-primary/60 leading-relaxed">Tak, regularne stosowanie produktów z kategorii {displayCategory} zawierających {displayAttribute || 'składniki aktywne'} pozwala na znaczną poprawę kondycji włosów.</p>
                                    </div>
                                    <div className="text-sm border-t border-primary/5 pt-4">
                                        <p className="font-bold text-primary mb-1 italic">Jak szybko zobaczę efekty?</p>
                                        <p className="text-primary/60 leading-relaxed">Pierwsze rezultaty są zazwyczaj widoczne po 2-4 tygodniach regularnego stosowania.</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <ComparisonWidget />
            </main>
            <Footer />
        </>
    );
};

export default PSEOTemplate;
