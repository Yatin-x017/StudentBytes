import React, { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Input } from './Input';
import { CS_SUBJECTS } from '@/lib/constants';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { title: string; content: string; topic: string }) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState(CS_SUBJECTS[0]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content, topic });
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-2xl bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-xl font-bold">Create New Note</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-full transition-colors text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Paxos Consensus Simplified"
                  className="bg-surface-2 border-border focus:border-primary/50 text-lg font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  {CS_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here... (Markdown supported)"
                  className="w-full h-64 bg-surface-2 border border-border rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-medium leading-relaxed"
                />
              </div>
            </div>

            <div className="p-6 border-t border-border bg-surface-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} className="gap-2" disabled={!title.trim() || !content.trim()}>
                <Save size={18} /> Save Note
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
