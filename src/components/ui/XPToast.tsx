import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  onComplete: () => void;
}

export const XPToast: React.FC<ToastProps> = ({ message, onComplete }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 0.5 }}
        animate={{ opacity: 1, y: -100, scale: 1.2 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        onAnimationComplete={onComplete}
        className="fixed bottom-1/2 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
      >
        <div className="bg-amber-500 text-black font-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
          <span className="text-2xl">⚡</span> {message}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
