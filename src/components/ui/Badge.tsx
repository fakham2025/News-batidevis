import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline';
  children: React.ReactNode;
}

export function Badge({ className = '', variant = 'primary', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors';
  
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    secondary: 'bg-orange-50 text-orange-700 border border-orange-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    outline: 'bg-white text-gray-700 border border-gray-200 shadow-2xs'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
