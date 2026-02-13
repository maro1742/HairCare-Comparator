interface MatchLabelProps {
  score: number;
}

export default function MatchLabel({ score }: MatchLabelProps) {
  let label: string;
  let colorClass: string;

  if (score >= 8) {
    label = 'Dopasowanie: wysokie';
    colorClass = 'bg-emerald-100 text-emerald-800';
  } else if (score >= 4) {
    label = 'Dopasowanie: srednie';
    colorClass = 'bg-amber-100 text-amber-800';
  } else {
    label = 'Dopasowanie: niskie';
    colorClass = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}
