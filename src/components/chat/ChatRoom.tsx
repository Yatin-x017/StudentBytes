import React, { useState, useRef, useEffect } from 'react';
import { useChatRoom } from '@/hooks/useChatRoom';
import { formatRelativeTime } from '@/lib/chatUtils';
import { Send, Shield, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const { messages, loading, sendMessage, cooldown } = useChatRoom();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || cooldown > 0) return;

    try {
      setError(null);
      await sendMessage(input);
      setInput('');
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-text-muted text-sm font-medium">Entering the commons...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-[600px] bg-surface rounded-[2rem] border border-border overflow-hidden shadow-xl reveal">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-surface-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Global Commons</h3>
            <p className="text-[10px] text-text-muted font-bold">ANONYMOUS & REAL-TIME</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 opacity-50">
            <Info size={32} className="text-text-muted" />
            <p className="text-sm font-medium">The room is quiet. Be the first to speak!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.user_id === user?.id;
            return (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-3",
                  isMe && "flex-row-reverse"
                )}
              >
                <div
                  className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white font-black text-[10px]"
                  style={{ backgroundColor: msg.anon_color }}
                >
                  {msg.anon_name.slice(-2)}
                </div>
                <div className={cn(
                  "max-w-[80%] space-y-1",
                  isMe && "flex flex-col items-end"
                )}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-black uppercase tracking-tight text-text-muted">
                      {msg.anon_name} {isMe && "(You)"}
                    </span>
                    <span className="text-[9px] text-text-faint font-medium">
                      {formatRelativeTime(msg.created_at)}
                    </span>
                  </div>
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                    isMe
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-surface-2 text-text rounded-tl-none border border-border"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-surface-2 border-t border-border">
        <form onSubmit={handleSend} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share something anonymously..."
            maxLength={500}
            disabled={cooldown > 0}
            className="w-full pl-5 pr-24 py-3.5 rounded-2xl bg-surface border border-border focus:border-primary/50 focus:outline-none text-sm transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-black tracking-tighter",
              input.length > 450 ? "text-error" : "text-text-faint"
            )}>
              {input.length}/500
            </span>
            <button
              type="submit"
              disabled={!input.trim() || cooldown > 0}
              className={cn(
                "p-2 rounded-xl transition-all",
                input.trim() && cooldown === 0
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-surface-2 text-text-faint"
              )}
            >
              {cooldown > 0 ? (
                <span className="text-[10px] font-black px-1">{cooldown}s</span>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </form>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-[10px] font-bold text-error text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
