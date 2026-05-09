import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  AlertCircle,
  MessageCircle,
  Shield,
  Clock,
  Loader2,
  Info,
} from 'lucide-react';
import { useChatRoom, type ChatMessage } from '@/hooks/useChatRoom';
import { formatRelativeTime, MAX_MESSAGE_LENGTH } from '@/lib/chatUtils';
import { useAuth } from '@/context/AuthContext';

// ─── Message Bubble ──────────────────────────────────────────────────────────

const MessageBubble: React.FC<{
  msg: ChatMessage;
  isOwn: boolean;
}> = ({ msg, isOwn }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.2 }}
    className={`flex gap-3 items-start group ${isOwn ? 'flex-row-reverse' : ''}`}
  >
    {/* Avatar */}
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm"
      style={{ backgroundColor: msg.anon_color }}
    >
      {msg.anon_name.slice(-2).toUpperCase()}
    </div>

    {/* Content */}
    <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[10px] font-black uppercase tracking-wider ${
          isOwn ? 'text-primary' : 'text-text-muted'
        }`}>
          {isOwn ? 'You' : msg.anon_name}
        </span>
        <span className="text-[9px] text-text-faint opacity-0 group-hover:opacity-100 transition-opacity">
          {formatRelativeTime(msg.created_at)}
        </span>
      </div>
      <div
        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
          isOwn
            ? 'bg-primary text-white rounded-tr-md'
            : 'bg-surface-2 text-text border border-border rounded-tl-md'
        }`}
      >
        {msg.content}
      </div>
    </div>
  </motion.div>
);

// ─── Chat Room Component ─────────────────────────────────────────────────────

const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const {
    messages,
    loading,
    sending,
    error,
    rateLimited,
    sendMessage,
    anonName,
    anonColor,
    clearError,
  } = useChatRoom();

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || rateLimited) return;
    const content = input.trim();
    setInput('');
    const success = await sendMessage(content);
    if (!success) {
      setInput(content); // Restore on failure
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = input.length;
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <MessageCircle size={28} className="text-primary" />
        </div>
        <h3 className="text-lg font-bold">Sign in to chat</h3>
        <p className="text-text-muted text-sm max-w-xs">
          Join the global student chat to connect anonymously with other learners.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-320px)] min-h-[400px] max-h-[700px]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold text-text-muted">
              Global Chat
            </span>
          </div>
          <span className="text-[9px] text-text-faint">•</span>
          <span className="text-[10px] text-text-faint">
            {messages.length} messages
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black text-white"
            style={{ backgroundColor: anonColor }}
          >
            {anonName.slice(-2).toUpperCase()}
          </div>
          <span className="text-[10px] font-bold text-text-muted">
            {anonName}
          </span>
        </div>
      </div>

      {/* Moderation notice */}
      <div className="flex items-center gap-2 px-4 py-2 bg-surface-2/50 border-b border-border text-[10px] text-text-faint">
        <Shield size={10} className="text-primary shrink-0" />
        <span>Anonymous chat with content moderation. Be respectful.</span>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl shimmer shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="w-20 h-3 shimmer rounded-full" />
                  <div className="w-[60%] h-8 shimmer rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
              <MessageCircle size={28} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-text">No messages yet</p>
              <p className="text-xs text-text-muted mt-1">
                Be the first to say something!
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isOwn={msg.user_id === user.id}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-error-light border-t border-error/20 flex items-center gap-2"
          >
            <AlertCircle size={12} className="text-error shrink-0" />
            <span className="text-xs text-error font-medium">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-[10px] text-error/60 hover:text-error font-bold"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="p-3 border-t border-border bg-surface/50 rounded-b-2xl">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={rateLimited ? 'Slow down…' : 'Type a message…'}
              disabled={sending || rateLimited}
              maxLength={MAX_MESSAGE_LENGTH + 50}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm pr-16
                         disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {/* Character counter */}
            {charCount > 0 && (
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${
                  isOverLimit ? 'text-error' : 'text-text-faint'
                }`}
              >
                {charCount}/{MAX_MESSAGE_LENGTH}
              </span>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || sending || rateLimited || isOverLimit}
            className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center
                       text-white shadow-md shadow-primary/20 transition-all
                       hover:scale-105 active:scale-95
                       disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : rateLimited ? (
              <Clock size={16} />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {/* Rate limit indicator */}
        <AnimatePresence>
          {rateLimited && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 mt-2 px-1"
            >
              <Info size={10} className="text-warning" />
              <span className="text-[10px] text-warning font-medium">
                Please wait a moment before sending again
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatRoom;
