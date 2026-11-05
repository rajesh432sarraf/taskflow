import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

/**
 * FilterBar component for filtering tasks by status and priority.
 */
export default function FilterBar({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  onReset,
  hasActiveFilters,
}) {
  const statusOptions = ['All', 'Pending', 'In Progress', 'Completed'];
  const priorityOptions = ['All', 'Low', 'Medium', 'High'];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Filter className="w-3.5 h-3.5 text-[#367D8A]" />
        <span className="font-medium hidden sm:inline">Status:</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#367D8A] cursor-pointer hover:border-[#367D8A]/40 transition-colors"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'All' ? 'All Statuses' : opt}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <span className="font-medium hidden sm:inline">Priority:</span>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#367D8A] cursor-pointer hover:border-[#367D8A]/40 transition-colors"
        >
          {priorityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'All' ? 'All Priorities' : opt}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#667085] hover:text-[#202938] px-2 py-1 rounded-md hover:bg-[#F1F3F5] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}

