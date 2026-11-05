import React from 'react';
import Button from './Button';

/**
 * Premium Reusable Empty State component styled with the Niche Luxury Teal palette.
 */
export default function EmptyState({
  title = 'No tasks found',
  description = 'You do not have any tasks matching your criteria.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dashed border-[#E2E8F0] bg-gradient-to-b from-white to-[#F8FAFB] p-10 text-center flex flex-col items-center justify-center shadow-xs transition-all ${className}`}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#367D8A]/10 rounded-full blur-2xl pointer-events-none" />

      {/* TaskFlow Productivity Vector Illustration with Niche Palette */}
      <div className="relative mb-5 w-28 h-28 flex items-center justify-center">
        {/* Outer Circular Orbit Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#367D8A]/30 animate-[spin_24s_linear_infinite]" />

        {/* Orbiting Milestone Sparkles */}
        <div className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-[#367D8A] shadow-[0_0_12px_#367D8A] border-2 border-white" />
        <div className="absolute -bottom-1 left-3 w-3 h-3 rounded-full bg-[#285F6B] shadow-[0_0_10px_#285F6B] border-2 border-white" />

        {/* Center Illustration Artwork */}
        <svg className="w-20 h-20 drop-shadow-sm" viewBox="0 0 80 80" fill="none">
          {/* Clipboard Base */}
          <rect x="18" y="16" width="44" height="52" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="22" y="20" width="36" height="44" rx="6" fill="#F8FAFC" />

          {/* Top Clip with Midnight Teal */}
          <rect x="30" y="12" width="20" height="8" rx="4" fill="#133336" stroke="#367D8A" strokeWidth="1.5" />
          <circle cx="40" cy="16" r="2" fill="#367D8A" />

          {/* Task Lines & Checks */}
          <circle cx="28" cy="30" r="3.5" fill="#367D8A" />
          <path d="M26.5 30l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="35" y="28.5" width="19" height="3" rx="1.5" fill="#285F6B" />

          <circle cx="28" cy="40" r="3.5" fill="#285F6B" />
          <path d="M26.5 40l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="35" y="38.5" width="15" height="3" rx="1.5" fill="#94A3B8" />

          <circle cx="28" cy="50" r="3.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="35" y="48.5" width="17" height="3" rx="1.5" fill="#E2E8F0" />
        </svg>
      </div>

      <h3 className="text-base font-bold text-[#0F172A] mb-1.5 tracking-tight">{title}</h3>
      <p className="text-xs text-[#64748B] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          icon={actionIcon}
          onClick={onAction}
          className="shadow-md hover:shadow-lg hover:shadow-[#367D8A]/25 transition-all cursor-pointer font-bold"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
