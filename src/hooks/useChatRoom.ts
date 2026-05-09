import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  generateAnonName,
  generateAnonColor,
  validateMessage,
  RATE_LIMIT_MS,
} from '@/lib/chatUtils';

export interface ChatMessage {
  id: string;
  user_id: string;
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const lastSentRef = useRef<number>(0);
  const channelRef = useRef<any>(null);

  const anonName = user ? generateAnonName(user.id) : 'Anonymous';
  const anonColor = user ? generateAnonColor(user.id) : '#7c6af7';

  // ── Fetch recent messages ──
  const fetchMessages = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('is_flagged', false)
        .order('created_at', { ascending: true })
        .limit(200);

      if (fetchError) throw fetchError;
      setMessages(data ?? []);
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Setup realtime subscription ──
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('global-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload: any) => {
          const newMsg = payload.new as ChatMessage;
          if (!newMsg.is_flagged) {
            setMessages(prev => {
              // Prevent duplicate
              if (prev.some(m => m.id === newMsg.id)) return prev;
              // Keep only last 200
              const updated = [...prev, newMsg];
              return updated.slice(-200);
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchMessages]);

  // ── Send message ──
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !supabase || !isSupabaseConfigured) {
      setError('You must be signed in to chat');
      return false;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastSentRef.current < RATE_LIMIT_MS) {
      setRateLimited(true);
      setTimeout(() => setRateLimited(false), RATE_LIMIT_MS - (now - lastSentRef.current));
      return false;
    }

    // Validate
    const validationError = validateMessage(content);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 3000);
      return false;
    }

    setSending(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('chat_messages').insert({
        user_id: user.id,
        anon_name: anonName,
        anon_color: anonColor,
        content: content.trim(),
      });

      if (insertError) throw insertError;
      lastSentRef.current = Date.now();
      return true;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
      return false;
    } finally {
      setSending(false);
    }
  }, [user, anonName, anonColor]);

  return {
    messages,
    loading,
    sending,
    error,
    rateLimited,
    sendMessage,
    anonName,
    anonColor,
    clearError: () => setError(null),
  };
}
