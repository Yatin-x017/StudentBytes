import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus,
  History,
  MessageSquare,
  Trash2,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { CS_SUBJECTS } from '@/lib/constants';
import { ChatBubble } from '@/components/study/ChatBubble';
import { MessageInput } from '@/components/study/MessageInput';
import { TopicSelector } from '@/components/study/TopicSelector';
import { processFile } from '@/lib/pdfExtractor';

const StudyPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { streamMessage, loading, error } = useAI();
  const { user } = useAuth();
  const db = useDatabase(user?.id || '');
  const location = useLocation();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
     return localStorage.getItem('sb_last_active_session');
  });
  const [selectedSubject, setSelectedSubject] = useState(CS_SUBJECTS[0]);
  const [showToast, setShowToast] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = state.sessions.find(s => s.id === activeSessionId) || null;

  useEffect(() => {
    const s = location.state as { prefillMessage?: string } | null;
    if (s?.prefillMessage && activeSessionId) {
      // auto-send the prefill message as if the user typed it
      handleSendMessage(s.prefillMessage);
      // clear the location state so it doesn't re-fire on re-render
      window.history.replaceState({}, '');
    }
  }, [activeSessionId, location.state]);

  // Handle session selection from navigation or restoration
  useEffect(() => {
    if (location.state && (location.state as any).sessionId) {
      setActiveSessionId((location.state as any).sessionId);
    } else if (!activeSessionId && state.sessions.length > 0) {
      setActiveSessionId(state.sessions[0].id);
    }
  }, [location.state, state.sessions, activeSessionId]);

  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('sb_last_active_session', activeSessionId);
    }
  }, [activeSessionId]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (activeSession?.messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages, loading]);

  // Persist session to DB
  useEffect(() => {
    if (!activeSession || !user) return;
    const timer = setTimeout(() => {
      db.upsertSession(activeSession).catch(console.error);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeSession?.messages.length, activeSession, user, db]);

  const handleNewSession = async () => {
    const id = Date.now().toString();
    const session = {
      id,
      topic: 'New Study Session',
      subjectId: selectedSubject.toLowerCase(),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    dispatch({ type: 'ADD_SESSION', payload: session });
    setActiveSessionId(id);
    await db.upsertSession(session);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || loading || !state.apiKey) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = Date.now().toString();
      dispatch({
        type: 'ADD_SESSION',
        payload: {
          id: sessionId,
          topic: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
          subjectId: selectedSubject.toLowerCase(),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      });
      setActiveSessionId(sessionId);
    }

    await streamMessage(sessionId, message);
    // scroll to bottom to make error visible if one occurred or for long streams
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveNote = (content: string) => {
    const title = content.split(' ').slice(0, 6).join(' ') + '...';
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        id: Date.now().toString(),
        title,
        content,
        topic: activeSession?.attachedFile?.name || selectedSubject,
        createdAt: Date.now()
      }
    });
    setShowToast(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSession) return;

    setUploading(true);
    setUploadError(null);

    try {
      const extracted = await processFile(file);

      // Attach file to current session
      const updatedSession = {
        ...activeSession,
        attachedFile: extracted,
        topic: file.name.replace(/\.[^/.]+$/, ''), // use filename as topic
      };
      dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
      await db.upsertSession(updatedSession);

      // Auto-send an opening message
      await handleSendMessage(
        `I've uploaded "${file.name}" (${extracted.pageCount} pages).
         Please give me a brief summary of the key topics covered.`
      );
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process file');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_SESSION', payload: id });
    await db.deleteSession(id);
    if (activeSessionId === id) {
      const nextId = state.sessions.find(s => s.id !== id)?.id || null;
      setActiveSessionId(nextId);
      if (nextId) localStorage.setItem('sb_last_active_session', nextId);
      else localStorage.removeItem('sb_last_active_session');
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] lg:h-[calc(100vh-140px)] gap-6 animate-fade-in overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex flex-col gap-4 hidden lg:flex">
        <Button onClick={handleNewSession} className="w-full justify-start gap-2 py-6 text-base shadow-lg shadow-primary/20">
          <Plus size={20} /> New Byte
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <div className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-text-muted uppercase tracking-widest">
            <History size={14} /> Recent Bytes
          </div>

          {state.sessions.length === 0 ? (
            <div className="px-4 py-8 text-center bg-surface rounded-2xl border border-dashed border-white/5">
              <p className="text-xs text-text-muted">No sessions yet. Ask Byte anything!</p>
            </div>
          ) : (
            state.sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`
                  group relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border
                  ${activeSessionId === session.id
                    ? 'bg-primary/10 border-primary/20 text-white shadow-sm'
                    : 'bg-surface border-transparent hover:border-white/10 text-text-muted hover:text-white'}
                `}
              >
                <MessageSquare size={16} className={activeSessionId === session.id ? 'text-primary' : 'text-text-muted'} />
                <span className="text-sm font-medium truncate flex-1">{session.topic}</span>
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-error transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <Card className="p-4 border-white/5 bg-gradient-to-br from-surface to-surface/50">
          <TopicSelector
            selectedTopic={selectedSubject}
            onSelect={setSelectedSubject}
          />
        </Card>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col glass-card border-white/5 overflow-hidden rounded-3xl relative">
        <header className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
              B
            </div>
            <div>
              <h2 className="font-bold text-sm">Byte AI</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                <span className="text-[10px] text-success font-bold uppercase tracking-tighter">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !activeSessionId}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5
                        hover:bg-white/10 border border-white/10 text-xs font-bold
                        transition-all disabled:opacity-50"
            >
              {uploading ? <Spinner size={12} /> : <Paperclip size={14} />}
              {uploading ? 'Reading...' : 'Upload PDF'}
            </button>
            <Badge className="text-[10px] border-white/10 font-bold uppercase tracking-tight">
              {selectedSubject}
            </Badge>
          </div>
        </header>

        {activeSession?.attachedFile && (
          <div className="px-4 py-2 bg-primary/5 border-b border-white/5
                          flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              <span className="text-xs font-bold text-primary">
                {activeSession.attachedFile.name}
              </span>
              <span className="text-[10px] text-text-muted">
                {activeSession.attachedFile.pageCount} pages ·
                {activeSession.attachedFile.sizeKb}KB
              </span>
            </div>
            <button
              onClick={() => {
                const updated = { ...activeSession };
                delete updated.attachedFile;
                dispatch({ type: 'UPDATE_SESSION', payload: updated });
                db.upsertSession(updated);
              }}
              className="text-[10px] text-text-muted hover:text-error transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-error px-4 py-2 bg-error/5 border-b border-error/10 flex items-center gap-2">
            <AlertCircle size={12} /> {uploadError}
          </p>
        )}

        <div
          className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-gradient-to-b from-transparent to-black/10"
        >
          {!activeSession || activeSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary animate-float">
                <Sparkles size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Master any topic.</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  I'm Byte, your CS study partner. Ask me to explain a concept, debug code, or create a study plan.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                <button
                  onClick={() => handleSendMessage("Explain Dijkstra's Algorithm using a real-world analogy")}
                  className="p-3 text-xs font-medium text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all flex items-center justify-between group"
                >
                  <span>"Explain Dijkstra's Algorithm with an analogy"</span>
                  <Zap size={14} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
                <button
                  onClick={() => handleSendMessage("How do B-Trees optimize database queries?")}
                  className="p-3 text-xs font-medium text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all flex items-center justify-between group"
                >
                  <span>"How do B-Trees optimize DB queries?"</span>
                  <Zap size={14} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
                <Button
                  variant="secondary"
                  onClick={() => handleSendMessage("Give me a crash course on Memory Management in Operating Systems.")}
                  className="w-full justify-center gap-2 mt-2 py-5 text-xs font-black uppercase tracking-widest"
                >
                  <Sparkles size={16} /> Try with example
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {activeSession.messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <ChatBubble
                      role={msg.role}
                      content={msg.content}
                      onSave={handleSaveNote}
                      isSaved={state.notes.some(n => n.content === msg.content)}
                      isStreaming={loading && idx === activeSession.messages.length - 1 && msg.role === 'assistant'}
                      isError={msg.isError}
                      onRetry={handleSendMessage}
                      retryContent={msg.retryContent}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-surface-2 border border-white/5 text-text p-5 rounded-3xl rounded-tl-none flex items-center gap-3">
                <Spinner size={16} />
                <span className="text-xs font-bold text-text-muted animate-pulse">Byte is thinking...</span>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-error/10 border border-error/20 text-error p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                <AlertCircle size={14} /> {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            >
               <div className="bg-success text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} /> Note saved to Knowledge Base ✓
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="p-4 border-t border-white/5 bg-white/2">
          {activeSession && activeSession.messages.length > 0 && (
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Continue session: {activeSession.topic}
              </div>
            </div>
          )}

          <MessageInput
            onSend={handleSendMessage}
            disabled={loading || !state.apiKey}
            placeholder={state.apiKey ? "Ask Byte anything..." : "API key required to study..."}
          />

          <p className="text-[10px] text-center text-text-muted mt-3 font-medium flex items-center justify-center gap-1">
            <Zap size={10} className="text-amber-500" /> Byte is here to help, but always double-check important code.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default StudyPage;
