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
      <div className="flex items-center gap-1.5 text-xs text-emerald-200/70">
        <Filter className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold hidden sm:inline">Status:</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-emerald-500/25 bg-[#06241b] text-xs font-semibold text-white px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[#06241b] text-white">
              {opt === 'All' ? 'All Statuses' : opt}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-1.5 text-xs text-emerald-200/70">
        <span className="font-semibold hidden sm:inline">Priority:</span>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-xl border border-emerald-500/25 bg-[#06241b] text-xs font-semibold text-white px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          {priorityOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[#06241b] text-white">
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
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}

