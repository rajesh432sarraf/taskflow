import React from 'react';
import { Layers, Menu, X, Activity } from 'lucide-react';

/**
 * Top Navigation bar for TaskFlow.
 */
export default function Navbar({ onToggleSidebar, isSidebarOpen, onPingApi, isCheckingApi }) {
  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-[#667085] hover:text-[#202938] hover:bg-[#F1F3F5] focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27845B] flex items-center justify-center text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#202938]">TaskFlow</span>
                <span className="text-xs bg-[#27845B]/10 text-[#27845B] font-medium px-2 py-0.5 rounded-full border border-[#27845B]/20">
                  Phase 1 MVP
                </span>
              </div>
              <p className="text-xs text-[#667085] hidden sm:block">Personal Task & Productivity Manager</p>
            </div>
          </div>
        </div>

        {/* Right: Team info & Connectivity quick check */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-[#F1F3F5] text-[#667085]">
            Team: Golden Eagles
          </span>

          {onPingApi && (
            <button
              onClick={onPingApi}
              disabled={isCheckingApi}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-[#E5E7EB] text-[#202938] px-3 py-1.5 rounded-lg hover:bg-[#F7F8FA] focus:outline-hidden focus:ring-2 focus:ring-[#27845B] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Activity className={`w-3.5 h-3.5 ${isCheckingApi ? 'animate-spin text-[#27845B]' : 'text-[#27845B]'}`} />
              <span className="hidden sm:inline">{isCheckingApi ? 'Pinging...' : 'Check API'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
