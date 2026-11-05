import React from 'react';
import { ClipboardList } from 'lucide-react';
import Button from './Button';

/**
 * Clean, Modern SaaS Empty State component.
 */
export default function EmptyState({
  icon: Icon = ClipboardList,
  title = 'No tasks found',
  description = 'You do not have any tasks matching your criteria.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div
      className={`rounded-3xl border border-dashed border-emerald-500/25 bg-white/[0.03] backdrop-blur-md p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-xl transition-all ${className}`}
    >
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
        <Icon className="w-7 h-7 text-emerald-400" />
      </div>

      <h3 className="text-base font-bold text-white mb-1.5 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-300 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          icon={actionIcon}
          onClick={onAction}
          className="shadow-[0_0_15px_rgba(16,185,129,0.35)] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
