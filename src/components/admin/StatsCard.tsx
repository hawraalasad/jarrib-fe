import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'indigo' | 'success' | 'warning' | 'error';
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'indigo',
}: StatsCardProps) {
  const colorStyles = {
    indigo: 'bg-indigo/10 text-indigo',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-lilac/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-deep-violet mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 mt-2">
              <span className={trend.value >= 0 ? 'text-success' : 'text-error'}>
                {trend.value >= 0 ? '+' : ''}
                {trend.value}
              </span>{' '}
              {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
