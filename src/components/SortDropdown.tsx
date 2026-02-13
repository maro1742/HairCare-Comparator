import { useStore } from '../store/useStore';
import { SORT_OPTIONS } from '../lib/constants';

export default function SortDropdown() {
  const sortBy = useStore((s) => s.filters.sort_by);
  const updateFilter = useStore((s) => s.updateFilter);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-500 whitespace-nowrap">Sortuj:</label>
      <select
        value={sortBy}
        onChange={(e) => updateFilter('sort_by', e.target.value as 'match' | 'price' | 'popularity')}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
