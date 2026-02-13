import { Link } from 'react-router-dom';
import type { Category } from '../data/categories';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/kategoria/${category.slug}`}
      className={`block ${category.color} rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
    >
      <div className="text-3xl mb-3">{category.icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
      <p className="text-sm text-gray-600">{category.description}</p>
    </Link>
  );
}
