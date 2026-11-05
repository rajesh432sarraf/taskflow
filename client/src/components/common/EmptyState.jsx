import React from 'react';
import { ClipboardList } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Empty State component with customizable title, icon, and call to action.
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
      className={`rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[#667085] mb-4 shadow-2xs">
        <Icon className="w-7 h-7 text-[#27845B]" />
      </div>

      <h3 className="text-base font-semibold text-[#202938] mb-1">{title}</h3>
      <p className="text-xs text-[#667085] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          icon={actionIcon}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

