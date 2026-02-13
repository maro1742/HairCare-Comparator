import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function HowItWorks() {
  return (
    <>
      <SEO title="Jak to dziala" description="Dowiedz sie, jak dzialaja nasze porownania i rekomendacje kosmetykow do wlosow." />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Jak dziala HairCare Comparator?</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Zbieramy dane o produktach</h2>
            <p className="text-gray-600 leading-relaxed">
              Analizujemy sklady INCI produktow do pielegnacji wlosow dostepnych na polskim rynku.
              Kazdy produkt jest kategoryzowany wedlug typu wlosow, problemow i skladnikow aktywnych.
              Dane o cenach sa aktualizowane regularnie z wielu sklepow internetowych.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Automatyczna analiza skladu</h2>
            <p className="text-gray-600 leading-relaxed">
              Nasz algorytm automatycznie wykrywa kluczowe skladniki w formule: silikony, sulfaty, parabeny,
              wysuszajace alkohole i substancje zapachowe. Dzieki temu mozesz latwo filtrowac produkty
              wedlug skladnikow, ktorych chcesz unikac.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Dopasowanie do Twojego profilu</h2>
            <p className="text-gray-600 leading-relaxed">
              Kiedy wypelnisz quiz lub ustawisz filtry, nasz algorytm oblicza wskaznik dopasowania
              kazdego produktu. Bierze pod uwage Twoj typ wlosow, problemy, ktore chcesz rozwiazac,
              i skladniki, ktorych chcesz unikac. Wynik dopasowania jest wyswietlany jako
              "wysokie", "srednie" lub "niskie".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Porownanie cen</h2>
            <p className="text-gray-600 leading-relaxed">
              Dla kazdego produktu pokazujemy ceny z kilku sklepow internetowych, wraz z data
              ostatniej aktualizacji. Mozesz porownac oferty i wybrac najkorzystniejsza.
              Linki do sklepow sa afiliacyjne — to oznacza, ze otrzymujemy mala prowizje
              od zakupu, ale nie wplywa to na cene dla Ciebie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Transparentnosc</h2>
            <p className="text-gray-600 leading-relaxed">
              Zawsze oznaczamy linki afiliacyjne. Nasze rekomendacje sa oparte wylacznie na
              algorytmie dopasowania, a nie na prowizjach. Nie faworyzujemy zadnego sklepu
              ani marki.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <Link to="/quiz" className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors">
            Zrob quiz
          </Link>
          <Link to="/porownaj" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Przejdz do porownywarki
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
