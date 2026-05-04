import React, { useState } from 'react';
import { Key, Save, X, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAnthropicClient } from '@/lib/anthropic';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { state, dispatch } = useAppContext();
  const [key, setKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testError, setTestError] = useState('');

  const provider = state.settings?.provider || 'anthropic';
  const isGemini = provider === 'gemini';

  const handleSave = () => {
    const trimmedKey = key.trim();
    if (!trimmedKey) return;

    if (isGemini) {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: { geminiApiKey: trimmedKey }
      });
    } else {
      dispatch({ type: 'SET_API_KEY', payload: trimmedKey });
    }

    setKey('');
    setTestResult(null);
    onSuccess();
    onClose();
  };

  async function testKey() {
    const trimmedKey = key.trim();
    if (!trimmedKey) return;

    setTesting(true);
    setTestResult(null);
    try {
      if (isGemini) {
        const genAI = new GoogleGenerativeAI(trimmedKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
        await model.generateContent('hi');
      } else {
        const client = getAnthropicClient(trimmedKey);
        await client.messages.create({
          model: 'claude-sonnet-4-5',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'hi' }],
        });
      }
      setTestResult('success');
    } catch (err: any) {
      setTestResult('error');
      setTestError(err.message || 'Invalid key');
    } finally {
      setTesting(false);
    }
  }

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
                  Paste your {isGemini ? 'Gemini' : 'Anthropic'} API key below. It's stored locally on your device and never sent to our servers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">
                    {isGemini ? 'Google Gemini API Key' : 'Anthropic API Key'}
                  </label>
                  <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={isGemini ? "AIza..." : "sk-ant-..."}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={!key.trim() || testing}
                    className="flex-1 py-6 text-sm font-black shadow-xl shadow-primary/20 gap-2"
                  >
                    <Save size={18} /> Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={testKey}
                    disabled={!key.trim() || testing}
                    className="flex-1 py-6 text-sm font-black gap-2"
                  >
                    {testing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                    {testing ? 'Testing...' : 'Test'}
                  </Button>
                </div>

                <AnimatePresence>
                  {testResult === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-bold text-success flex items-center gap-2 justify-center"
                    >
                      <CheckCircle2 size={14} /> Connected!
                    </motion.p>
                  )}
                  {testResult === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-bold text-error flex items-center gap-2 justify-center"
                    >
                      <XCircle size={14} /> {testError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <p className="text-[10px] text-center text-text-muted font-medium pt-2">
                  Don't have a key? You can get one for free at <a href={isGemini ? "https://aistudio.google.com" : "https://console.anthropic.com"} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {isGemini ? "aistudio.google.com" : "console.anthropic.com"}
                  </a>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
