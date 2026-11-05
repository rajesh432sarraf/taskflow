import React from 'react';

/**
 * Metric Card Component for TaskFlow Dashboard.
 * Displays count, icon with background badge, and subtitle.
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  subtext,
  badge,
  variant = 'default',
  isLoading = false,
}) {
  const variantStyles = {
    default: {
      iconBg: 'bg-[#27845B]/10 text-[#27845B]',
      border: 'border-[#E5E7EB]',
    },
    warning: {
      iconBg: 'bg-amber-100 text-amber-700',
      border: 'border-amber-200',
    },
    info: {
      iconBg: 'bg-blue-100 text-blue-700',
      border: 'border-blue-200',
    },
    success: {
      iconBg: 'bg-emerald-100 text-emerald-700',
      border: 'border-emerald-200',
    },
    danger: {
      iconBg: 'bg-red-100 text-red-700',
      border: 'border-red-200',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`bg-white rounded-xl border ${style.border} p-5 shadow-xs transition-all hover:shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {isLoading ? (
          <div className="h-8 w-16 bg-[#F1F3F5] animate-pulse rounded" />
        ) : (
          <span className="text-3xl font-bold tracking-tight text-[#202938]">
            {value ?? 0}
          </span>
        )}
        {badge && (
          <span className="text-xs font-medium text-[#27845B] bg-[#27845B]/10 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-[#667085]">{subtext}</p>
      )}
    </div>
  );
}

