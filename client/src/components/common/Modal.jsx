import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Accessible Modal Dialog Component.
 * Supports ESC to dismiss, backdrop click, and customizable maxWidth.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-headline' : undefined}
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 w-full ${maxWidth} border border-[#E5E7EB]`}
        >
          {/* Modal Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
              <div>
                {title && (
                  <h3
                    id="modal-headline"
                    className="text-base font-semibold text-[#202938]"
                  >
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-0.5 text-xs text-[#667085]">{description}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-[#667085] hover:text-[#202938] hover:bg-[#F1F3F5] transition-colors focus:outline-hidden"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Modal Content */}
          <div className="px-6 py-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

