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
    <div className={`relative rounded-lg shadow-xs ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-9 py-2 text-sm text-[#202938] placeholder-[#667085] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#27845B] focus:border-[#27845B]"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#667085] hover:text-[#202938] cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

