import { useStore } from '../store/useStore';
import { HAIR_GOAL_LABELS, HAIR_TYPE_LABELS, SCALP_TYPE_LABELS, FREE_FROM_LABELS, CATEGORY_LABELS } from '../lib/constants';
import type { HairGoal, HairType, ScalpType, FreeFrom } from '../types';
import HairPreferencesSlider from './HairPreferencesSlider';

interface FilterPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  availableBrands: string[];
  hideHeader?: boolean;
}

export default function FilterPanel({ availableBrands, hideHeader }: FilterPanelProps) {
  const filters = useStore((s) => s.filters);
  const updateFilter = useStore((s) => s.updateFilter);
  const resetAllFilters = useStore((s) => s.resetAllFilters);

  const toggleArrayFilter = <T extends string>(key: 'categories' | 'hair_goals' | 'hair_types' | 'scalp_types' | 'avoid_ingredients' | 'brands' | 'peh_balance', value: T) => {
    const current = (filters[key] || []) as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated as never);
  };

  const showPehFilter = 
    filters.categories.length === 0 || 
    filters.categories.includes('conditioner') || 
    filters.categories.includes('mask') || 
    filters.categories.includes('serum');

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filtry</h3>
          <button onClick={resetAllFilters} className="text-sm text-teal-600 hover:text-teal-700">Wyczyść</button>
        </div>
      )}

      <div className="border-b border-gray-100 pb-6">
        <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Twoje włosy</h4>
        <HairPreferencesSlider
          hairLength={filters.hair_length || 'medium'}
          porosity={filters.hair_porosity || 'medium'}
          onChange={(length, porosity) => {
            updateFilter('hair_length', length);
            updateFilter('hair_porosity', porosity);
          }}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Cena (PLN)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.price_min}
            onChange={(e) => updateFilter('price_min', e.target.value === '' ? '' : Number(e.target.value))}
            className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg"
            min={0}
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            value={filters.price_max}
            onChange={(e) => updateFilter('price_max', e.target.value === '' ? '' : Number(e.target.value))}
            className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg"
            min={0}
          />
        </div>
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

      {showPehFilter && (
        <div className="bg-gray-50/50 -mx-4 px-4 py-4 border-y border-gray-100/60 lg:rounded-xl lg:px-4 lg:mx-0 lg:border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-900">Równowaga PEH</h4>
            <div className="group relative">
              <span className="text-gray-400 hover:text-gray-600 cursor-help">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div className="absolute right-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-[11px] p-3 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                Opcja szuka w bazie produktów spełniających wybrane kryteria (np. P - Proteiny, E - Emolienty, H - Humektanty). Zaznaczenie wielu zadziała logicznie (np. P+E).
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'P', label: 'Proteiny', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100', active: 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200' },
              { id: 'E', label: 'Emolienty', color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100', active: 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-200' },
              { id: 'H', label: 'Humektanty', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100', active: 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200' }
            ].map((btn) => {
              const isActive = (filters.peh_balance || []).includes(btn.id);
              return (
                <button
                  key={btn.id}
                  onClick={() => toggleArrayFilter('peh_balance', btn.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all duration-200 ${isActive ? btn.active : btn.color}`}
                >
                  {btn.id}
                </button>
              );
            })}
          </div>
        </div>
      )}

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

    </div>
  );
}
