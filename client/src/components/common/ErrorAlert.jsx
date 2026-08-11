import React from 'react';

export const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred.';

  return (
    <div className="w-full max-w-xl mx-auto my-3 animate-fadeIn">
      <div className="bg-[#E4593F]/15 border border-[#E4593F]/30 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-md shadow-lg">
        <div className="p-1 bg-[#E4593F]/20 rounded-lg text-[#E4593F] shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs font-sans font-medium text-rose-200 leading-relaxed">
            {errorMessage}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-[#B9B2A0] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all text-xs"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;


