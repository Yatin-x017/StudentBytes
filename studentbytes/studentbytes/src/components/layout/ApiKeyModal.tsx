import React, { useState } from 'react';
import { Key, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { STORAGE_KEYS } from '@/lib/constants';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { dispatch } = useAppContext();
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (!key.trim()) return;

    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
    dispatch({ type: 'SET_API_KEY', payload: key.trim() });
    setKey('');
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md"
          >
            <Card className="p-8 border-white/10 shadow-2xl bg-surface">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-muted hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                  <Key size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Activate Byte</h2>
                <p className="text-text-muted text-sm">
                  Paste your Anthropic API key below. It's stored locally on your device and never sent to our servers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Anthropic API Key</label>
                  <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!key.trim()}
                  className="w-full py-6 text-base font-black shadow-xl shadow-primary/20 gap-2"
                >
                  <Save size={18} /> Save & Activate
                </Button>

                <p className="text-[10px] text-center text-text-muted font-medium pt-2">
                  Don't have a key? You can get one for free at <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">console.anthropic.com</a>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
