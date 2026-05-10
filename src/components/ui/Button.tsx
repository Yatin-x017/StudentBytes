import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline' | 'secondary' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
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
  const variants: Record<string, string> = {
    primary:   'bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/25 active:shadow-sm',
    ghost:     'bg-transparent text-text-muted hover:bg-white/60 hover:text-text border border-transparent hover:border-white/70',
    outline:   'bg-white/60 text-text border border-white/70 hover:bg-white/80 hover:border-primary/30 hover:text-primary shadow-sm',
    secondary: 'bg-white/80 text-text border border-white/80 hover:bg-white shadow-sm',
    danger:    'bg-error/10 text-error border border-error/20 hover:bg-error/20 hover:border-error/40',
    success:   'bg-success/10 text-success border border-success/20 hover:bg-success/20',
  };

  const sizes: Record<string, string> = {
    xs:   'px-2.5 py-1.5 text-[11px] rounded-lg',
    sm:   'px-3.5 py-2 text-xs rounded-xl',
    md:   'px-5 py-2.5 text-sm rounded-xl',
    lg:   'px-7 py-3.5 text-base rounded-2xl',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold',
        'transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.97]',
        'focus-ring',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
};
