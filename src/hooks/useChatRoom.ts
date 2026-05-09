import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  generateAnonName,
  generateAnonColor,
  containsProfanity
} from '@/lib/chatUtils';

export interface ChatMessage {
  id: string;
  user_id: string | null;
  anon_name: string;
  anon_color: string;
  content: string;
  is_flagged: boolean;
  created_at: string;
}

export function useChatRoom() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSentAt, setLastSentAt] = useState<number>(0);

  // Fetch initial messages
  useEffect(() => {
    if (!supabase) return;

    const fetchMessages = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (fetchError) throw fetchError;
        // Show in ascending order for chat
        setMessages((data || []).reverse());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!user || !supabase) return;

    // Validations
    if (!content.trim()) return;
    if (content.length > 500) throw new Error('Message too long (max 500 chars)');

    // Rate limiting (3 seconds)
    const now = Date.now();
    if (now - lastSentAt < 3000) {
      throw new Error('Please wait 3 seconds between messages');
    }

    // Profanity filter
    if (containsProfanity(content)) {
      throw new Error('Please keep the conversation respectful');
    }

    try {
      const { error: sendError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          anon_name: generateAnonName(user.id),
          anon_color: generateAnonColor(user.id),
          content: content.trim(),
        });

      if (sendError) throw sendError;
      setLastSentAt(now);
    } catch (err: any) {
      console.error('Chat error:', err);
      throw err;
    }
  }, [user, lastSentAt]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    cooldown: Math.max(0, 3 - Math.floor((Date.now() - lastSentAt) / 1000))
  };
}
