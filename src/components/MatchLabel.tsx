interface MatchLabelProps {
  score: number;
}

export default function MatchLabel({ score }: MatchLabelProps) {
  let label: string;
  let colorClass: string;

  if (score >= 8) {
    label = 'Dopasowanie: wysokie';
    colorClass = 'bg-primary/10 text-primary border-primary/20';
  } else if (score >= 4) {
    label = 'Dopasowanie: średnie';
    colorClass = 'bg-secondary/10 text-secondary border-secondary/20';
  } else {
    label = 'Dopasowanie: niskie';
    colorClass = 'bg-accent/10 text-accent border-accent/20';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      {label}
    </span>
  );
}
