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
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      dot: 'bg-emerald-400 shadow-[0_0_6px_#10B981]',
      badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    warning: {
      iconBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
      dot: 'bg-amber-400 shadow-[0_0_6px_#F59E0B]',
      badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    info: {
      iconBg: 'bg-sky-500/20 text-sky-300 border-sky-400/30 shadow-[0_0_12px_rgba(14,165,233,0.3)]',
      dot: 'bg-sky-400 shadow-[0_0_6px_#0EA5E9]',
      badge: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    },
    success: {
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      dot: 'bg-emerald-400 shadow-[0_0_6px_#10B981]',
      badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    danger: {
      iconBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
      dot: 'bg-rose-400 shadow-[0_0_6px_#F43F5E]',
      badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-emerald-500/20 p-5 shadow-lg hover:shadow-xl hover:border-emerald-500/40 hover:bg-white/[0.07] transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-200/70 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${style.iconBg}`}
          >
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {isLoading ? (
          <div className="h-8 w-16 bg-white/10 animate-pulse rounded-lg" />
        ) : (
          <span className="text-3xl font-black tracking-tight text-white">
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
        <p className="mt-2 text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {subtext}
        </p>
      )}
    </div>
  );
}
