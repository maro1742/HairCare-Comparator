import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductBundlesProps {
    currentProduct: Product;
    allProducts: Product[];
}

export default function ProductBundles({ currentProduct, allProducts }: ProductBundlesProps) {
    if (!currentProduct || !allProducts.length) return null;

    // Znajdź produkty tej samej marki, ale inne niż obecny
    const sameBrand = allProducts.filter(p => p.brand === currentProduct.brand && p.id !== currentProduct.id);
    let match: Product | undefined;

    // Logika parowania: Szampon szuka odżywki/maski, Odżywka/Maska szuka szamponu
    if (currentProduct.category === 'shampoo') {
        match = sameBrand.find(p => p.category === 'conditioner' || p.category === 'mask');
    } else if (currentProduct.category === 'conditioner' || currentProduct.category === 'mask') {
        match = sameBrand.find(p => p.category === 'shampoo');
    }

    if (!match) return null;

    // Przekształcamy kategorie na formę dopełniacza lub narzędnika dla zdania
    const currentType = currentProduct.category === 'shampoo' ? 'szamponu' : 'odżywki/maski';
    const matchType = match.category === 'shampoo' ? 'szamponem' : (match.category === 'mask' ? 'maską' : 'odżywką');

    return (
        <section className="mb-12">
            <h2 className="text-xl font-black text-gray-900 mb-4">Idealny Duet</h2>
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-6 md:p-8 border border-teal-100 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">

                    {/* WIZUALIZACJA ZESTAWU */}
                    <div className="flex items-center justify-center gap-4 w-full md:w-5/12">
                        {/* 1. Aktualny produkt */}
                        <div className="w-28 h-28 bg-white rounded-3xl p-3 shadow-md border-2 border-white flex-shrink-0 relative">
                            {currentProduct.images[0] ? (
                                <img src={currentProduct.images[0]} alt={currentProduct.name} className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-2xl">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Plus */}
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md text-teal-600 font-black shrink-0 z-10 -mx-6 border-2 border-teal-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>

                        {/* 2. Rekomendacja */}
                        <Link to={`/produkt/${match.slug}`} className="w-32 h-32 bg-white rounded-3xl p-3 shadow-xl border-4 border-teal-400 flex-shrink-0 relative group hover:scale-105 hover:shadow-2xl transition-all cursor-pointer">
                            {match.images[0] ? (
                                <img src={match.images[0]} alt={match.name} className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-2xl">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute -top-3 -right-3 bg-[#e43a60] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md border-2 border-white transform rotate-3 truncate max-w-[120px]">
                                Polecamy
                            </div>
                        </Link>
                    </div>

                    {/* TEKST I AKCJA */}
                    <div className="w-full md:w-7/12 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-teal-900 mb-3 tracking-tight">Zyskaj lepsze efekty w zestawie</h3>
                        <p className="text-sm text-teal-800/80 mb-5 leading-relaxed font-medium">
                            Nasza analiza pokazuje, że połączenie tego {currentType} z dedykowaną {matchType} <strong className="text-teal-900 bg-teal-100/50 px-1 rounded">{match.name}</strong> wzmacnia działanie składników aktywnych z jednej serii.
                            Włosy będą gładsze, zapach utrzyma się dłużej, a Ty przedłużysz efekt "Wow" po umyciu.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Link
                                to={`/produkt/${match.slug}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Zobacz {match.category === 'shampoo' ? 'Szampon' : 'Odżywkę'} z Serii
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
