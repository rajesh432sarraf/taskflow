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
  ...props
}) {
  const selectId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-[#202938] mb-1.5"
        >
          {label} {required && <span className="text-[#D64545]">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-xs">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`appearance-none block w-full rounded-lg border text-sm text-[#202938] bg-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#27845B] focus:border-[#27845B] disabled:bg-[#F1F3F5] disabled:text-[#667085] disabled:cursor-not-allowed pl-3 pr-9 py-2 cursor-pointer ${
            error
              ? 'border-[#D64545] focus:ring-[#D64545] focus:border-[#D64545]'
              : 'border-[#E5E7EB]'
          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#667085]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-[#D64545]">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#667085]">{helperText}</p>
      ) : null}
    </div>
  );
}
