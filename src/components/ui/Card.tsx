import React from 'react';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  animate?: boolean;
  variant?: 'elevated' | 'filled' | 'outlined';
  elevation?: 1 | 2 | 3 | 4 | 5;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  animate = true,
  variant = 'elevated',
  elevation = 1,
  ...props
}) => {
  const variantStyles = {
    elevated: 'bg-surface border border-outline-variant shadow-elevation-1 hover:shadow-elevation-2',
    filled: 'bg-surface-2 border border-outline-variant',
    outlined: 'bg-transparent border border-outline',
  };

  const elevationStyles = {
    1: 'shadow-elevation-1',
    2: 'shadow-elevation-2',
    3: 'shadow-elevation-3',
    4: 'shadow-elevation-4',
    5: 'shadow-elevation-5',
  };

  return (
    <motion.div
      whileHover={animate ? { y: -2, scale: 1.005 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        'rounded-2xl overflow-hidden transition-md3',
        variantStyles[variant],
        elevation && variant === 'elevated' && elevationStyles[elevation],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
