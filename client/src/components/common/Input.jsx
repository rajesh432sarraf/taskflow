import React from 'react';

/**
 * Reusable Input component with label, validation error, and icon support.
 */
export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  helperText,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#202938] mb-1.5"
        >
          {label} {required && <span className="text-[#D64545]">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`block w-full rounded-lg border text-sm text-[#202938] bg-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#27845B] focus:border-[#27845B] disabled:bg-[#F1F3F5] disabled:text-[#667085] disabled:cursor-not-allowed ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } py-2 ${
            error
              ? 'border-[#D64545] focus:ring-[#D64545] focus:border-[#D64545]'
              : 'border-[#E5E7EB]'
          }`}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs text-[#D64545]">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#667085]">{helperText}</p>
      ) : null}
    </div>
  );
}
