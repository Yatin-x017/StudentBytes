import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Zap,
  FileText,
  GraduationCap,
  Settings,
  TrendingUp,
  Plus
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { label: 'New Study Session', icon: Plus, shortcut: '⌘N', action: () => {
        navigate(ROUTES.STUDY);
        setTimeout(() => window.dispatchEvent(new CustomEvent('new-study-session')), 100);
    }},
    { label: 'Dashboard', icon: LayoutDashboard, shortcut: '⌘1', action: () => navigate(ROUTES.DASHBOARD) },
    { label: 'Study Room', icon: MessageSquare, shortcut: '⌘2', action: () => navigate(ROUTES.STUDY) },
    { label: 'Mastery Quiz', icon: Zap, shortcut: '⌘3', action: () => navigate(ROUTES.QUIZ) },
    { label: 'Knowledge Base', icon: FileText, shortcut: '⌘4', action: () => navigate(ROUTES.NOTES) },
    { label: 'Canvas LMS', icon: GraduationCap, shortcut: '⌘5', action: () => navigate(ROUTES.CANVAS) },
    { label: 'Analytics', icon: TrendingUp, shortcut: '', action: () => navigate(ROUTES.ANALYTICS) },
    { label: 'Settings', icon: Settings, shortcut: '', action: () => navigate(ROUTES.SETTINGS) },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setQuery('');
      setSelectedIndex(0);
    };
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  useEffect(() => {
    if (open) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filtered[selectedIndex]) {
            filtered[selectedIndex].action();
            setOpen(false);
          }
        } else if (e.key === 'Escape') {
          setOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, filtered, selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <Search size={20} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-lg outline-none font-medium placeholder:text-text-muted/50"
              />
              <kbd className="text-[10px] font-black bg-white/5 text-text-muted px-2 py-1 rounded border border-white/10">ESC</kbd>
            </div>

            <div className="py-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-text-muted font-bold">No results for "{query}"</p>
                </div>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.label}
                    onClick={() => {
                      cmd.action();
                      setOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center justify-between px-6 py-4 transition-all text-left group
                              ${selectedIndex === i ? 'bg-primary/10 text-white' : 'text-text-muted hover:text-text'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${selectedIndex === i ? 'bg-primary/20 text-primary' : 'bg-white/5'}`}>
                        <cmd.icon size={18} />
                      </div>
                      <span className="font-bold">{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <kbd className={`text-[10px] font-black px-2 py-1 rounded border
                                     ${selectedIndex === i ? 'bg-primary/20 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-text-muted'}`}>
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-black/20 flex items-center justify-between text-[10px] font-black text-text-muted uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="text-white">↑↓</span> Navigate</span>
                <span className="flex items-center gap-1"><span className="text-white">↵</span> Select</span>
              </div>
              <span>Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
