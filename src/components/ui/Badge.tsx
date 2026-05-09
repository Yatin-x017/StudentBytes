import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'outline' | 'primary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className }) => {
  const variants = {
    success: 'bg-success/10 text-success border-success/20',
    error: 'bg-error/10 text-error border-error/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    info: 'bg-surface-2 text-text-muted border-border',
    outline: 'bg-transparent border border-border text-text-muted',
    primary: 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
