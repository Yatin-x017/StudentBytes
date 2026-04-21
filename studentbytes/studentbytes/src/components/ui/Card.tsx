import React from 'react';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, animate = true, ...props }) => {
  return (
    <motion.div
      whileHover={animate ? { y: -2, borderColor: 'rgba(255,255,255,0.2)' } : {}}
      transition={{ duration: 0.15 }}
      className={cn(
        'bg-surface border border-white/5 rounded-2xl overflow-hidden transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
