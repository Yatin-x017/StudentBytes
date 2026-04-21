import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  const id = React.useId();

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'flex h-10 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-muted focus-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          error && 'border-error ring-error',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-error">{error}</p>}
    </div>
  );
};
