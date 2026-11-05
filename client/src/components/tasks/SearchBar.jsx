import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable SearchBar component with instant search, debounce ready, and clear action.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search tasks by title...',
  className = '',
}) {
  return (
    <div className={`relative rounded-xl shadow-xs ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-xl border border-emerald-500/25 bg-white/[0.05] pl-9 pr-9 py-2 text-sm text-white placeholder-slate-400 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

