import React from 'react';

/**
 * Global application footer for TaskFlow.
 */
export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-emerald-500/15 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/60 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">TaskFlow</span>
          <span>&bull;</span>
          <span>Personal Task &amp; Productivity Manager</span>
        </div>
        <div>
          <span>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
