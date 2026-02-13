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
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Czym sa cookies?</h2>
            <p>Pliki cookies to male pliki tekstowe przechowywane na Twoim urzadzeniu przez przegladarke internetowa. Sluza do zapamietywania preferencji i poprawy doswiadczenia uzytkownika.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Jak uzywamy cookies?</h2>
            <p>HairCare Comparator uzywa localStorage (technologia podobna do cookies) do przechowywania:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Twoich preferencji wlosowych (wyniki quizu)</li>
              <li>Ustawien filtrow</li>
              <li>Zdarzen analitycznych (tylko w trybie deweloperskim)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies zewnetrzne</h2>
            <p>Linki afiliacyjne na naszej stronie moga prowadzic do zewnetrznych sklepow, ktore ustawiaja wlasne pliki cookies w celu sledzenia zakupow. Nie mamy kontroli nad tymi plikami cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Jak usunac cookies?</h2>
            <p>Mozesz usunac pliki cookies i dane localStorage w ustawieniach swojej przegladarki. Spowoduje to usuniecie Twoich zapisanych preferencji w serwisie.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
