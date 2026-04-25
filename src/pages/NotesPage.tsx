import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Trash2,
  Download,
  ExternalLink,
  Calendar,
  Plus,
  BookOpen,
  HardDriveUpload,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { isGoogleConfigured, initGoogleDrive, exportNoteToDrive } from '@/lib/googleDrive';
import { generateShareUrl } from '@/lib/shareNote';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const NotesPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();
  const db = useDatabase(user?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    if (isGoogleConfigured()) {
      initGoogleDrive().catch(console.error);
    }
  }, []);

  const filteredNotes = state.notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteNote = async (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    if (user?.id) {
      await db.deleteNote(id);
    }
  };

  const handleDownloadNote = (note: any, format: 'md' | 'txt') => {
    const content = format === 'md'
      ? `# ${note.title}\n\n*${note.topic} · ${new Date(note.createdAt).toLocaleDateString()}*\n\n${note.content}`
      : note.content;

    const blob = new Blob([content], {
      type: format === 'md' ? 'text/markdown' : 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareNote = async (note: any) => {
    const url = generateShareUrl(note);
    try {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    } catch (err) {
      window.prompt('Copy this link:', url);
    }
  };

  const handleExportToDrive = async (note: any) => {
    setExportingId(note.id);
    setExportError(null);
    try {
      const url = await exportNoteToDrive(note.title, note.content);
      setExportSuccess(url);
      setTimeout(() => setExportSuccess(null), 5000);
    } catch (err: any) {
      setExportError(err.message || 'Failed to export to Drive');
      setTimeout(() => setExportError(null), 5000);
    } finally {
      setExportingId(null);
    }
  };

  if (state.notes.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Your knowledge base is empty"
        description="Save insights from your study sessions to build your personal library."
        actionLabel="Start a Study Session"
        actionPath={ROUTES.STUDY}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 relative">
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> Share link copied ✓
          </motion.div>
        )}
        {exportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-success text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3"
          >
            <CheckCircle2 size={18} />
            <span>Saved to Drive ✓</span>
            <a href={exportSuccess} target="_blank" rel="noopener noreferrer" className="underline ml-2">Open</a>
          </motion.div>
        )}
        {exportError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-error text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2"
          >
            <AlertCircle size={18} /> {exportError}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My Knowledge Base</h1>
          <p className="text-text-muted">Stored insights and summaries from your study sessions.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
              />
           </div>
           <Button variant="outline" size="icon" className="h-10 w-10">
             <Plus size={20} />
           </Button>
        </div>
      </header>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="p-6 border-white/5 glass-card flex flex-col h-full group hover:border-primary/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <FileText size={20} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {isGoogleConfigured() && (
                    <button
                      onClick={() => handleExportToDrive(note)}
                      disabled={exportingId === note.id}
                      title="Export to Google Drive"
                      className="p-1.5 hover:text-primary disabled:opacity-50"
                    >
                      {exportingId === note.id ? <Spinner size={14} /> : <HardDriveUpload size={14} />}
                    </button>
                  )}
                  <button
                    onClick={() => handleShareNote(note)}
                    title="Copy share link"
                    className="p-1.5 hover:text-primary"
                  >
                    <Share2 size={14} />
                  </button>
                  <button className="p-1.5 hover:text-primary"><ExternalLink size={14} /></button>
                  <div className="relative group/dl">
                    <button
                      className="p-1.5 hover:text-primary transition-all"
                      title="Download note"
                    >
                      <Download size={14} />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-surface-2 border border-white/10 rounded-xl shadow-xl overflow-hidden opacity-0 group-hover/dl:opacity-100 pointer-events-none group-hover/dl:pointer-events-auto transition-all z-10 min-w-[120px]">
                      <button
                        onClick={() => handleDownloadNote(note, 'md')}
                        className="block w-full px-4 py-2 text-[10px] font-bold text-left hover:bg-white/5 uppercase tracking-widest"
                      >
                        Download .md
                      </button>
                      <button
                        onClick={() => handleDownloadNote(note, 'txt')}
                        className="block w-full px-4 py-2 text-[10px] font-bold text-left hover:bg-white/5 uppercase tracking-widest"
                      >
                        Download .txt
                      </button>
                    </div>
                  </div>
                  <button onClick={() => deleteNote(note.id)} className="p-1.5 hover:text-error"><Trash2 size={14} /></button>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 line-clamp-1">{note.title}</h3>
              <p className="text-sm text-text-muted mb-6 flex-1 line-clamp-3 leading-relaxed">
                {note.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <Calendar size={12} /> {formatDate(note.createdAt)}
                </div>
                <Badge className="bg-white/5 text-text-muted border-white/10">{note.topic}</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-text-muted">No notes matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
