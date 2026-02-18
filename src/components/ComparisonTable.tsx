import { Link } from 'react-router-dom';
import type { Product, Filters } from '../types';
import { formatPrice } from '../lib/format';
import { matchScore } from '../lib/scoring';
import { CLAIM_LABELS, FREE_FROM_LABELS } from '../lib/constants';
import { useStore } from '../store/useStore';
import { calculateAppCost } from '../utils/calculateAppCost';
import { parsePEHFromDescription } from '../utils/pehParser';
import StarRating from './StarRating';

interface ComparisonTableProps {
    products: Product[];
    filters: Filters;
}

export default function ComparisonTable({ products, filters }: ComparisonTableProps) {
    const removeFromComparison = useStore((s) => s.removeFromComparison);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto -mx-4 px-4">
            <div className="inline-flex min-w-full gap-4 pb-4">
                {products.map((product) => {
                    const score = matchScore(product, filters);
                    const matchPercentage = Math.max(0, Math.min(100, Math.round((score + 1000) / 20)));
                    const bestOffer = product.offers.reduce((a, b) => a.price_pln < b.price_pln ? a : b);
                    const claimBadges = product.claims.map(c => CLAIM_LABELS[c]).filter(Boolean);
                    const freeBadges = product.free_from.map(f => FREE_FROM_LABELS[f]).filter(Boolean);
                    const hairLength = filters.hair_length || 'medium';

                    // PEH Analysis
                    const peh = product.description ? parsePEHFromDescription(product.description) : null;
                    const hasPEH = peh && (peh.proteins > 0 || peh.emollients > 0 || peh.humectants > 0);

                    // Cost per application
                    let costPerApp = null;
                    const isCalculatableCategory = ['shampoo', 'conditioner', 'mask', 'serum'].includes(product.category);
                    if (isCalculatableCategory && product.volume_ml && bestOffer.price_pln) {
                        costPerApp = calculateAppCost(
                            bestOffer.price_pln,
                            product.volume_ml,
                            product.category as any,
                            hairLength
                        );
                    }

                    return (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-lg"
                        >
                            {/* Product Image */}
                            <div className="relative bg-gray-50 aspect-square">
                                <img
                                    src={product.images[0]}
                                    alt={`${product.brand} ${product.name}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeFromComparison(product.id)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Usuń z porównania"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-6 space-y-6">
                                {/* Brand & Name */}
                                <div>
                                    <p className="text-xs font-black text-teal-500 uppercase tracking-[0.2em] mb-1">
                                        {product.brand}
                                    </p>
                                    <Link to={`/produkt/${product.slug}`}>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    {product.rating && (
                                        <div className="flex items-center gap-2">
                                            <StarRating average={product.rating.average} count={product.rating.count} size="sm" />
                                        </div>
                                    )}
                                </div>

                                {/* Match Score */}
                                {(filters.hair_goals.length > 0 || filters.hair_types.length > 0) && (
                                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-100">
                                        <div className="text-center">
                                            <div className="text-4xl font-black text-gray-900 mb-1">
                                                {matchPercentage}%
                                            </div>
                                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Dopasowanie</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Function */}
                                {product.cosmetic_function && (
                                    <div>
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Główna Funkcja
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">
                                                {product.cosmetic_function.split(',')[0].trim()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Hair Type Fit */}
                                {product.hair_type_fit.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Typ Włosów
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            {product.hair_type_fit.map(t => {
                                                const labels: Record<string, string> = {
                                                    fine: 'Cienkie',
                                                    thick: 'Grube',
                                                    curly: 'Kręcone',
                                                    straight: 'Proste',
                                                    colored: 'Farbowane',
                                                    bleached: 'Rozjaśniane'
                                                };
                                                return labels[t] || t;
                                            }).join(' / ')}
                                        </p>
                                    </div>
                                )}

                                {/* PEH Balance */}
                                {hasPEH && (
                                    <div>
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Równowaga PEH
                                        </h4>
                                        <div
                                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-black uppercase tracking-wider cursor-help w-full justify-between"
                                            title="Analiza składu na podstawie opisu: P (Proteiny) – odbudowa, E (Emolienty) – wygładzenie i ochrona, H (Humektanty) – nawilżenie."
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-600">P: {peh.proteins}%</span>
                                                <span className="text-gray-200">|</span>
                                                <span className="text-green-600">E: {peh.emollients}%</span>
                                                <span className="text-gray-200">|</span>
                                                <span className="text-orange-600">H: {peh.humectants}%</span>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Key Ingredients */}
                                {product.inci && (
                                    <div>
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Kluczowe Składniki
                                        </h4>
                                        <div className="text-sm text-gray-700 space-y-1">
                                            {product.inci.split(',').slice(0, 3).map((ing, i) => (
                                                <div key={i}>{ing.trim()}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Claims & Free From */}
                                {(claimBadges.length > 0 || freeBadges.length > 0) && (
                                    <div className="flex flex-wrap gap-2">
                                        {claimBadges.slice(0, 3).map((badge, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                                {badge}
                                            </span>
                                        ))}
                                        {freeBadges.slice(0, 2).map((badge, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-100">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Price */}
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                        Cena
                                    </h4>
                                    <div className="flex items-end justify-between">
                                        <div className="text-2xl font-black text-gray-900">
                                            {formatPrice(bestOffer.price_pln)}
                                        </div>
                                        {costPerApp !== null && (
                                            <div
                                                className="text-[10px] text-teal-600 font-bold mb-1 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100 flex items-center gap-1 cursor-help"
                                                title="Szacowany koszt jednego użycia na podstawie ceny, pojemności produktu oraz wskazanej długości włosów."
                                            >
                                                <span className="shrink-0">✨ {costPerApp.toFixed(2)} zł</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    <Link
                                        to={`/produkt/${product.slug}`}
                                        className="w-full py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors text-center"
                                    >
                                        Zobacz szczegóły
                                    </Link>
                                    <a
                                        href={bestOffer.url}
                                        target="_blank"
                                        rel="nofollow sponsored noopener"
                                        className="w-full py-3 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 transition-colors text-center"
                                    >
                                        Kup teraz
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
