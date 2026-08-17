import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}) => {
  let baseStyles = 'w-full py-2.5 px-4 rounded font-medium text-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

  let variantStyles = 'bg-[#1b2d53] text-white hover:bg-[#162544] focus:ring-2 focus:ring-[#1b2d53] focus:outline-none';

  if (variant === 'secondary') {
    variantStyles = 'bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800';
  } else if (variant === 'danger') {
    variantStyles = 'bg-red-950 text-red-200 border border-red-900 hover:bg-red-900';
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
