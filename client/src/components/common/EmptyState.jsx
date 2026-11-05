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
      className={`rounded-2xl border border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-xs transition-all ${className}`}
    >
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-[#059669] mb-4 shadow-2xs">
        <Icon className="w-7 h-7 text-[#059669]" />
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          icon={actionIcon}
          onClick={onAction}
          className="shadow-sm font-semibold"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
