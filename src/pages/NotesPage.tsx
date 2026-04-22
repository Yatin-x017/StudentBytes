import React, { useState } from 'react';
import {
  FileText,
  Search,
  Trash2,
  Download,
  ExternalLink,
  Calendar,
  Plus,
  BookOpen
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const NotesPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();
  const db = useDatabase(user?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = state.notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteNote = async (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    await db.deleteNote(id);
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
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
                  <button className="p-1.5 hover:text-primary"><ExternalLink size={14} /></button>
                  <button className="p-1.5 hover:text-primary"><Download size={14} /></button>
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
