import { Link } from 'react-router-dom';
import {
  Palette,
  Dumbbell,
  ChefHat,
  Music,
  Leaf,
  Globe,
  Briefcase,
  Trophy,
  Code,
} from 'lucide-react';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  palette: Palette,
  dumbbell: Dumbbell,
  'chef-hat': ChefHat,
  music: Music,
  leaf: Leaf,
  globe: Globe,
  briefcase: Briefcase,
  trophy: Trophy,
  code: Code,
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Palette;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="card p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 group"
    >
      <div className="w-14 h-14 mx-auto mb-4 bg-light-lavender rounded-xl flex items-center justify-center group-hover:bg-indigo group-hover:text-white transition-colors">
        <Icon className="w-7 h-7 text-indigo group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-display font-semibold text-deep-violet mb-1">
        {category.name_en}
      </h3>
      <p className="font-ui text-sm text-lavender">
        {category.listingCount || 0} {category.listingCount === 1 ? 'class' : 'classes'}
      </p>
    </Link>
  );
}
