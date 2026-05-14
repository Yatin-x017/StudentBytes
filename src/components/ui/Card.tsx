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
      whileHover={animate ? { y: -2, scale: 1.005 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        'm3-card-elevated overflow-hidden transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
