import React from 'react';

/**
 * Modern Precision StatCard for TaskFlow Dashboard.
 * Clean, balanced, and modern SaaS styling.
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
      iconBg: 'bg-emerald-50 text-[#059669] border-emerald-100',
      dot: 'bg-[#059669]',
      badge: 'bg-emerald-50 text-[#059669]',
    },
    warning: {
      iconBg: 'bg-amber-50 text-amber-700 border-amber-100',
      dot: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700',
    },
    info: {
      iconBg: 'bg-sky-50 text-sky-700 border-sky-100',
      dot: 'bg-sky-500',
      badge: 'bg-sky-50 text-sky-700',
    },
    success: {
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    danger: {
      iconBg: 'bg-rose-50 text-rose-700 border-rose-100',
      dot: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-700',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs ${style.iconBg}`}
          >
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg" />
        ) : (
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value ?? 0}
          </span>
        )}

        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {subtext}
        </p>
      )}
    </div>
  );
}
