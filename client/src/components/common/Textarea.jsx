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
  labelClassName = '',
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
            className={`block text-xs font-semibold ${labelClassName || 'text-emerald-200/80'}`}
          >
            {label} {required && <span className="text-rose-400">*</span>}
          </label>
          {maxLength && (
            <span className="text-[11px] text-slate-400">
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
        className={`block w-full rounded-xl border text-sm text-white bg-white/[0.05] placeholder-slate-400 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 disabled:bg-white/[0.02] disabled:text-slate-500 disabled:cursor-not-allowed p-3 ${
          error
            ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
            : 'border-emerald-500/25'
        }`}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
