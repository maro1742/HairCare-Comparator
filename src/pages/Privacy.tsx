import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO title="Polityka prywatnosci" description="Polityka prywatnosci serwisu HairCare Comparator." />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Polityka prywatnosci</h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Administrator danych</h2>
            <p>Administratorem danych osobowych jest HairCare Comparator. Serwis nie zbiera danych osobowych uzytkownikow w sposob bezposredni.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Zakres zbieranych danych</h2>
            <p>Serwis przechowuje jedynie dane dotyczace preferencji wlosowych (wyniki quizu) w pamieci lokalnej przegladarki (localStorage). Dane te nie sa wysylane na serwer.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Pliki cookies</h2>
            <p>Serwis moze korzystac z plikow cookies w celach analitycznych. Wiecej informacji w naszej <a href="/cookies" className="text-teal-600 hover:text-teal-700">polityce cookies</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Linki afiliacyjne</h2>
            <p>Serwis zawiera linki afiliacyjne do zewnetrznych sklepow internetowych. Klikniecie w taki link moze skutkowac ustawieniem pliku cookie przez dany sklep. Nie mamy wplywu na polityki prywatnosci zewnetrznych serwisow.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Prawa uzytkownika</h2>
            <p>Kazdy uzytkownik ma prawo do wyczyszczenia danych przechowywanych lokalnie poprzez wyczyszczenie pamieci przegladarki. Poniewaz nie zbieramy danych na serwerze, nie ma koniecznosci skladania wnioskow o usuniecie danych.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Zmiany w polityce</h2>
            <p>Zastrzegamy sobie prawo do zmiany niniejszej polityki prywatnosci. Aktualna wersja jest zawsze dostepna na tej stronie.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
