import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function HowItWorks() {
  return (
    <>
      <SEO title="Jak to działa" description="Dowiedz się, jak działają nasze porównania i rekomendacje kosmetyków do włosów." />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Jak działa Włosowa.pl?</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Zbieramy dane o produktach</h2>
            <p className="text-gray-600 leading-relaxed">
              Analizujemy składy INCI produktów do pielęgnacji włosów dostępnych na polskim rynku.
              Każdy produkt jest kategoryzowany według typu włosów, problemów i składników aktywnych.
              Dane o cenach są aktualizowane regularnie z wielu sklepów internetowych.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Automatyczna analiza składu</h2>
            <p className="text-gray-600 leading-relaxed">
              Nasz algorytm automatycznie wykrywa kluczowe składniki w formule: silikony, sulfaty, parabeny,
              wysuszające alkohole i substancje zapachowe. Dzięki temu możesz łatwo filtrować produkty
              według składników, których chcesz unikać.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Dopasowanie do Twojego profilu</h2>
            <p className="text-gray-600 leading-relaxed">
              Kiedy wypełnisz quiz lub ustawisz filtry, nasz algorytm oblicza wskaźnik dopasowania
              każdego produktu. Bierze pod uwagę Twój typ włosów, problemy, które chcesz rozwiązać,
              i składniki, których chcesz unikać. Wynik dopasowania jest wyświetlany jako
              "wysokie", "średnie" lub "niskie".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Porównanie cen</h2>
            <p className="text-gray-600 leading-relaxed">
              Dla każdego produktu pokazujemy ceny z kilku sklepów internetowych, wraz z datą
              ostatniej aktualizacji. Możesz porównać oferty i wybrać najkorzystniejszą.
              Linki do sklepów są afiliacyjne — to oznacza, że otrzymujemy małą prowizję
              od zakupu, ale nie wpływa to na cenę dla Ciebie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Transparentność</h2>
            <p className="text-gray-600 leading-relaxed">
              Zawsze oznaczamy linki afiliacyjne. Nasze rekomendacje są oparte wyłącznie na
              algorytmie dopasowania, a nie na prowizjach. Nie faworyzujemy żadnego sklepu
              ani marki.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <Link to="/quiz" className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors">
            Zrób quiz
          </Link>
          <Link to="/porownaj" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Przejdź do porównywarki
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
