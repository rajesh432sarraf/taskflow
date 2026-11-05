import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Loader component with emerald styling and optional status message.
 */
export default function Loader({ 
  size = 'md', 
  text = '', 
  fullHeight = false,
  className = '' 
}) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullHeight ? 'min-h-[250px] w-full' : ''
      } ${className}`}
    >
      <Loader2
        className={`${sizeMap[size] || sizeMap.md} animate-spin text-[#27845B]`}
      />
      {text && (
        <p className="text-xs font-medium text-[#667085] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

