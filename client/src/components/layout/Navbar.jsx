import React from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Top Navigation bar for TaskFlow.
 * Displays brand logo, mobile toggle, welcome greeting, and current date.
 */
export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user } = useAuth();

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-[#061C16]/80 backdrop-blur-xl border-b border-emerald-500/20 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-500/10 focus:outline-hidden cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-white/95 shadow-sm">
            <img
              src="/logo.png"
              alt="TaskFlow Logo"
              className="h-7 w-auto object-contain hidden sm:block"
            />
            <img
              src="/logo-icon.png"
              alt="TaskFlow Logo"
              className="h-7 w-auto object-contain sm:hidden"
            />
          </div>
        </div>

        {/* Right: Current Date & Welcome Message */}
        <div className="flex items-center">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-white">
              {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome back!'}
            </span>
            <span className="text-[11px] text-emerald-200/70 font-medium">{todayFormatted}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
