import React from 'react';

/**
 * Premium Metric Card Component for TaskFlow Dashboard.
 * Displays count, illuminated icon container, top ambient accent glow, and status metadata.
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
      border: 'hover:border-[#27845B]/40',
      accentGlow: 'bg-[#27845B]',
      iconBg: 'bg-[#27845B]/10 text-[#27845B] border-[#27845B]/20',
      badge: 'bg-[#27845B]/10 text-[#27845B]',
    },
    warning: {
      border: 'hover:border-amber-400/50',
      accentGlow: 'bg-amber-500',
      iconBg: 'bg-amber-500/10 text-amber-700 border-amber-300/40',
      badge: 'bg-amber-50 text-amber-700',
    },
    info: {
      border: 'hover:border-sky-400/50',
      accentGlow: 'bg-sky-500',
      iconBg: 'bg-sky-500/10 text-sky-700 border-sky-300/40',
      badge: 'bg-sky-50 text-sky-700',
    },
    success: {
      border: 'hover:border-emerald-400/50',
      accentGlow: 'bg-emerald-500',
      iconBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300/40',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    danger: {
      border: 'hover:border-red-400/50',
      accentGlow: 'bg-red-500',
      iconBg: 'bg-red-500/10 text-red-700 border-red-300/40',
      badge: 'bg-red-50 text-red-700',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={`group relative overflow-hidden bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-all duration-300 ${style.border}`}
    >
      {/* Top Ambient Glow Edge */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 opacity-80 group-hover:h-1.5 transition-all duration-300 ${style.accentGlow}`}
      />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs group-hover:scale-105 transition-transform duration-200 ${style.iconBg}`}
          >
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {isLoading ? (
          <div className="h-8 w-16 bg-[#F1F3F5] animate-pulse rounded-lg" />
        ) : (
          <span className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
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
        <p className="mt-2 text-xs text-[#64748B] font-medium flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${style.accentGlow}`} />
          {subtext}
        </p>
      )}
    </div>
  );
}
