import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'filled' | 'outlined';
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'filled',
  helperText,
  className,
  ...props
}) => {
  const id = React.useId();

  const variantStyles = {
    filled:
      'bg-surface-2 border border-outline-variant focus:border-primary focus:bg-surface',

    outlined:
      'bg-transparent border border-outline focus:border-primary',
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-widest text-text-muted"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={cn(
          'flex h-12 w-full rounded-lg px-4 py-2 text-base text-text placeholder:text-text-muted transition-all disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-3 focus:ring-primary/30',
          variantStyles[variant],
          error && 'border-error focus:ring-error/30',
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs font-medium text-error">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
};