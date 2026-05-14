import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white shadow-sm hover:shadow-md hover:bg-primary/90',
    ghost: 'bg-transparent text-primary hover:bg-primary-light',
    outline: 'bg-transparent border border-border text-primary hover:bg-primary-light',
    secondary: 'bg-surface-3 text-primary hover:shadow-sm hover:bg-surface-3/90',
    danger: 'bg-error text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs h-8',
    md: 'px-6 py-2.5 text-sm h-10',
    lg: 'px-8 py-3.5 text-base h-12',
    icon: 'p-2 w-10 h-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-ring active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
