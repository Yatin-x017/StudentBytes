import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled, placeholder }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value);
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  return (
    <div className="relative flex items-end gap-2 bg-surface-2 border border-border rounded-2xl p-2 group transition-all focus-within:border-primary/50 shadow-2xl">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Ask Byte anything..."}
        disabled={disabled}
        className="w-full bg-transparent border-none focus:ring-0 text-base py-3 px-4 resize-none max-h-[200px] text-text placeholder:text-text-muted transition-all"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={cn(
          "flex items-center justify-center w-11 h-11 rounded-xl transition-all shrink-0",
          value.trim() && !disabled ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-bg text-text-muted"
        )}
      >
        <Send size={18} />
      </button>
    </div>
  );
};
