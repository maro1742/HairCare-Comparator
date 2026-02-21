import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { CATEGORIES } from '../data/categories';

const RankingHub: React.FC = () => {
    const popularIngredients = [
        { name: 'Biotyna', slug: 'biotyna' },
        { name: 'Aloes', slug: 'aloes' },
        { name: 'Keratyna', slug: 'keratyna' },
        { name: 'Olej Arganowy', slug: 'argan' },
        { name: 'Niacynamid', slug: 'niacynamid' }
    ];

    const popularProblems = [
        { name: 'Wypadanie włosów', slug: 'wypadanie' },
        { name: 'Suche włosy', slug: 'suche' },
        { name: 'Łupież', slug: 'lupiez' },
        { name: 'Zniszczone włosy', slug: 'zniszczone' },
        { name: 'Włosy kręcone', slug: 'krecone' }
    ];

    return (
        <>
            <SEO
                title="Rankingi produktów do pielęgnacji włosów 2026 | wlosowa.pl"
                description="Odkryj najlepsze szampony, maski i odżywki do włosów. Rankingi oparte na analizie składu, cenach i opiniach użytkowników."
            />
            <Header />
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="bg-white border-b border-primary/5 py-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight leading-tight">
                            Rankingi produktów do <span className="text-secondary">pielęgnacji włosów 2026</span>
                        </h1>
                        <p className="text-xl text-primary/60 max-w-2xl mx-auto leading-relaxed font-medium">
                            Znajdź idealny kosmetyk dla swojego typu włosów i skóry głowy. Analizujemy składy i skuteczność tysięcy produktów.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Categories Grid - Visual Style from Screenshot */}
                    <h2 className="text-2xl font-bold text-primary mb-12 flex items-center gap-3">
                        <span className="w-10 h-1 bg-secondary rounded-full" />
                        Główne kategorie rankingów
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                        {CATEGORIES.map(cat => (
                            <Link
                                key={cat.slug}
                                to={`/ranking/${cat.slug}`}
                                className="group bg-white rounded-[40px] border border-primary/5 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-row items-stretch"
                            >
                                <div className="w-1/3 min-h-[160px] relative overflow-hidden shrink-0">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-center">
                                    <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors leading-tight">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-primary/40 leading-relaxed font-medium">
                                        {cat.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Popular Ingredients */}
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                                <span className="w-10 h-1 h-px bg-secondary rounded-full" />
                                Według składnika
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {popularIngredients.map(ing => (
                                    <Link
                                        key={ing.slug}
                                        to={`/ranking/szampony/${ing.slug}`}
                                        className="bg-white p-6 rounded-2xl border border-primary/5 hover:border-secondary hover:bg-secondary/[0.02] transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-bold text-primary/80 group-hover:text-secondary">{ing.name}</span>
                                        <svg className="w-4 h-4 text-primary/20 group-hover:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Popular Problems */}
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                                <span className="w-10 h-1 h-px bg-secondary rounded-full" />
                                Według potrzeb
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {popularProblems.map(prob => (
                                    <Link
                                        key={prob.slug}
                                        to={prob.slug === 'krecone' ? '/ranking/krecone' : `/ranking/szampony/${prob.slug}`}
                                        className="bg-white p-6 rounded-2xl border border-primary/5 hover:border-secondary hover:bg-secondary/[0.02] transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-bold text-primary/80 group-hover:text-secondary">{prob.name}</span>
                                        <svg className="w-4 h-4 text-primary/20 group-hover:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quiz CTA */}
                    <section className="mt-20 bg-primary rounded-[48px] p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/20 rounded-full -ml-32 -mt-32 blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mb-32 blur-3xl" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Nie wiesz, co wybrać?</h2>
                        <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto relative z-10">
                            Rozwiąż nasz quiz i otrzymaj spersonalizowaną listę produktów dopasowaną do Twojej porowatości włosów.
                        </p>
                        <Link to="/quiz" className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-white/90 transition-all shadow-xl hover:-translate-y-1 relative z-10">
                            Rozpocznij Analizę Włosów
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </Link>
                    </section>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default RankingHub;
