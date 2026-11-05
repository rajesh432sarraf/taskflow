import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CheckCircle2, 
  Activity, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Responsive Sidebar navigation for TaskFlow.
 * Includes links for Dashboard, My Tasks, Completed Tasks, and Logout action.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Completed Tasks', path: '/tasks?status=Completed', icon: CheckCircle2 },
    { label: 'System Health', path: '/health', icon: Activity },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
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
                const isItemActive =
                  item.path.includes('?')
                    ? location.pathname + location.search === item.path
                    : location.pathname === item.path && !location.search;

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isItemActive
                        ? 'bg-[#27845B]/10 text-[#27845B] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isItemActive ? 'text-[#27845B]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isItemActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#27845B] shadow-[0_0_6px_#10B981]" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Sidebar Info & Logout */}
        <div className="p-4 border-t border-[#E5E7EB] space-y-3">
          {user && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#27845B] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[110px] font-bold text-slate-800">
                  {user.name}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
