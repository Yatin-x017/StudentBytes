import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline' | 'secondary' | 'filled' | 'tonal' | 'elevated';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  elevation?: 1 | 2 | 3 | 4 | 5;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  elevation,
  children,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    ghost: 'bg-transparent text-text-muted hover:bg-surface-2 hover:text-text',
    outline: 'bg-transparent border border-border text-text hover:bg-surface-2',
    secondary: 'bg-surface text-text border border-border hover:bg-surface-2',
    danger: 'bg-error text-white hover:opacity-90',
    filled: 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg',
    tonal: 'bg-primary/15 text-primary hover:bg-primary/25',
    elevated: 'bg-surface text-text shadow-md hover:shadow-lg border border-outline-variant',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  const elevations = {
    1: 'shadow-elevation-1',
    2: 'shadow-elevation-2',
    3: 'shadow-elevation-3',
    4: 'shadow-elevation-4',
    5: 'shadow-elevation-5',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-bold transition-md3 disabled:opacity-50 disabled:cursor-not-allowed focus-ring active:scale-[0.98]',
        variants[variant],
        sizes[size],
        elevation && elevations[elevation],
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
