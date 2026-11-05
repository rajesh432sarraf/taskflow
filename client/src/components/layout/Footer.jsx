import React from 'react';

/**
 * Global application footer for TaskFlow.
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#667085] gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#202938]">TaskFlow</span>
          <span>•</span>
          <span>Built by Team Golden Eagles</span>
        </div>
        <div>
          <span>Target Deadline: Friday, 6 November 2026</span>
        </div>
      </div>
    </footer>
  );
}
