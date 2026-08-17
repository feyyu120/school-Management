import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-black text-white px-3 py-2 rounded border border-neutral-800 text-sm focus:border-[#1b2d53] focus:outline-none transition duration-150 placeholder-neutral-600 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
