import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO title="Polityka prywatności" description="Polityka prywatności serwisu HairCare Comparator." />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Polityka prywatności</h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Administrator danych</h2>
            <p>Administratorem danych osobowych jest HairCare Comparator. Serwis nie zbiera danych osobowych użytkowników w sposób bezpośredni.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Zakres zbieranych danych</h2>
            <p>Serwis przechowuje jedynie dane dotyczące preferencji włosowych (wyniki quizu) w pamięci lokalnej przeglądarki (localStorage). Dane te nie są wysyłane na serwer.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Pliki cookies</h2>
            <p>Serwis może korzystać z plików cookies w celach analitycznych. Więcej informacji w naszej <a href="/cookies" className="text-teal-600 hover:text-teal-700">polityce cookies</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Linki afiliacyjne</h2>
            <p>Serwis zawiera linki afiliacyjne do zewnętrznych sklepów internetowych. Kliknięcie w taki link może skutkować ustawieniem pliku cookie przez dany sklep. Nie mamy wpływu na polityki prywatności zewnętrznych serwisów.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Prawa użytkownika</h2>
            <p>Każdy użytkownik ma prawo do wyczyszczenia danych przechowywanych lokalnie poprzez wyczyszczenie pamięci przeglądarki. Ponieważ nie zbieramy danych na serwerze, nie ma konieczności składania wniosków o usunięcie danych.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Zmiany w polityce</h2>
            <p>Zastrzegamy sobie prawo do zmiany niniejszej polityki prywatności. Aktualna wersja jest zawsze dostępna na tej stronie.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
