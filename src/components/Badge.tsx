interface BadgeProps {
  label: string;
  variant?: 'default' | 'green' | 'amber' | 'red' | 'teal' | 'purple';
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  green: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  teal: 'bg-teal-100 text-teal-800',
  purple: 'bg-purple-100 text-purple-800',
};

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
