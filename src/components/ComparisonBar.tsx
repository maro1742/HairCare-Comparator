import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function ComparisonBar() {
  const compareList = useStore((s) => s.compareList);
  const removeFromCompare = useStore((s) => s.removeFromCompare);
  const clearCompare = useStore((s) => s.clearCompare);
  const location = useLocation();

  if (compareList.length === 0 || location.pathname === '/porownanie') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 shrink-0"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                  {product.name}
                </span>
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {compareList.length < 4 && (
              <span className="text-xs text-gray-400 shrink-0">
                +{4 - compareList.length} {compareList.length === 3 ? 'produkt' : 'produkty'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors px-2 py-1"
            >
              Wyczyść
            </button>
            <Link
              to="/porownanie"
              className="inline-flex items-center px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-all shadow-md"
            >
              Porównaj ({compareList.length})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
