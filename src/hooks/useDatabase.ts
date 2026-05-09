import { useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Session, Note, DbSession, DbNote, UserSettings } from '@/lib/types';
import type { SRCard } from '@/lib/spacedRepetition';

export function useDatabase(userId: string) {

  // ── SESSIONS ──
  const fetchSessions = useCallback(async (): Promise<Session[]> => {
    if (!userId || !isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data as DbSession[]).map(d => ({
      id: d.id,
      topic: d.topic,
      subjectId: d.subject_id,
      messages: d.messages,
      createdAt: new Date(d.created_at).getTime(),
      updatedAt: new Date(d.updated_at).getTime(),
    }));
  }, [userId]);

  const upsertSession = useCallback(async (session: Session) => {
    if (!userId || !isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.from('sessions').upsert({
      id: session.id,
      user_id: userId,
      topic: session.topic,
      subject_id: session.subjectId,
      messages: session.messages,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }, [userId]);

  const deleteSession = useCallback(async (id: string) => {
    if (!userId || !isSupabaseConfigured || !supabase) return;
    const { error } = await supabase
      .from('sessions').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
  }, [userId]);

  // ── NOTES ──
  const fetchNotes = useCallback(async (): Promise<Note[]> => {
    if (!userId || !isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as DbNote[]).map(d => ({
      id: d.id,
      title: d.title,
      content: d.content,
      topic: d.topic,
      createdAt: new Date(d.created_at).getTime(),
    }));
  }, [userId]);

  const insertNote = useCallback(async (note: Note) => {
    if (!userId || !isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.from('notes').insert({
      id: note.id,
      user_id: userId,
      title: note.title,
      content: note.content,
      topic: note.topic,
    });
    if (error) throw error;
  }, [userId]);

  const deleteNote = useCallback(async (id: string) => {
    if (!userId || !isSupabaseConfigured || !supabase) return;
    const { error } = await supabase
      .from('notes').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
  }, [userId]);

  // ── QUIZ HISTORY ──
  const insertQuizResult = useCallback(async (
    topic: string, score: number, total: number, xpEarned: number
  ) => {
    if (!userId || !isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.from('quiz_history').insert({
      user_id: userId,
      topic,
      score,
      total,
      xp_earned: xpEarned,
      created_at: new Date().toISOString(),
    });
    if (error) throw error;
  }, [userId]);

  const fetchQuizHistory = useCallback(async () => {
    if (!userId || !isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('quiz_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }, [userId]);

  // ── USER SETTINGS ──
  const fetchSettings = useCallback(async () => {
    if (!userId || !isSupabaseConfigured || !supabase) return null;
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data;
  }, [userId]);

  const upsertSettings = useCallback(async (settings: Partial<UserSettings>) => {
    if (!userId || !isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.from('user_settings').upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }, [userId]);

  // ── SPACED REPETITION ──
  const fetchSRCards = useCallback(async (): Promise<SRCard[]> => {
    if (!userId || !isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('spaced_repetition')
      .select('*')
      .eq('user_id', userId)
      .order('next_review_date', { ascending: true });
    if (error) throw error;
    return data.map((d: any) => ({
      id: d.id,
      topic: d.topic,
      easeFactor: d.ease_factor,
      intervalDays: d.interval_days,
      repetitions: d.repetitions,
      nextReviewDate: d.next_review_date,
      lastScore: d.last_score,
    }));
  }, [userId]);

  const upsertSRCard = useCallback(async (card: SRCard) => {
    if (!userId || !isSupabaseConfigured || !supabase) return;
    const { error } = await supabase.from('spaced_repetition').upsert({
      id: card.id,
      user_id: userId,
      topic: card.topic,
      ease_factor: card.easeFactor,
      interval_days: card.intervalDays,
      repetitions: card.repetitions,
      next_review_date: card.nextReviewDate,
      last_score: card.lastScore,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }, [userId]);

  return {
    fetchSessions, upsertSession, deleteSession,
    fetchNotes, insertNote, deleteNote,
    insertQuizResult, fetchQuizHistory,
    fetchSettings, upsertSettings,
    fetchSRCards, upsertSRCard,
  };
}
