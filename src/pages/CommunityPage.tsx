import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Crown, Medal, Zap, Brain, BookOpen,
  Search, RefreshCw, ExternalLink, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { ROUTES } from '@/lib/constants';

type SortKey = 'xp' | 'quizzes' | 'sessions';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string;
  total_xp: number;
  quizzes_taken: number;
  avg_score: number;
  study_sessions: number;
  username?: string;
}

const TABS: { key: SortKey; label: string; icon: any }[] = [
  { key: 'xp', label: 'XP', icon: Zap },
  { key: 'quizzes', label: 'Quizzes', icon: Brain },
  { key: 'sessions', label: 'Sessions', icon: BookOpen },
];

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('xp');
  const [search, setSearch] = useState('');

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      if (!supabase) {
        // No Supabase — show current user only
        setEntries([{
          user_id: user?.id || 'local',
          display_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You',
          avatar_url: user?.user_metadata?.avatar_url || '',
          total_xp: state.user.xp,
          quizzes_taken: 0,
          avg_score: 0,
          study_sessions: state.sessions.length,
        }]);
        return;
      }
      const { data } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(50);
      setEntries(data || []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = entries
    .filter(e =>
      !search ||
      e.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.username?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'xp') return b.total_xp - a.total_xp;
      if (sortBy === 'quizzes') return b.quizzes_taken - a.quizzes_taken;
      return b.study_sessions - a.study_sessions;
    });

  const myRank = filtered.findIndex(e => e.user_id === user?.id) + 1;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={18} className="text-warning" />;
    if (rank === 2) return <Medal size={18} className="text-slate-400" />;
    if (rank === 3) return <Medal size={18} className="text-amber-600" />;
    return <span className="text-xs font-black text-text-muted w-5 text-center">#{rank}</span>;
  };

  const getValue = (e: LeaderboardEntry) => {
    if (sortBy === 'xp') return `${e.total_xp?.toLocaleString() || 0} XP`;
    if (sortBy === 'quizzes') return `${e.quizzes_taken || 0} quizzes`;
    return `${e.study_sessions || 0} sessions`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-reveal">
      {/* Header */}
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

      {/* Your stats card */}
      <div className="glass rounded-3xl p-5 border border-primary/15 shadow-lg">
        <div className="flex items-center gap-4">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center
                            justify-center text-white font-black text-lg shrink-0">
              {(user?.user_metadata?.full_name || user?.email || 'S')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-black text-text truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You'}
            </p>
            <p className="text-[11px] text-text-muted">Your standing</p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <div className="text-center">
              <p className="text-xl font-black text-primary">{state.user.xp}</p>
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
        {myRank === 0 && (
          <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between">
            <p className="text-xs text-text-muted">Complete a quiz to appear on the leaderboard</p>
            <button
              onClick={() => navigate(ROUTES.QUIZ)}
              className="px-4 py-2 rounded-xl gradient-primary text-white text-xs font-bold shadow-md"
            >
              Take a Quiz →
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
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
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="p-2.5 rounded-xl glass hover:bg-white/60 text-text-muted hover:text-text transition-all"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 shimmer h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center space-y-4">
          <Star size={48} className="text-text-faint mx-auto opacity-30" />
          <p className="font-black text-lg text-text">No rankings yet</p>
          <p className="text-text-muted text-sm">Be the first! Complete a quiz to appear here.</p>
          <button
            onClick={() => navigate(ROUTES.QUIZ)}
            className="px-6 py-3 rounded-xl gradient-primary text-white font-bold text-sm shadow-md mx-auto block"
          >
            Take a Quiz →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry, i) => {
            const rank = i + 1;
            const isMe = entry.user_id === user?.id;

            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass rounded-2xl p-4 flex items-center gap-4 transition-all
                            border cursor-default ${
                  isMe
                    ? 'border-primary/25 shadow-md shadow-primary/10'
                    : rank <= 3
                    ? 'border-warning/20'
                    : 'border-transparent hover:border-primary/10'
                }`}
                onClick={() => entry.username && navigate(`/u/${entry.username}`)}
                style={{ cursor: entry.username ? 'pointer' : 'default' }}
              >
                <div className="w-7 flex justify-center shrink-0">
                  {getRankIcon(rank)}
                </div>

                {entry.avatar_url ? (
                  <img
                    src={entry.avatar_url}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center
                                  justify-center text-white font-black text-sm shrink-0">
                    {entry.display_name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-text truncate">{entry.display_name}</p>
                    {isMe && (
                      <span className="text-[9px] bg-primary/10 text-primary border border-primary/20
                                       px-1.5 py-0.5 rounded-full font-black shrink-0">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted">
                    {entry.quizzes_taken || 0} quizzes · {entry.study_sessions || 0} sessions
                  </p>
                </div>

                <p className={`font-black text-sm shrink-0 ${
                  rank === 1 ? 'text-warning' :
                  rank === 2 ? 'text-slate-500' :
                  rank === 3 ? 'text-amber-600' :
                  isMe ? 'text-primary' : 'text-text'
                }`}>
                  {getValue(entry)}
                </p>

                {entry.username && (
                  <ExternalLink size={13} className="text-text-faint shrink-0" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <p className="text-center text-[11px] text-text-faint pb-4">
        Rankings update after each quiz session.
      </p>
    </div>
  );
};

export default CommunityPage;