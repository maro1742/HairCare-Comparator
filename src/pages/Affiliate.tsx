import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function Affiliate() {
  return (
    <>
      <SEO title="Wspolpraca affiliate" description="Informacje o programie afiliacyjnym HairCare Comparator." />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wspolpraca affiliate</h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Jak zarabiamy?</h2>
            <p>HairCare Comparator jest darmowym narzedziem. Utrzymujemy sie dzieki programom afiliacyjnym — kiedy klikniesz w link do sklepu i dokonasz zakupu, otrzymujemy mala prowizje. Nie wplywa to na cene produktu dla Ciebie.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Transparentnosc</h2>
            <p>Wszystkie linki afiliacyjne sa wyraznie oznaczone. Nasze rekomendacje sa oparte wylacznie na algorytmie dopasowania składów i cech produktow, a nie na wysokosci prowizji od poszczegolnych sklepow.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Wspolpraca ze sklepami</h2>
            <p>Wspolpracujemy z wybranymi sklepami internetowymi oferujacymi profesjonalne kosmetyki do wlosow. Jezeli jestes zainteresowany wspolpraca, skontaktuj sie z nami.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Wspolpraca z markami</h2>
            <p>Jezeli reprezentujesz marke kosmetykow do wlosow i chcialbys dodac swoje produkty do naszej porownywarki, chetnie porozmawiamy o wspolpracy. Kazdy produkt przechodzi taka sama analizę składu INCI.</p>
          </section>
        </div>

        <div className="mt-12 bg-teal-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Masz pytania?</h3>
          <p className="text-sm text-gray-600 mb-4">Skontaktuj sie z nami, jezeli masz pytania dotyczace wspolpracy lub programu afiliacyjnego.</p>
          <Link to="/porownaj" className="inline-flex items-center px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors">
            Przejdź do porównywarki
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
