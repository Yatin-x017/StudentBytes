import React, { useEffect, useState } from 'react';
import {
  Share2,
  Search,
  TrendingUp,
  Sparkles,
  Zap,
  Trophy,
  Medal,
  Users,
  MessagesSquare,
  Crown,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { ROUTES } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  total_xp: number;
  quizzes_taken: number;
  avg_score: number;
  study_sessions: number;
  username?: string;
}

type SortBy = 'xp' | 'quizzes' | 'sessions';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { state } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'chat' | 'leaderboard'>('leaderboard');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('xp');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async (silent = false) => {
    if (!isSupabaseConfigured || !supabase) {
      setLoadingBoard(false);
      return;
    }
    if (!silent) setLoadingBoard(true);
    else setRefreshing(true);

    try {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (!error && data) setEntries(data);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoadingBoard(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const sorted = [...entries]
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

  const myEntry = sorted.find(e => e.user_id === user?.id);
  const myRank = sorted.findIndex(e => e.user_id === user?.id) + 1;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={16} className="text-amber-400 fill-amber-400" />;
    if (rank === 2) return <Medal size={16} className="text-slate-400" />;
    if (rank === 3) return <Medal size={16} className="text-amber-700" />;
    return <span className="text-sm font-black text-text-muted">#{rank}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 mb-4">
            <Sparkles size={12} className="fill-primary" /> Community
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">The Coder's Commons</h1>
          <p className="text-text-muted">
            Connect with fellow students, compare scores, and master concepts together.
          </p>
        </div>
        {user && (
          <Button
            className="gap-2 shadow-lg shadow-primary/20"
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            <Share2 size={18} /> My Profile
          </Button>
        )}
      </header>

      {/* Tab bar */}
      <div className="flex gap-2 p-1 bg-surface-2 rounded-2xl border border-border w-fit">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
            activeTab === 'leaderboard'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-text-muted hover:text-text hover:bg-surface-3'
          )}
        >
          <Users size={14} /> Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
            activeTab === 'chat'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-text-muted hover:text-text hover:bg-surface-3'
          )}
        >
          <MessagesSquare size={14} /> Global Chat
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <AnimatePresence mode="wait">

            {/* ── CHAT TAB ── */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatRoom />
              </motion.div>
            )}

            {/* ── LEADERBOARD TAB ── */}
            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Your rank card */}
                {user && myEntry && (
                  <Card tinted className="p-4 flex items-center gap-4">
                    <div className="w-8 flex justify-center">{getRankIcon(myRank)}</div>
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt=""
                           className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center
                                      justify-center text-primary font-black text-sm shrink-0">
                        {(user.user_metadata?.full_name || user.email || 'S')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <Badge className="text-[9px] bg-primary/20 text-primary border-primary/20 px-1.5">
                          You
                        </Badge>
                      </div>
                      <p className="text-[11px] text-text-muted">
                        {myEntry.quizzes_taken} quizzes · {myEntry.study_sessions} sessions
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-primary">
                        {myEntry.total_xp.toLocaleString()} XP
                      </p>
                      <p className="text-[10px] text-text-muted">Rank #{myRank}</p>
                    </div>
                  </Card>
                )}

                {/* User not on board yet */}
                {user && !myEntry && !loadingBoard && (
                  <Card className="p-4 text-center">
                    <p className="text-sm text-text-muted">
                      Complete a quiz to appear on the leaderboard!
                    </p>
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate(ROUTES.QUIZ)}
                    >
                      Take a Quiz →
                    </Button>
                  </Card>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search students..."
                      className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  {/* Sort tabs */}
                  <div className="flex gap-1 bg-surface-2 rounded-xl p-1 border border-border shrink-0">
                    {([
                      { key: 'xp', label: 'XP' },
                      { key: 'quizzes', label: 'Quiz' },
                      { key: 'sessions', label: 'Sessions' },
                    ] as { key: SortBy; label: string }[]).map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setSortBy(tab.key)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                          sortBy === tab.key
                            ? 'bg-primary text-white'
                            : 'text-text-muted hover:text-text'
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => fetchLeaderboard(true)}
                    disabled={refreshing}
                    className="p-2.5 rounded-xl bg-surface-2 border border-border hover:border-primary/30 text-text-muted hover:text-primary transition-all"
                    title="Refresh"
                  >
                    <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                </div>

                {/* Leaderboard list */}
                {loadingBoard ? (
                  <div className="flex justify-center py-16">
                    <Spinner size={32} />
                  </div>
                ) : !isSupabaseConfigured ? (
                  <Card className="p-12 text-center">
                    <Trophy size={40} className="text-text-faint mx-auto mb-4 opacity-30" />
                    <p className="font-black">Leaderboard unavailable</p>
                    <p className="text-text-muted text-sm mt-1">
                      Supabase is not configured. Add env vars to Vercel.
                    </p>
                  </Card>
                ) : sorted.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Trophy size={40} className="text-text-faint mx-auto mb-4 opacity-30" />
                    <p className="font-black">
                      {search ? 'No students found' : 'No rankings yet'}
                    </p>
                    <p className="text-text-muted text-sm mt-1">
                      {search ? 'Try a different name.' : 'Complete a quiz to appear here!'}
                    </p>
                  </Card>
                ) : (
                  <Card className="overflow-hidden p-0">
                    <table className="w-full">
                      <thead className="bg-surface-2">
                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                          <th className="px-5 py-4 text-left">Rank</th>
                          <th className="px-5 py-4 text-left">Student</th>
                          <th className="px-5 py-4 text-right">
                            {sortBy === 'xp' ? 'XP' : sortBy === 'quizzes' ? 'Quizzes' : 'Sessions'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {sorted.map((entry, i) => {
                          const rank = i + 1;
                          const isMe = entry.user_id === user?.id;
                          const value = sortBy === 'xp'
                            ? `${entry.total_xp?.toLocaleString() ?? 0} XP`
                            : sortBy === 'quizzes'
                            ? `${entry.quizzes_taken ?? 0}`
                            : `${entry.study_sessions ?? 0}`;

                          return (
                            <tr
                              key={entry.user_id}
                              className={cn(
                                'group hover:bg-surface-2 transition-all',
                                isMe && 'bg-primary/5'
                              )}
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  {getRankIcon(rank)}
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  {entry.avatar_url ? (
                                    <img src={entry.avatar_url} alt=""
                                         className="w-8 h-8 rounded-lg object-cover shrink-0" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center font-bold text-xs border border-border shrink-0">
                                      {entry.display_name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-bold">
                                      {entry.display_name || 'Anonymous'}
                                      {isMe && (
                                        <span className="text-[10px] text-primary ml-2 uppercase tracking-tighter">
                                          (You)
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-[10px] text-text-muted">
                                      {entry.quizzes_taken ?? 0} quizzes
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <span className={cn(
                                  'text-sm font-black',
                                  rank === 1 ? 'text-amber-400' :
                                  rank <= 3 ? 'text-amber-600' :
                                  isMe ? 'text-primary' : 'text-text'
                                )}>
                                  {value}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right sidebar */}
        <div className="lg:w-1/3 space-y-8">
          <Card className="p-6 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Binary Search Trees', count: 124 },
                { label: 'Dynamic Programming', count: 98 },
                { label: 'System Design', count: 85 },
                { label: 'Graph Algorithms', count: 62 },
                { label: 'OS Process Scheduling', count: 44 },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => navigate(ROUTES.QUIZ, { state: { prefillTopic: item.label } })}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-2 transition-all cursor-pointer w-full text-left"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge className="bg-surface-2 text-[10px] border-border text-text-muted shrink-0">
                    {item.count} students
                  </Badge>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto">
              <Zap size={24} />
            </div>
            <h3 className="font-bold">Weekly Byte Challenge</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Master <strong>B+ Trees</strong> this week and earn 500 XP + a community badge.
            </p>
            <Button
              size="sm"
              className="w-full"
              onClick={() => navigate(ROUTES.QUIZ, { state: { prefillTopic: 'B+ Trees', prefillDifficulty: 'intermediate' } })}
            >
              Join Challenge
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
