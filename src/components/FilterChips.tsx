import { useStore } from '../store/useStore';
import { HAIR_GOAL_LABELS, HAIR_TYPE_LABELS, SCALP_TYPE_LABELS, FREE_FROM_LABELS, CATEGORY_LABELS } from '../lib/constants';

export default function FilterChips() {
  const filters = useStore((s) => s.filters);
  const updateFilter = useStore((s) => s.updateFilter);
  const resetAllFilters = useStore((s) => s.resetAllFilters);

  const chips: { label: string; onRemove: () => void }[] = [];

  filters.categories.forEach(c => {
    chips.push({
      label: CATEGORY_LABELS[c] || c,
      onRemove: () => updateFilter('categories', filters.categories.filter(v => v !== c))
    });
  });

  filters.hair_goals.forEach(g => {
    chips.push({
      label: HAIR_GOAL_LABELS[g] || g,
      onRemove: () => updateFilter('hair_goals', filters.hair_goals.filter(v => v !== g))
    });
  });

  filters.hair_types.forEach(t => {
    chips.push({
      label: HAIR_TYPE_LABELS[t] || t,
      onRemove: () => updateFilter('hair_types', filters.hair_types.filter(v => v !== t))
    });
  });

  filters.scalp_types.forEach(s => {
    chips.push({
      label: SCALP_TYPE_LABELS[s] || s,
      onRemove: () => updateFilter('scalp_types', filters.scalp_types.filter(v => v !== s))
    });
  });

  filters.avoid_ingredients.forEach(i => {
    chips.push({
      label: FREE_FROM_LABELS[i] || i,
      onRemove: () => updateFilter('avoid_ingredients', filters.avoid_ingredients.filter(v => v !== i))
    });
  });

  if (filters.vegan_only) {
    chips.push({ label: 'Wegańskie', onRemove: () => updateFilter('vegan_only', false) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
          {chip.label}
          <button onClick={chip.onRemove} className="ml-0.5 hover:text-teal-900">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <button onClick={resetAllFilters} className="text-xs text-gray-500 hover:text-teal-600 ml-1">
        Wyczyść wszystko
      </button>
    </div>
  );
}
