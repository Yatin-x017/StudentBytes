import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Crown, Medal, Zap, Brain, BookOpen,
  Search, RefreshCw, ExternalLink, Star, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { ROUTES } from '@/lib/constants';

// ─── Types ───────────────────────────────────────────────────────────────────

type SortKey = 'xp' | 'quizzes' | 'sessions';

interface LeaderboardEntry {
  user_id: string;
  username?: string;
  display_name: string;
  avatar_url?: string;
  college?: string;
  year?: number;
  branch?: string;
  total_xp: number;
  quizzes_taken: number;
  avg_score: number;
  study_sessions: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { key: SortKey; label: string; icon: React.ElementType }[] = [
  { key: 'xp',       label: 'XP',       icon: Zap      },
  { key: 'quizzes',  label: 'Quizzes',  icon: Brain    },
  { key: 'sessions', label: 'Sessions', icon: BookOpen },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown  size={18} className="text-warning"     />;
  if (rank === 2) return <Medal  size={18} className="text-slate-400"   />;
  if (rank === 3) return <Medal  size={18} className="text-amber-600"   />;
  return (
    <span className="text-xs font-black text-text-muted w-5 text-center">
      #{rank}
    </span>
  );
};

const getValue = (e: LeaderboardEntry, sortBy: SortKey) => {
  if (sortBy === 'xp')      return `${e.total_xp?.toLocaleString() ?? 0} XP`;
  if (sortBy === 'quizzes') return `${e.quizzes_taken ?? 0} quizzes`;
  return `${e.study_sessions ?? 0} sessions`;
};

const Avatar: React.FC<{ entry: LeaderboardEntry; size?: 'sm' | 'md' }> = ({
  entry, size = 'md',
}) => {
  const dim   = size === 'md' ? 'w-10 h-10' : 'w-12 h-12';
  const round = size === 'md' ? 'rounded-xl' : 'rounded-2xl';
  const text  = size === 'md' ? 'text-sm'    : 'text-lg';

  return entry.avatar_url ? (
    <img
      src={entry.avatar_url}
      alt=""
      className={`${dim} ${round} object-cover shrink-0 ${
        size === 'md' ? '' : 'ring-2 ring-primary/20'
      }`}
    />
  ) : (
    <div
      className={`${dim} ${round} gradient-primary flex items-center
                  justify-center text-white font-black ${text} shrink-0`}
    >
      {entry.display_name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const CommunityPage: React.FC = () => {
  const { user }   = useAuth();
  const { state }  = useAppContext();
  const navigate   = useNavigate();

  const [entries,    setEntries]    = useState<LeaderboardEntry[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy,     setSortBy]     = useState<SortKey>('xp');
  const [search,     setSearch]     = useState('');
  const [syncing,    setSyncing]    = useState(false);

  // ── Upsert current user into leaderboard ──────────────────────────────────
  const syncCurrentUser = useCallback(async () => {
    if (!supabase || !user) return;
    setSyncing(true);
    try {
      // Fetch latest profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url, college, year, branch')
        .eq('id', user.id)
        .single();

      await supabase.from('leaderboard_entries').upsert(
        {
          user_id:        user.id,
          username:       profile?.username       ?? null,
          display_name:   profile?.display_name   ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Anonymous',
          avatar_url:     profile?.avatar_url     ?? user.user_metadata?.avatar_url ?? null,
          college:        profile?.college        ?? null,
          year:           profile?.year           ?? null,
          branch:         profile?.branch         ?? null,
          total_xp:       state.user.xp,
          study_sessions: state.sessions.length,
          updated_at:     new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    } catch (err) {
      console.error('Leaderboard sync error:', err);
    } finally {
      setSyncing(false);
    }
  }, [user, state.user.xp, state.sessions.length]);

  // ── Fetch leaderboard ─────────────────────────────────────────────────────
  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      if (!supabase) {
        // Offline / no Supabase — show only current user
        setEntries([
          {
            user_id:        user?.id ?? 'local',
            display_name:   user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'You',
            avatar_url:     user?.user_metadata?.avatar_url ?? '',
            total_xp:       state.user.xp,
            quizzes_taken:  0,
            avg_score:      0,
            study_sessions: state.sessions.length,
          },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEntries(data ?? []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, state.user.xp, state.sessions.length]);

  // ── On mount: sync user then load leaderboard ─────────────────────────────
  useEffect(() => {
    (async () => {
      await syncCurrentUser();
      await load();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = entries
    .filter(e => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        e.display_name?.toLowerCase().includes(q) ||
        e.username?.toLowerCase().includes(q) ||
        e.college?.toLowerCase().includes(q) ||
        e.branch?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'xp')      return b.total_xp       - a.total_xp;
      if (sortBy === 'quizzes') return b.quizzes_taken   - a.quizzes_taken;
      return                           b.study_sessions  - a.study_sessions;
    });

  const myEntry = entries.find(e => e.user_id === user?.id);
  const myRank  = filtered.findIndex(e => e.user_id === user?.id) + 1;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-reveal">

      {/* ── Header ── */}
      <div className="text-center space-y-3 pt-4">
        <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center mx-auto shadow-lg">
          <Trophy size={28} className="text-warning" />
        </div>
        <h1 className="text-4xl font-display font-black gradient-text">
          Community
        </h1>
        <p className="text-text-muted text-sm">
          Top learners on Student Bytes
        </p>
      </div>

      {/* ── Your stats card ── */}
      <div className="glass rounded-3xl p-5 border border-primary/15 shadow-lg">
        <div className="flex items-center gap-4">
          <Avatar
            entry={{
              user_id:        user?.id ?? '',
              display_name:   myEntry?.display_name ?? user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'You',
              avatar_url:     myEntry?.avatar_url   ?? user?.user_metadata?.avatar_url,
              total_xp:       state.user.xp,
              quizzes_taken:  myEntry?.quizzes_taken  ?? 0,
              avg_score:      myEntry?.avg_score       ?? 0,
              study_sessions: myEntry?.study_sessions  ?? state.sessions.length,
            }}
            size="md"
          />

          <div className="flex-1 min-w-0">
            <p className="font-black text-text truncate">
              {myEntry?.display_name ?? user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'You'}
            </p>
            {myEntry?.college && (
              <p className="text-[11px] text-text-muted truncate">
                {myEntry.college}
                {myEntry.branch ? ` · ${myEntry.branch}` : ''}
                {myEntry.year   ? ` · Year ${myEntry.year}` : ''}
              </p>
            )}
            {!myEntry?.college && (
              <p className="text-[11px] text-text-muted">Your standing</p>
            )}
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="text-center">
              <p className="text-xl font-black text-primary">{state.user.xp.toLocaleString()}</p>
              <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">XP</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-warning">
                {myRank > 0 ? `#${myRank}` : '—'}
              </p>
              <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">Rank</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-accent-2">{state.sessions.length}</p>
              <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">Sessions</p>
            </div>
          </div>
        </div>

        {/* CTA when user isn't on the board yet */}
        {myRank === 0 && !syncing && (
          <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              Complete a quiz to appear on the leaderboard
            </p>
            <button
              onClick={() => navigate(ROUTES.QUIZ)}
              className="px-4 py-2 rounded-xl gradient-primary text-white text-xs font-bold shadow-md"
            >
              Take a Quiz →
            </button>
          </div>
        )}
        {syncing && (
          <div className="mt-3 pt-3 border-t border-primary/10">
            <p className="text-[11px] text-text-faint text-center animate-pulse">
              Syncing your stats…
            </p>
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, college, branch…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Sort tabs */}
        <div className="flex gap-1 glass rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold
                          transition-all ${
                sortBy === tab.key
                  ? 'gradient-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="p-2.5 rounded-xl glass hover:bg-white/60 text-text-muted hover:text-text transition-all"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ── Leaderboard list ── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 shimmer h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center space-y-4">
          {search ? (
            <>
              <Users size={48} className="text-text-faint mx-auto opacity-30" />
              <p className="font-black text-lg text-text">No matches found</p>
              <p className="text-text-muted text-sm">Try a different name or college.</p>
              <button
                onClick={() => setSearch('')}
                className="px-6 py-3 rounded-xl glass text-text font-bold text-sm mx-auto block"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <Star size={48} className="text-text-faint mx-auto opacity-30" />
              <p className="font-black text-lg text-text">No rankings yet</p>
              <p className="text-text-muted text-sm">
                Be the first! Complete a quiz to appear here.
              </p>
              <button
                onClick={() => navigate(ROUTES.QUIZ)}
                className="px-6 py-3 rounded-xl gradient-primary text-white font-bold text-sm shadow-md mx-auto block"
              >
                Take a Quiz →
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((entry, i) => {
              const rank = i + 1;
              const isMe = entry.user_id === user?.id;

              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass rounded-2xl p-4 flex items-center gap-4 transition-all border ${
                    isMe
                      ? 'border-primary/25 shadow-md shadow-primary/10'
                      : rank <= 3
                      ? 'border-warning/20'
                      : 'border-transparent hover:border-primary/10'
                  } ${entry.username ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() =>
                    entry.username && navigate(`/u/${entry.username}`)
                  }
                >
                  {/* Rank */}
                  <div className="w-7 flex justify-center shrink-0">
                    {getRankIcon(rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar entry={entry} size="md" />

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-text truncate">
                        {entry.display_name}
                      </p>
                      {isMe && (
                        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20
                                         px-1.5 py-0.5 rounded-full font-black shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted truncate">
                      {[
                        entry.college,
                        entry.branch,
                        entry.year ? `Year ${entry.year}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ') ||
                        `${entry.quizzes_taken ?? 0} quizzes · ${entry.study_sessions ?? 0} sessions`}
                    </p>
                  </div>

                  {/* Value */}
                  <p
                    className={`font-black text-sm shrink-0 ${
                      rank === 1 ? 'text-warning'   :
                      rank === 2 ? 'text-slate-500'  :
                      rank === 3 ? 'text-amber-600'  :
                      isMe       ? 'text-primary'    : 'text-text'
                    }`}
                  >
                    {getValue(entry, sortBy)}
                  </p>

                  {/* External link icon */}
                  {entry.username && (
                    <ExternalLink size={13} className="text-text-faint shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <p className="text-center text-[11px] text-text-faint pb-4">
        Rankings update automatically after each session.
      </p>
    </div>
  );
};

export default CommunityPage;
