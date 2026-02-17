import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import type { Product } from '../types';
import { useStore } from '../store/useStore';

import logo from '../assets/logo-wlosowa.png';

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
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-32 h-16 flex items-center transition-transform group-hover:scale-105">
              <img src={logo} alt="Włosowa - Dobieramy pielęgnację" className="w-full h-full object-contain" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/porownaj" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wider">Porównywarka</Link>
            <Link to="/quiz" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wider">Quiz</Link>
            <Link to="/jak-dziala" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wider">Jak to działa</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Comparison Button - Desktop */}
            {comparisonCount > 0 && (
              <Link
                to="/porownanie"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors relative"
                title="Porównaj produkty"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-bold">{comparisonCount}</span>
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
                  className="w-48 lg:w-64 px-4 py-2 text-sm bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                      className={`w-full text-left px-3 py-2 text-sm flex flex-col gap-0.5 transition-colors ${i === selectedIndex ? 'bg-primary/5' : 'hover:bg-gray-50'
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
              className="md:hidden p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
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
          <div className="md:hidden pb-6 border-t border-gray-50 px-4">
            <form onSubmit={handleSearch} className="pt-4 pb-4">
              <input
                type="text"
                placeholder="Szukaj produktu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </form>
            {comparisonCount > 0 && (
              <Link to="/porownanie" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-4 py-2 text-sm text-primary hover:bg-primary/5 font-bold rounded-lg mb-2">
                <span>Porównanie ({comparisonCount})</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Link>
            )}
            <Link to="/porownaj" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-gray-600 hover:text-primary border-b border-gray-50">Porównywarka</Link>
            <Link to="/quiz" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-gray-600 hover:text-primary border-b border-gray-50">Quiz</Link>
            <Link to="/jak-dziala" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-gray-600 hover:text-primary">Jak to działa</Link>
          </div>
        )}
      </div>
    </header>
  );
}
