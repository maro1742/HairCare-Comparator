import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import type { Product } from '../types';
import { useStore } from '../store/useStore';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const comparisonCount = useStore((s) => s.comparisonProductIds.length);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const all = await getAllProducts();
      setProducts(all);
    }
    load();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/porownaj?q=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const onInputChange = (val: string) => {
    setSearchQuery(val);
    if (val.length >= 2) {
      const filtered = products
        .filter(p =>
          p.name.toLowerCase().includes(val.toLowerCase()) ||
          p.brand.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        navigate(`/porownaj?q=${encodeURIComponent(selected.name)}`);
        setSearchQuery('');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="HairMatch"
              className="h-[4.5rem] w-auto drop-shadow-md"
              style={{ filter: 'contrast(1.05) brightness(0.98)' }}
            />
            <span className="font-bold text-gray-900 text-xl hidden sm:block">HairMatch</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/porownaj" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Porównywarka</Link>
            <Link to="/quiz" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Quiz</Link>
            <Link to="/jak-dziala" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Jak to działa</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Comparison Button - Desktop */}
            {comparisonCount > 0 && (
              <Link
                to="/porownanie"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors relative"
                title="Porównaj produkty"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">{comparisonCount}</span>
              </Link>
            )}

            <div className="hidden sm:block relative" ref={containerRef}>
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Szukaj produktu..."
                  value={searchQuery}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  className="w-48 lg:w-64 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </form>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden z-[100]">
                  {suggestions.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        navigate(`/porownaj?q=${encodeURIComponent(p.name)}`);
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full text-left px-3 py-2 text-sm flex flex-col gap-0.5 transition-colors ${i === selectedIndex ? 'bg-teal-50' : 'hover:bg-gray-50'
                        }`}
                    >
                      <span className="font-medium text-gray-900 truncate">{p.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500">{p.brand}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            {comparisonCount > 0 && (
              <Link to="/porownanie" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 font-medium">
                <span>Porównanie ({comparisonCount})</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Link>
            )}
            <Link to="/porownaj" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Porównywarka</Link>
            <Link to="/quiz" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Quiz</Link>
            <Link to="/jak-dziala" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Jak to działa</Link>
          </div>
        )}
      </div>
    </header>
  );
}
