import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useStore } from '../store/useStore';
import { formatPrice } from '../lib/format';
import {
  CATEGORY_LABELS,
  HAIR_GOAL_LABELS,
  HAIR_TYPE_LABELS,
  SCALP_TYPE_LABELS,
  FREE_FROM_LABELS,
  CLAIM_LABELS
} from '../lib/constants';
import type { Product } from '../types';

function IngredientFlag({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function CompareCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-3 py-3 text-sm text-gray-700 text-center align-top ${className}`}>
      {children}
    </td>
  );
}

function BadgeList({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-gray-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {items.map((item, i) => (
        <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full text-[11px] font-medium">
          {item}
        </span>
      ))}
    </div>
  );
}

function ProductColumn({ product }: { product: Product }) {
  const removeFromCompare = useStore((s) => s.removeFromCompare);
  const bestOffer = product.offers.reduce((a, b) => (a.price_pln < b.price_pln ? a : b));

  return (
    <th className="px-3 py-4 text-center min-w-[180px] max-w-[220px] align-top">
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => removeFromCompare(product.id)}
          className="self-end text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Usuń z porównania"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <Link to={`/produkt/${product.slug}`}>
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 mx-auto">
            <img
              src={product.images[0]}
              alt={`${product.brand} ${product.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{product.brand}</p>
          <Link to={`/produkt/${product.slug}`}>
            <p className="font-semibold text-gray-900 text-sm leading-tight hover:text-teal-600 transition-colors line-clamp-2">
              {product.name}
            </p>
          </Link>
        </div>
        <span className="text-lg font-bold text-gray-900">{formatPrice(bestOffer.price_pln)}</span>
        <a
          href={bestOffer.url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex items-center px-4 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-all"
        >
          Do sklepu
        </a>
      </div>
    </th>
  );
}

export default function Comparison() {
  const compareList = useStore((s) => s.compareList);
  const clearCompare = useStore((s) => s.clearCompare);

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    {
      label: 'Kategoria',
      render: (p) => (
        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          {CATEGORY_LABELS[p.category] || p.category}
        </span>
      )
    },
    {
      label: 'Cele pielęgnacji',
      render: (p) => <BadgeList items={p.hair_goals.map((g) => HAIR_GOAL_LABELS[g]).filter(Boolean)} />
    },
    {
      label: 'Typ włosów',
      render: (p) => <BadgeList items={p.hair_type_fit.map((t) => HAIR_TYPE_LABELS[t]).filter(Boolean)} />
    },
    {
      label: 'Typ skóry głowy',
      render: (p) => <BadgeList items={p.scalp_fit.map((s) => SCALP_TYPE_LABELS[s]).filter(Boolean)} />
    },
    {
      label: 'Bez…',
      render: (p) => <BadgeList items={p.free_from.map((f) => FREE_FROM_LABELS[f]).filter(Boolean)} />
    },
    {
      label: 'Certyfikaty',
      render: (p) => <BadgeList items={p.claims.map((c) => CLAIM_LABELS[c]).filter(Boolean)} />
    },
    {
      label: 'Silikony',
      render: (p) => <IngredientFlag value={p.ingredient_flags.has_silicones} />
    },
    {
      label: 'Sulfaty (SLS/SLES)',
      render: (p) => <IngredientFlag value={p.ingredient_flags.has_sulfates} />
    },
    {
      label: 'Parabeny',
      render: (p) => <IngredientFlag value={p.ingredient_flags.has_parabens} />
    },
    {
      label: 'Wysuszające alkohole',
      render: (p) => <IngredientFlag value={p.ingredient_flags.has_drying_alcohols} />
    },
    {
      label: 'Zapach syntetyczny',
      render: (p) => <IngredientFlag value={p.ingredient_flags.has_fragrance} />
    },
    {
      label: 'Skład INCI',
      render: (p) => (
        <p className="text-[11px] text-gray-500 leading-relaxed max-h-28 overflow-y-auto text-left">
          {p.inci}
        </p>
      )
    }
  ];

  return (
    <>
      <SEO
        title="Porównanie kosmetyków"
        description="Porównaj wybrane kosmetyki do włosów obok siebie — skład, właściwości, cena."
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Porównanie kosmetyków</h1>
            <p className="text-sm text-gray-500 mt-1">
              {compareList.length === 0
                ? 'Nie wybrano jeszcze żadnych produktów'
                : `${compareList.length} z 4 produktów`}
            </p>
          </div>
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Wyczyść wszystko
            </button>
          )}
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Brak produktów do porównania</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Przejdź do porównywarki i kliknij „Porównaj" na wybranych produktach, aby dodać je tutaj.
            </p>
            <Link
              to="/porownaj"
              className="inline-flex items-center px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-all"
            >
              Przejdź do porównywarki
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[140px] sticky left-0 bg-white z-10">
                      Produkt
                    </th>
                    {compareList.map((product) => (
                      <ProductColumn key={product.id} product={product} />
                    ))}
                    {compareList.length < 4 && (
                      <th className="px-3 py-4 text-center min-w-[180px] align-middle">
                        <Link
                          to="/porownaj"
                          className="inline-flex flex-col items-center gap-2 text-gray-400 hover:text-teal-600 transition-colors group"
                        >
                          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-teal-400 flex items-center justify-center transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium">Dodaj produkt</span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-inherit z-10">
                        {row.label}
                      </td>
                      {compareList.map((product) => (
                        <CompareCell key={product.id}>{row.render(product)}</CompareCell>
                      ))}
                      {compareList.length < 4 && <td />}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
