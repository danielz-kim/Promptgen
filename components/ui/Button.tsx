import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center text-sm font-sans font-semibold tracking-wide uppercase transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-0.5";
  
  const variants = {
    primary: "h-10 px-6 bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm rounded-sm",
    secondary: "h-10 px-6 bg-white text-stone-900 border border-stone-200 hover:bg-stone-50 shadow-sm rounded-sm",
    ghost: "h-10 px-4 hover:bg-stone-100 text-stone-900 rounded-sm",
    icon: "h-9 w-9 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-3">
          <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce"></span>
        </span>
      ) : children}
    </button>
  );
};