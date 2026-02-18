import { useStore } from '../store/useStore';
import { HAIR_GOAL_LABELS, HAIR_TYPE_LABELS, SCALP_TYPE_LABELS, FREE_FROM_LABELS, CATEGORY_LABELS } from '../lib/constants';
import type { HairGoal, HairType, ScalpType, FreeFrom } from '../types';

interface FilterPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  availableBrands: string[];
}

export default function FilterPanel({ availableBrands }: FilterPanelProps) {
  const filters = useStore((s) => s.filters);
  const updateFilter = useStore((s) => s.updateFilter);
  const clearFilters = useStore((s) => s.clearFilters);

  const toggleArrayFilter = <T extends string>(key: 'categories' | 'hair_goals' | 'hair_types' | 'scalp_types' | 'avoid_ingredients' | 'brands', value: T) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated as never);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filtry</h3>
        <button onClick={clearFilters} className="text-sm text-teal-600 hover:text-teal-700">Wyczyść</button>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Kategoria</h4>
        <div className="space-y-1.5">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(key)}
                onChange={() => toggleArrayFilter('categories', key)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Problem / Cel</h4>
        <div className="space-y-1.5">
          {(Object.entries(HAIR_GOAL_LABELS) as [HairGoal, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hair_goals.includes(key)}
                onChange={() => toggleArrayFilter('hair_goals', key)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Typ włosów</h4>
        <div className="space-y-1.5">
          {(Object.entries(HAIR_TYPE_LABELS) as [HairType, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hair_types.includes(key)}
                onChange={() => toggleArrayFilter('hair_types', key)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Skóra głowy</h4>
        <div className="space-y-1.5">
          {(Object.entries(SCALP_TYPE_LABELS) as [ScalpType, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.scalp_types.includes(key)}
                onChange={() => toggleArrayFilter('scalp_types', key)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Bez składników</h4>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(FREE_FROM_LABELS) as [FreeFrom, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleArrayFilter('avoid_ingredients', key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filters.avoid_ingredients.includes(key)
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.vegan_only}
            onChange={() => updateFilter('vegan_only', !filters.vegan_only)}
            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-700">Tylko wegańskie</span>
        </label>
      </div>

      {availableBrands.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Marka</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {availableBrands.sort().map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleArrayFilter('brands', brand)}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 truncate">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Cena (PLN)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.price_min}
            onChange={(e) => updateFilter('price_min', Number(e.target.value))}
            className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg"
            min={0}
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            value={filters.price_max}
            onChange={(e) => updateFilter('price_max', Number(e.target.value))}
            className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg"
            min={0}
          />
        </div>
      </div>
    </div>
  );
}
