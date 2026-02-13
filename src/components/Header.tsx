import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/porownaj?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HC</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg hidden sm:block">HairCare</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/porownaj" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Porównywarka</Link>
            <Link to="/quiz" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Quiz</Link>
            <Link to="/jak-dziala" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Jak to działa</Link>
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <input
                type="text"
                placeholder="Szukaj produktu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </form>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-teal-600"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="px-2 pt-3 pb-2">
              <input
                type="text"
                placeholder="Szukaj produktu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </form>
            <Link to="/porownaj" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Porównywarka</Link>
            <Link to="/quiz" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Quiz</Link>
            <Link to="/jak-dziala" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Jak to działa</Link>
          </div>
        )}
      </div>
    </header>
  );
}
