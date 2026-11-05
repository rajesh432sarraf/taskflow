import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Server, 
  ShieldCheck, 
  Info,
  ExternalLink 
} from 'lucide-react';

/**
 * Responsive Sidebar navigation for TaskFlow.
 */
export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Tasks (Phase 2)', path: '/tasks', icon: CheckSquare, badge: 'Soon' },
    { label: 'System Health', path: '/health', icon: Server },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-60 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Main Navigation Links */}
          <div>
            <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block mb-2 px-3">
              Navigation
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#27845B]/10 text-[#27845B]'
                          : 'text-[#667085] hover:text-[#202938] hover:bg-[#F7F8FA]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-semibold bg-[#F1F3F5] text-[#667085] px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Architecture Status Badge */}
          <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#202938] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#27845B]" />
              <span>Phase 1 Verified</span>
            </div>
            <p className="text-[11px] text-[#667085] leading-relaxed">
              Express REST API on port 5000, Vite React frontend on 5173, and Mongoose connection layer ready.
            </p>
          </div>
        </div>

        {/* Bottom Sidebar Info */}
        <div className="p-4 border-t border-[#E5E7EB] text-xs text-[#667085] space-y-1">
          <div className="flex items-center justify-between">
            <span>Team</span>
            <span className="font-semibold text-[#202938]">Golden Eagles</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Stack</span>
            <span className="font-mono text-[11px] text-[#202938]">MERN</span>
          </div>
        </div>
      </aside>
    </>
  );
}
