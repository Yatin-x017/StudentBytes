// ============================================
// Card.tsx
// ============================================
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
  tinted?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  elevated,
  tinted,
  hover = true,
  ...props
}) => (
  <div
    className={cn(
      'rounded-2xl transition-all duration-200',
      elevated ? 'glass-elevated' : tinted ? 'glass-primary' : 'glass',
      hover && 'hover:shadow-[0_12px_40px_rgba(79,70,229,0.12)] hover:-translate-y-[1px]',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
