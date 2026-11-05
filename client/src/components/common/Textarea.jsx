import React from 'react';

/**
 * Reusable Textarea component with character counter and validation styling.
 */
export default function Textarea({
  label,
  id,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = '',
  error,
  helperText,
  maxLength,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const textareaId = id || name;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-[#202938]"
          >
            {label} {required && <span className="text-[#D64545]">*</span>}
          </label>
          {maxLength && (
            <span className="text-[11px] text-[#667085]">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`block w-full rounded-lg border text-sm text-[#202938] bg-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#27845B] focus:border-[#27845B] disabled:bg-[#F1F3F5] disabled:text-[#667085] disabled:cursor-not-allowed p-3 ${
          error
            ? 'border-[#D64545] focus:ring-[#D64545] focus:border-[#D64545]'
            : 'border-[#E5E7EB]'
        }`}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-xs text-[#D64545]">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#667085]">{helperText}</p>
      ) : null}
    </div>
  );
}

