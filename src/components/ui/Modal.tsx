import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  confirmLabel,
  onConfirm,
  confirmVariant = 'primary',
  isLoading,
}) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="text-lg font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
          {(confirmLabel && onConfirm) && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-surface-2 border-t border-border">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={confirmVariant}
                onClick={onConfirm}
                loading={isLoading}
              >
                {confirmLabel}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
