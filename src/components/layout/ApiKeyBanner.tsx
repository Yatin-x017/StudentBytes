import React, { useState } from 'react';
import { Key, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiKeyModal } from './ApiKeyModal';
import { XPToast } from '@/components/ui/XPToast';

export const ApiKeyBanner: React.FC = () => {
  const { state } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (state.apiKey) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden mb-6"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-card/80 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Byte needs an Anthropic API key to respond.
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                    It's free to get one from the Anthropic Console.
                    <ShieldCheck size={12} className="text-success opacity-50" />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white text-xs font-bold transition-all whitespace-nowrap"
                >
                  Get API key
                  <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-black transition-all whitespace-nowrap shadow-lg shadow-primary/20"
                >
                  Enter key
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setShowToast(true)}
      />

      {showToast && (
        <XPToast
          message="Byte is ready ✓"
          onComplete={() => setShowToast(false)}
        />
      )}
    </>
  );
};
