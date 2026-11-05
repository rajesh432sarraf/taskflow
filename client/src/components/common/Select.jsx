import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Select dropdown component styled consistently with TaskFlow design tokens.
 */
export default function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  labelClassName = '',
  ...props
}) {
  const selectId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-xs font-semibold ${labelClassName || 'text-emerald-200/80'} mb-1.5`}
        >
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`appearance-none block w-full rounded-xl border text-sm text-white bg-[#06241b] transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 disabled:bg-white/[0.02] disabled:text-slate-500 disabled:cursor-not-allowed pl-3 pr-9 py-2 cursor-pointer ${
            error
              ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
              : 'border-emerald-500/25'
          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-[#06241b] text-slate-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} className="bg-[#06241b] text-white">
                {text}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
