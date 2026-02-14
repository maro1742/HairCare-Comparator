import { Link } from 'react-router-dom';
import type { Category } from '../data/categories';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/kategoria/${category.slug}`}
      className={`block ${category.color} bg-white rounded-2xl border border-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group h-full`}
    >
      {category.image ? (
        <div className="flex h-full">
          {/* Left Side: Image (Full Height) */}
          <div className="w-1/2 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            {/* Overlay for better contrast/blend if needed, currently kept minimal */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* Right Side: Content (Aligned Right) */}
          <div className="w-1/2 p-6 flex flex-col justify-center text-right relative z-10">
            <h3 className="font-bold text-primary text-xl mb-3 tracking-tight leading-tight group-hover:text-accent transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-primary/70 leading-relaxed font-medium">
              {category.description}
            </p>
          </div>
        </div>
      ) : (
        /* Default Layout (Icon + Clean Design) */
        <div className="p-6 h-full flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex-1">
            <div className="text-4xl mb-4 transform transition-transform group-hover:scale-110 duration-300 origin-left">{category.icon}</div>
            <h3 className="font-bold text-primary text-xl mb-2 tracking-tight">{category.name}</h3>
            <p className="text-sm text-primary/70 leading-relaxed font-medium">{category.description}</p>
          </div>
        </div>
      )}
    </Link>
  );
}
