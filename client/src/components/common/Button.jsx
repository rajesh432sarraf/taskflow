import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component for TaskFlow.
 * Supports primary (#27845B), secondary, danger, and outline variants.
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 focus:ring-[#27845B] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#27845B] text-white hover:bg-[#206C4A] shadow-xs',
    secondary: 'bg-white text-[#202938] border border-[#E5E7EB] hover:bg-[#F7F8FA] shadow-xs',
    danger: 'bg-[#D64545] text-white hover:bg-red-700 shadow-xs',
    outline: 'border border-[#27845B] text-[#27845B] hover:bg-[#27845B]/10',
    ghost: 'text-[#667085] hover:text-[#202938] hover:bg-[#F1F3F5]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
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

