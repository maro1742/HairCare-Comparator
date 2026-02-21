import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import SEO from '../components/SEO';
import { CATEGORIES } from '../data/categories';

export default function Landing() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Włosowa.pl",
    "alternateName": "Włosowa",
    "url": "https://wlosowa.pl/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wlosowa.pl/porownaj?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEO
        title="Profesjonalne kosmetyki do włosów"
        description="Porównywarka kosmetyków do włosów — sprawdź skład, ceny i dopasowanie do Twoich potrzeb."
        structuredData={structuredData}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight mb-6">
                Profesjonalna pielęgnacja włosów<br />
                <span className="text-secondary italic">w Twoim domu</span>
              </h1>
              <p className="text-lg sm:text-xl text-primary/70 leading-relaxed max-w-2xl mb-10">
                Wybierz idealny produkt w 30 sekund. Analizujemy składy, porównujemy ceny i dopasowujemy kosmetyki do potrzeb Twoich włosów.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Zrób quiz (30 sek)
                </Link>
                <Link
                  to="/porownaj"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border border-primary/10 text-primary font-semibold rounded-2xl hover:bg-background transition-all shadow-sm hover:shadow-md"
                >
                  Przejdź do porównywarki
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="border-y border-primary/5 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">Skład INCI i flagi</h3>
                  <p className="text-sm text-primary/60 leading-relaxed">Przejrzyste oznaczenia: bez silikonów, bez sulfatów, wegańskie.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">Ceny z wielu sklepów</h3>
                  <p className="text-sm text-primary/60 leading-relaxed">Automatycznie wyszukujemy najlepsze oferty w sieci.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">Szeroki wybór</h3>
                  <p className="text-sm text-primary/60 leading-relaxed">Baza produktów stale rośnie, by dać Ci pełny obraz rynku.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-12 text-center tracking-tight">Wybierz kategorię</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map(cat => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white py-20 border-t border-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-16 text-center tracking-tight">Jak to działa?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent dashed-line" />

              {[
                { num: '1', title: 'Odpowiedz na kilka pytań', desc: 'Krótki quiz o Twoich włosach i preferencjach — zajmie mniej niż minutę.' },
                { num: '2', title: 'Otrzymaj TOP produkty', desc: 'Algorytm dopasuje najlepsze kosmetyki do Twojego profilu włosów.' },
                { num: '3', title: 'Porównaj ceny i kupuj', desc: 'Sprawdź ceny w różnych sklepach i kupuj tam, gdzie najtaniej.' },
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl font-bold text-primary/80">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
                  <p className="text-sm text-primary/60 leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link to="/jak-dziala" className="inline-flex items-center text-secondary hover:text-primary font-medium transition-colors border-b border-secondary/20 hover:border-primary pb-0.5">
                Dowiedz się więcej o algorytmie &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
