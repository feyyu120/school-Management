import React, { type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || props.name;

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-black text-white px-3 py-2 rounded border border-neutral-800 text-sm focus:border-[#1b2d53] focus:outline-none transition duration-150 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
