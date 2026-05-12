import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  generateAnonName,
  generateAnonColor,
  containsProfanity,
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

const COOLDOWN_SECONDS = 3;

export function useChatRoom() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch initial messages + realtime subscription ──────────────────
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Chat unavailable — Supabase not configured.');
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('is_flagged', false)
          .order('created_at', { ascending: false })
          .limit(100);

        if (fetchError) {
          // Table likely doesn't exist yet
          if (fetchError.code === '42P01') {
            setError('Chat table not set up. Run the SQL schema in Supabase.');
          } else {
            setError(fetchError.message);
          }
          return;
        }

        setMessages((data || []).reverse());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        payload => {
          const msg = payload.new as ChatMessage;
          if (!msg.is_flagged) {
            setMessages(prev => {
              // Avoid duplicate messages
              if (prev.some(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Cooldown timer ───────────────────────────────────────────────────
  const startCooldown = useCallback(() => {
    setCooldown(COOLDOWN_SECONDS);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // ── Send message ─────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user) throw new Error('You must be signed in to chat.');
      if (!supabase) throw new Error('Supabase not configured.');
      if (!content.trim()) return;
      if (content.length > 500) throw new Error('Message too long (max 500 chars).');
      if (cooldown > 0) throw new Error(`Please wait ${cooldown}s before sending again.`);
      if (containsProfanity(content)) throw new Error('Please keep the conversation respectful.');

      const { error: sendError } = await supabase.from('chat_messages').insert({
        user_id: user.id,
        anon_name: generateAnonName(user.id),
        anon_color: generateAnonColor(user.id),
        content: content.trim(),
        is_flagged: false,
      });

      if (sendError) throw new Error(sendError.message);
      startCooldown();
    },
    [user, cooldown, startCooldown]
  );

  return { messages, loading, error, sendMessage, cooldown };
}
