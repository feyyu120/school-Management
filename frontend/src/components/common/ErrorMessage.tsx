import React from 'react';

interface ErrorMessageProps {
  message?: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="w-full bg-red-950/40 border border-red-900/60 text-red-300 px-4 py-3 rounded text-sm text-left">
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
