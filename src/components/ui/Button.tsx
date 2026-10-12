import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'blueSubtle';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-heading font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';
    
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md focus:ring-blue-500',
      outline: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400',
      secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus:ring-slate-500',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300',
      blueSubtle: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 focus:ring-blue-400'
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base sm:text-lg px-7 py-3.5 gap-2.5 font-bold'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
