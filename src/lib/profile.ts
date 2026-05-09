import { supabase } from './supabase';
import type { Profile } from './types';

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  return data;
}

export async function upsertProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function checkUsernameAvailable(
  username: string
): Promise<boolean> {
  if (!supabase) return true;
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();
  return !data;
}

export async function getTopProfiles(limit = 20): Promise<Profile[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('leaderboard_entries')
    .select('*, profiles(*)')
    .order('total_xp', { ascending: false })
    .limit(limit);
  return data?.map(d => (d as any).profiles).filter(Boolean) || [];
}
