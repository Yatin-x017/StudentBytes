import React, { useState } from 'react';
import { Key, Globe, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { DEFAULT_LANGUAGES, PROVIDERS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [apiKey, setApiKey] = useState(state.apiKey);
  const [geminiApiKey, setGeminiApiKey] = useState(state.settings.geminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSaveKey = () => {
    if (state.settings.provider === 'gemini') {
      dispatch({ type: 'UPDATE_SETTINGS', payload: { geminiApiKey } });
    } else {
      dispatch({ type: 'SET_API_KEY', payload: apiKey });
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleLanguageChange = (lang: string) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { defaultLanguage: lang as any } });
  };

  const handleClearData = () => {
    localStorage.clear();
    dispatch({ type: 'CLEAR_DATA' });
    setShowClearModal(false);
    setApiKey('');
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-success text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> API key saved ✓
          </motion.div>
        )}
      </AnimatePresence>

      <header>
        <h1 className="text-3xl font-black tracking-tight mb-2">Settings</h1>
        <p className="text-text-muted">Configure your study assistant and manage your data.</p>
      </header>

      <section className="space-y-6">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Key size={20} />
            </div>
            <h2 className="text-xl font-bold">Model Provider</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {PROVIDERS.map((p) => (
              <div
                key={p.id}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { provider: p.id as any } })}
                className={cn(
                  "cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col relative overflow-hidden group",
                  state.settings.provider === p.id
                    ? 'border-primary bg-primary/5'
                    : 'border-white/5 bg-surface hover:border-white/10'
                )}
              >
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="font-bold text-sm tracking-tight">{p.name}</span>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                    p.badge === 'Free'
                      ? 'bg-success/20 text-success'
                      : 'bg-amber-500/20 text-amber-400'
                  )}>{p.badge}</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed mb-4 relative z-10">{p.description}</p>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline mt-auto relative z-10"
                  onClick={e => e.stopPropagation()}
                >
                  {p.linkLabel}
                  <ExternalLink size={10} />
                </a>

                {state.settings.provider === p.id && (
                  <div className="absolute top-2 right-2 flex justify-end mt-2">
                    <CheckCircle2 size={16} className="text-primary" />
                  </div>
                )}

                {/* Decorative background glow */}
                {state.settings.provider === p.id && (
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/20 blur-3xl rounded-full" />
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted">API Configuration</h3>
              {(state.settings.provider === 'gemini' ? state.settings.geminiApiKey : state.apiKey) && (
                <Badge variant="success" className="ml-auto">
                  <CheckCircle2 size={12} className="mr-1" /> Connected
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  label={state.settings.provider === 'gemini' ? "Google Gemini API Key" : "Anthropic API Key"}
                  type={showKey ? 'text' : 'password'}
                  value={state.settings.provider === 'gemini' ? geminiApiKey : apiKey}
                  onChange={(e) => state.settings.provider === 'gemini' ? setGeminiApiKey(e.target.value) : setApiKey(e.target.value)}
                  placeholder={state.settings.provider === 'gemini' ? "Paste Gemini key..." : "sk-ant-api..."}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-[34px] text-text-muted hover:text-text transition-colors"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="text-xs text-text-muted">
                Your key is stored locally in your browser. Get one at{' '}
                <a
                  href={state.settings.provider === 'gemini' ? "https://aistudio.google.com/" : "https://console.anthropic.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {state.settings.provider === 'gemini' ? "aistudio.google.com" : "console.anthropic.com"}
                </a>
              </p>

              <Button onClick={handleSaveKey} className="w-full md:w-auto py-6 px-8 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs">
                Save {state.settings.provider === 'gemini' ? 'Gemini' : 'Anthropic'} Key
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-bold">Study Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-muted">Default Programming Language</label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-bold border transition-all focus-ring',
                      state.settings.defaultLanguage === lang
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'border-border text-text-muted hover:border-text hover:text-text'
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-error/20 bg-error/5">
          <div className="flex items-center gap-3 mb-6 text-error">
            <Trash2 size={20} />
            <h2 className="text-xl font-bold">Danger Zone</h2>
          </div>

          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            Permanently delete all your study history, saved notes, and API key. This action cannot be undone.
          </p>

          <Button
            variant="danger"
            onClick={() => setShowClearModal(true)}
          >
            Clear All Data
          </Button>
        </Card>
      </section>

      {showClearModal && (
        <Modal
          title="Clear all data?"
          onClose={() => setShowClearModal(false)}
          confirmLabel="Yes, Clear Everything"
          onConfirm={handleClearData}
          confirmVariant="danger"
        >
          <div className="flex gap-4">
            <div className="p-3 bg-error/10 rounded-full h-fit text-error">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="font-bold mb-1">Are you absolutely sure?</p>
              <p className="text-sm text-text-muted">
                This will wipe your localStorage and reset the app. You will lose all your notes and sessions.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SettingsPage;
