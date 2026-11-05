import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Premium Reusable Button component for TaskFlow.
 * Styled with the Niche Luxury Teal palette (#367D8A / #285F6B / #FFFFFF).
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-1 focus:ring-[#367D8A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#367D8A] text-white hover:bg-[#285F6B] shadow-sm hover:shadow-md hover:shadow-[#367D8A]/25 active:scale-98',
    secondary: 'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFB] hover:border-[#367D8A]/30 shadow-2xs',
    danger: 'bg-[#D64545] text-white hover:bg-rose-700 shadow-sm active:scale-98',
    outline: 'border-2 border-[#367D8A] text-[#367D8A] hover:bg-[#367D8A]/10 active:scale-98',
    ghost: 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
