import React from 'react';
import {
  Share2,
  Search,
  TrendingUp,
  Sparkles,
  Zap,
  Trophy,
  Medal,
  Users,
  MessagesSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'chat' | 'leaderboard'>('leaderboard');
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 mb-4">
            <Sparkles size={12} className="fill-primary" /> Community Beta
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">The Coder's Commons</h1>
          <p className="text-text-muted">Connect with 500+ students, share study sessions, and master concepts together.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Share2 size={18} /> Share Session
        </Button>
      </header>

      <div className="flex gap-2 p-1 bg-surface-2 rounded-2xl border border-border mb-10 w-fit">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            activeTab === 'leaderboard'
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "text-text-muted hover:text-text hover:bg-surface-3"
          )}
        >
          <Users size={14} /> Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            activeTab === 'chat'
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "text-text-muted hover:text-text hover:bg-surface-3"
          )}
        >
          <MessagesSquare size={14} /> Global Chat
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatRoom />
              </motion.div>
            ) : (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

        <Card className="p-0 border-border overflow-hidden bg-surface">
                  <table className="w-full">
                    <thead className="bg-surface-2">
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                        <th className="px-6 py-5 text-left">Rank</th>
                        <th className="px-6 py-5 text-left">Student</th>
                        <th className="px-6 py-5 text-right">Mastery XP</th>
                        <th className="px-6 py-5 text-right">Streak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <LeaderboardRow rank={1} name="Alex Chen" xp={14250} streak={42} isMe />
                      <LeaderboardRow rank={2} name="Sarah Miller" xp={12100} streak={15} />
                      <LeaderboardRow rank={3} name="Jordan Smith" xp={9800} streak={8} />
                      <LeaderboardRow rank={4} name="Elena Rodriguez" xp={8500} streak={31} />
                      <LeaderboardRow rank={5} name="Liam Wilson" xp={7200} streak={12} />
                      <LeaderboardRow rank={6} name="Maya Patel" xp={6900} streak={5} />
                      <LeaderboardRow rank={7} name="Kofi Mensah" xp={6100} streak={22} />
                      <LeaderboardRow rank={8} name="Hiroshi Tanaka" xp={5400} streak={4} />
                    </tbody>
                  </table>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:w-1/3 space-y-8">
          <Card className="p-6 border-border glass-card space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Trending Topics
            </h3>
            <div className="space-y-4">
              <TrendingItem label="Next.js App Router" count={124} />
              <TrendingItem label="LLM Orchestration" count={98} />
              <TrendingItem label="Rust Ownership" count={85} />
              <TrendingItem label="Graph Theory" count={62} />
            </div>
            <Button variant="ghost" className="w-full text-xs font-bold text-primary">View All Topics</Button>
          </Card>

          <Card className="p-6 border-border bg-gradient-to-br from-primary/10 to-transparent space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto">
              <Zap size={24} />
            </div>
            <h3 className="font-bold">Weekly Byte Challenge</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Master the concept of **"B+ Trees"** this week to earn a limited edition community badge and 500 XP.
            </p>
            <Button size="sm" className="w-full">Join Challenge</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

const LeaderboardRow = ({ rank, name, xp, streak, isMe }: any) => (
  <tr className={cn("group hover:bg-surface-2 transition-all", isMe && "bg-primary/5")}>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        {rank === 1 && <Trophy size={16} className="text-amber-500" />}
        {rank === 2 && <Medal size={16} className="text-slate-400" />}
        {rank === 3 && <Medal size={16} className="text-amber-700" />}
        <span className={cn("text-sm font-black", rank <= 3 ? "text-text" : "text-text-muted")}>#{rank}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center font-bold text-xs border border-border group-hover:scale-110 transition-transform">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold">{name} {isMe && <span className="text-[10px] text-primary ml-2 uppercase tracking-tighter">(You)</span>}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <span className="text-sm font-mono font-bold text-primary">{xp.toLocaleString()}</span>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="flex items-center justify-end gap-1.5">
        <Zap size={12} className="text-amber-500 fill-amber-500" />
        <span className="text-sm font-bold">{streak}d</span>
      </div>
    </td>
  </tr>
);

const TrendingItem = ({ label, count }: { label: string, count: number }) => (
  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-2 transition-all cursor-pointer">
    <span className="text-sm font-medium">{label}</span>
    <Badge className="bg-surface-2 text-[10px] border-border text-text-muted">{count} bytes</Badge>
  </div>
);

export default CommunityPage;
