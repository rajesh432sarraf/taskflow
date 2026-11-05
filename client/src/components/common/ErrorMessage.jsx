import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Error Message card component with optional retry action.
 */
export default function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) {
  if (!message) return null;

  return (
    <div
      className={`rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-[#D64545] shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 text-[#D64545] mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-[#D64545] mb-1">{title}</h4>
          <p className="text-[#667085] leading-relaxed">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="danger"
                size="sm"
                icon={RefreshCw}
                onClick={onRetry}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
