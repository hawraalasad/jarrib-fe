import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { categoriesApi } from '../../services/api';
import type { Category } from '../../types';

interface FilterSidebarProps {
  filters: {
    category?: string;
    area?: string;
    minPrice?: string;
    maxPrice?: string;
    days?: string;
    skillLevel?: string;
    commitmentType?: string;
  };
  onChange: (filters: FilterSidebarProps['filters']) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const areas = [
  { id: 'kuwait-city', name: 'Kuwait City' },
  { id: 'salmiya', name: 'Salmiya' },
  { id: 'hawalli', name: 'Hawalli' },
  { id: 'jabriya', name: 'Jabriya' },
  { id: 'mishref', name: 'Mishref' },
  { id: 'farwaniya', name: 'Farwaniya' },
  { id: 'fahaheel', name: 'Fahaheel' },
  { id: 'online', name: 'Online' },
];

const days = [
  { id: 'saturday', name: 'Saturday' },
  { id: 'sunday', name: 'Sunday' },
  { id: 'monday', name: 'Monday' },
  { id: 'tuesday', name: 'Tuesday' },
  { id: 'wednesday', name: 'Wednesday' },
  { id: 'thursday', name: 'Thursday' },
  { id: 'friday', name: 'Friday' },
];

const skillLevels = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'all', name: 'All Levels' },
];

const commitmentTypes = [
  { id: 'drop-in', name: 'Drop-in' },
  { id: 'workshop', name: 'Workshop' },
  { id: 'short-course', name: 'Short Course' },
  { id: 'course', name: 'Course' },
  { id: 'bootcamp', name: 'Bootcamp' },
  { id: 'certification', name: 'Certification' },
];

export default function FilterSidebar({
  filters,
  onChange,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['category', 'area', 'price'])
  );

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCheckboxChange = (key: keyof typeof filters, value: string) => {
    const currentValues = filters[key]?.split(',').filter(Boolean) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onChange({ ...filters, [key]: newValues.join(',') || undefined });
  };

  const handleRadioChange = (key: keyof typeof filters, value: string) => {
    onChange({ ...filters, [key]: value === filters[key] ? undefined : value });
  };

  const clearFilters = () => {
    onChange({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const renderSection = (
    title: string,
    key: string,
    content: React.ReactNode
  ) => (
    <div className="border-b border-lilac/30 py-4">
      <button
        onClick={() => toggleSection(key)}
        className="flex items-center justify-between w-full text-left"
      >
        <h4 className="font-ui font-semibold text-deep-violet">{title}</h4>
        {expandedSections.has(key) ? (
          <ChevronUp className="w-5 h-5 text-lavender" />
        ) : (
          <ChevronDown className="w-5 h-5 text-lavender" />
        )}
      </button>
      {expandedSections.has(key) && <div className="mt-3">{content}</div>}
    </div>
  );

  return (
    <div className={`bg-white ${isMobile ? 'h-full' : 'rounded-xl shadow-md'} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-ui font-semibold text-deep-violet text-lg">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-indigo text-white text-xs px-2 py-0.5 rounded-full font-ui">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm font-ui text-lavender hover:text-indigo"
            >
              Clear all
            </button>
          )}
          {isMobile && onClose && (
            <button onClick={onClose} className="p-1 text-lavender hover:text-indigo">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      {renderSection(
        'Category',
        'category',
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filters.category === cat.slug}
                onChange={() => handleRadioChange('category', cat.slug)}
                className="w-4 h-4 text-indigo"
              />
              <span className="font-ui text-sm text-deep-violet">{cat.name_en}</span>
              <span className="font-ui text-xs text-lavender">({cat.listingCount || 0})</span>
            </label>
          ))}
        </div>
      )}

      {/* Area */}
      {renderSection(
        'Location',
        'area',
        <div className="space-y-2">
          {areas.map((area) => (
            <label key={area.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.area?.split(',').includes(area.id)}
                onChange={() => handleCheckboxChange('area', area.id)}
                className="w-4 h-4 text-indigo rounded"
              />
              <span className="font-ui text-sm text-deep-violet">{area.name}</span>
            </label>
          ))}
        </div>
      )}

      {/* Price Range */}
      {renderSection(
        'Price Range',
        'price',
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value || undefined })}
            className="input flex-1 text-center"
          />
          <span className="text-lavender">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value || undefined })}
            className="input flex-1 text-center"
          />
        </div>
      )}

      {/* Days */}
      {renderSection(
        'Days',
        'days',
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day.id}
              onClick={() => handleCheckboxChange('days', day.id)}
              className={`px-3 py-1 rounded-full text-sm font-ui transition-colors ${
                filters.days?.split(',').includes(day.id)
                  ? 'bg-indigo text-white'
                  : 'bg-light-lavender text-deep-violet hover:bg-lilac'
              }`}
            >
              {day.name.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {/* Skill Level */}
      {renderSection(
        'Skill Level',
        'skillLevel',
        <div className="space-y-2">
          {skillLevels.map((level) => (
            <label key={level.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.skillLevel?.split(',').includes(level.id)}
                onChange={() => handleCheckboxChange('skillLevel', level.id)}
                className="w-4 h-4 text-indigo rounded"
              />
              <span className="font-ui text-sm text-deep-violet">{level.name}</span>
            </label>
          ))}
        </div>
      )}

      {/* Commitment Type (for bootcamps) */}
      {renderSection(
        'Time Commitment',
        'commitmentType',
        <div className="space-y-2">
          {commitmentTypes.map((type) => (
            <label key={type.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.commitmentType?.split(',').includes(type.id)}
                onChange={() => handleCheckboxChange('commitmentType', type.id)}
                className="w-4 h-4 text-indigo rounded"
              />
              <span className="font-ui text-sm text-deep-violet">{type.name}</span>
            </label>
          ))}
        </div>
      )}

      {/* Apply Button (Mobile) */}
      {isMobile && onClose && (
        <button onClick={onClose} className="btn-primary w-full mt-6">
          Apply Filters
        </button>
      )}
    </div>
  );
}
