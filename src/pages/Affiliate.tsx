import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function Affiliate() {
  return (
    <>
      <SEO title="Współpraca affiliate" description="Informacje o programie afiliacyjnym HairCare Comparator." />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Współpraca affiliate</h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Jak zarabiamy?</h2>
            <p>HairCare Comparator jest darmowym narzędziem. Utrzymujemy się dzięki programom afiliacyjnym — kiedy klikniesz w link do sklepu i dokonasz zakupu, otrzymujemy małą prowizję. Nie wpływa to na cenę produktu dla Ciebie.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Transparentność</h2>
            <p>Wszystkie linki afiliacyjne są wyraźnie oznaczone. Nasze rekomendacje są oparte wyłącznie na algorytmie dopasowania składów i cech produktów, a nie na wysokości prowizji od poszczególnych sklepów.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Współpraca ze sklepami</h2>
            <p>Współpracujemy z wybranymi sklepami internetowymi oferującymi profesjonalne kosmetyki do włosów. Jeżeli jesteś zainteresowany współpracą, skontaktuj się z nami.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Współpraca z markami</h2>
            <p>Jeżeli reprezentujesz markę kosmetyków do włosów i chciałbyś dodać swoje produkty do naszej porównywarki, chętnie porozmawiamy o współpracy. Każdy produkt przechodzi taką samą analizę składu INCI.</p>
          </section>
        </div>

        <div className="mt-12 bg-teal-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Masz pytania?</h3>
          <p className="text-sm text-gray-600 mb-4">Skontaktuj się z nami, jeżeli masz pytania dotyczące współpracy lub programu afiliacyjnego.</p>
          <Link to="/porownaj" className="inline-flex items-center px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors">
            Przejdź do porównywarki
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
