import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import SEO from '../components/SEO';
import { CATEGORIES } from '../data/categories';

export default function Landing() {
  return (
    <>
      <SEO title="Profesjonalne kosmetyki do włosów" description="Porównywarka kosmetyków do włosów — sprawdź skład, ceny i dopasowanie do Twoich potrzeb." />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-teal-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Profesjonalne kosmetyki do włosów - <span className="text-teal-600">efekt zabiegu salonowego w domu</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Wybierz produkt w 30 sekund. Filtry, skład i realne ceny w jednym miejscu.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors shadow-md"
                >
                  Zrob quiz (30 sek)
                </Link>
                <Link
                  to="/porownaj"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-teal-500 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors"
                >
                  Przejdź do porównywarki
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="border-y border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Skład INCI i flagi</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Np. bez silikonow, bez sulfatow — wszystko widoczne</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Ceny z kilku sklepów</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Wybierz najkorzystniejszą ofertę</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Szeroki wybór ofert</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Zaufaj sprawdzonym dostawcom</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Wybierz kategorie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Jak to działa?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: '1', title: 'Odpowiedz na kilka pytań', desc: 'Krótki quiz o Twoich włosach i preferencjach — zajmie mniej niż minutę.' },
                { num: '2', title: 'Otrzymaj TOP produkty', desc: 'Algorytm dopasuje najlepsze kosmetyki do Twojego profilu włosów.' },
                { num: '3', title: 'Porównaj ceny i kupuj', desc: 'Sprawdź ceny w różnych sklepach i kupuj tam, gdzie najtaniej.' },
              ].map(step => (
                <div key={step.num} className="text-center">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/jak-dziala" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Dowiedz się więcej &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
