import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/context/AppContext';
import type { Session } from '@/lib/types';

export function useRealtime(userId: string | undefined) {
  const { dispatch } = useAppContext();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user-${userId}`)

      // Session changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sessions',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        if (payload.eventType === 'DELETE') {
          dispatch({ type: 'DELETE_SESSION', payload: payload.old.id });
        } else {
          const row = payload.new as any;
          const session: Session = {
            id: row.id,
            topic: row.topic,
            subjectId: row.subject_id,
            messages: row.messages,
            createdAt: new Date(row.created_at).getTime(),
            updatedAt: new Date(row.updated_at).getTime(),
          };
          dispatch({ type: 'UPSERT_SESSION', payload: session });
        }
      })

      // Note changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        if (payload.eventType === 'DELETE') {
          dispatch({ type: 'DELETE_NOTE', payload: payload.old.id });
        } else if (payload.eventType === 'INSERT') {
          const row = payload.new as any;
          dispatch({ type: 'ADD_NOTE', payload: {
            id: row.id,
            title: row.title,
            content: row.content,
            topic: row.topic,
            createdAt: new Date(row.created_at).getTime(),
          }});
        }
      })

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, dispatch]);
}
