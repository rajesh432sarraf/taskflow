import React from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Top Navigation bar for TaskFlow.
 * Displays Welcome greeting, current date, user profile area, and mobile menu toggle.
 */
export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-[#667085] hover:text-[#202938] hover:bg-[#F1F3F5] focus:outline-hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="TaskFlow Logo"
              className="h-8 w-auto object-contain hidden sm:block"
            />
            <img
              src="/logo-icon.png"
              alt="TaskFlow Logo"
              className="h-8 w-auto object-contain sm:hidden"
            />
            <span className="hidden md:inline-block text-[11px] bg-[#27845B]/10 text-[#27845B] font-medium px-2 py-0.5 rounded-full border border-[#27845B]/20">
              Golden Eagles
            </span>
          </div>
        </div>

        {/* Center/Right: Current Date & Welcome Message */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-semibold text-[#202938]">
              {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome back!'}
            </span>
            <span className="text-[11px] text-[#667085]">{todayFormatted}</span>
          </div>

          {/* User Profile Pill / Avatar */}
          {user && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E7EB]">
              <div className="w-8 h-8 rounded-full bg-[#27845B]/10 border border-[#27845B]/20 text-[#27845B] flex items-center justify-center text-xs font-bold">
                {userInitials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#202938] leading-tight">
                  {user.name}
                </span>
                <span className="text-[11px] text-[#667085] leading-tight truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>

              {/* Quick Logout Button */}
              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#D64545] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
