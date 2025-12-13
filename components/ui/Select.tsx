import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, placeholder, containerClassName = '', className = '', ...props }) => {
  const isPlaceholder = props.value === '';

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">
        {label}
      </label>
      <div className="relative">
        <select
          className={`flex h-10 w-full items-center justify-between bg-white border-b border-stone-300 px-0 py-2 text-sm font-serif placeholder:text-stone-400 focus:outline-none focus:border-stone-800 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-colors rounded-none ${isPlaceholder ? 'text-stone-400' : 'text-stone-800'} ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-stone-800">
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-stone-400">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};