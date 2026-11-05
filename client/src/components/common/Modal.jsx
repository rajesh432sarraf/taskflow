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
          className={`relative transform overflow-hidden rounded-3xl bg-[#061C16] text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-emerald-500/30 text-white backdrop-blur-xl`}
        >
          {/* Modal Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-emerald-500/20">
              <div>
                {title && (
                  <h3
                    id="modal-headline"
                    className="text-lg font-bold text-white tracking-tight"
                  >
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-0.5 text-xs text-emerald-200/70">{description}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-hidden cursor-pointer"
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

