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
    <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="TaskFlow Logo"
              className="h-8.5 w-auto object-contain hidden sm:block"
            />
            <img
              src="/logo-icon.png"
              alt="TaskFlow Logo"
              className="h-8 w-auto object-contain sm:hidden"
            />
          </div>
        </div>

        {/* Right: Current Date & Welcome Message */}
        <div className="flex items-center">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-[#0F172A]">
              {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome back!'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{todayFormatted}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
