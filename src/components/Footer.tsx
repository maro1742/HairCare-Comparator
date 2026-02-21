import { Link } from 'react-router-dom';
import logo from '../assets/logo-wlosowa.png';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-32 h-16 flex items-center transition-transform group-hover:scale-105">
                <img
                  src={logo}
                  alt="Włosowa - Dobieramy pielęgnację"
                  className="w-full h-full object-contain invert"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
            </Link>
            <p className="text-sm text-gray-400">Profesjonalna porównywarka kosmetyków do włosów. Porównuj składy, ceny i opinie w jednym miejscu.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Nawigacja</h3>
            <ul className="space-y-2">
              <li><Link to="/ranking" className="text-sm hover:text-teal-400 border-b border-transparent hover:border-teal-400 transition-all font-bold text-white">Rankingi 2026</Link></li>
              <li><Link to="/porownaj" className="text-sm hover:text-teal-400 transition-colors">Porównywarka</Link></li>
              <li><Link to="/quiz" className="text-sm hover:text-teal-400 transition-colors">Quiz</Link></li>
              <li><Link to="/jak-dziala" className="text-sm hover:text-teal-400 transition-colors">Jak to działa</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Kategorie</h3>
            <ul className="space-y-2">
              <li><Link to="/kategoria/suche-zniszczone" className="text-sm hover:text-teal-400 transition-colors">Suche & Zniszczone</Link></li>
              <li><Link to="/kategoria/wypadanie-cienkie" className="text-sm hover:text-teal-400 transition-colors">Wypadanie & Cienkie</Link></li>
              <li><Link to="/kategoria/lupiez-przetluszczanie" className="text-sm hover:text-teal-400 transition-colors">Lupież & Przetłuszczanie</Link></li>
              <li><Link to="/kategoria/krecone" className="text-sm hover:text-teal-400 transition-colors">Krecone</Link></li>
              <li><Link to="/kategoria/farbowane-rozjasniane" className="text-sm hover:text-teal-400 transition-colors">Farbowane & Rozjasniane</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Informacje</h3>
            <ul className="space-y-2">
              <li><Link to="/polityka-prywatnosci" className="text-sm hover:text-teal-400 transition-colors">Polityka prywatnosci</Link></li>
              <li><Link to="/cookies" className="text-sm hover:text-teal-400 transition-colors">Cookies</Link></li>
              <li><Link to="/wspolpraca-affiliate" className="text-sm hover:text-teal-400 transition-colors">Wspolpraca affiliate</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} HairCare Comparator. Linki moga byc afiliacyjne — nie wplywa to na cene dla Ciebie.</p>
        </div>
      </div>
    </footer>
  );
}
