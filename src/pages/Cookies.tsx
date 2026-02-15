import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function Cookies() {
  return (
    <>
      <SEO title="Polityka cookies" description="Informacje o plikach cookies w serwisie HairCare Comparator." />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Polityka cookies</h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Czym są cookies?</h2>
            <p>Pliki cookies to małe pliki tekstowe przechowywane na Twoim urządzeniu przez przeglądarkę internetową. Służą do zapamiętywania preferencji i poprawy doświadczenia użytkownika.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Jak używamy cookies?</h2>
            <p>HairCare Comparator używa localStorage (technologia podobna do cookies) do przechowywania:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Twoich preferencji włosowych (wyniki quizu)</li>
              <li>Ustawień filtrów</li>
              <li>Zdarzeń analitycznych (tylko w trybie deweloperskim)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies zewnętrzne</h2>
            <p>Linki afiliacyjne na naszej stronie mogą prowadzić do zewnętrznych sklepów, które ustawiają własne pliki cookies w celu śledzenia zakupów. Nie mamy kontroli nad tymi plikami cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Jak usunąć cookies?</h2>
            <p>Możesz usunąć pliki cookies i dane localStorage w ustawieniach swojej przeglądarki. Spowoduje to usunięcie Twoich zapisanych preferencji w serwisie.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
