import React, { useEffect, useState } from 'react';
import {
  Share2,
  Search,
  Heart,
  MessageCircle,
  TrendingUp,
  Sparkles,
  Zap,
  Filter,
  ArrowRight,
  Trophy,
  Medal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useDatabase } from '@/hooks/useDatabase';
import { useAppContext } from '@/context/AppContext';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAppContext();
  const { fetchLeaderboard } = useDatabase(''); // Empty ID since it's global

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      const loadLeaderboard = async () => {
        setLoading(true);
        try {
          const data = await fetchLeaderboard();
          setLeaderboard(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      loadLeaderboard();
    }
  }, [activeTab, fetchLeaderboard]);

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

      <div className="flex border-b border-white/5 mb-8">
        <button
          onClick={() => setActiveTab('feed')}
          className={cn(
            "px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative",
            activeTab === 'feed' ? "text-primary" : "text-text-muted hover:text-white"
          )}
        >
          Activity Feed
          {activeTab === 'feed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={cn(
            "px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative",
            activeTab === 'leaderboard' ? "text-primary" : "text-text-muted hover:text-white"
          )}
        >
          Global Leaderboard
          {activeTab === 'leaderboard' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {activeTab === 'feed' ? (
            <>
              <div className="flex items-center gap-3">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                      type="text"
                      placeholder="Search shared bytes..."
                      className="w-full bg-surface border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                 </div>
                 <Button variant="outline" size="icon" className="h-10 w-10">
                   <Filter size={18} />
                 </Button>
              </div>

              <div className="space-y-4">
                <CommunityPost
                  author="Alex Chen"
                  authorAvatar="A"
                  topic="Distributed Systems"
                  title="A clear breakdown of Paxos Consensus"
                  desc="I was struggling with Paxos for weeks. Byte helped me visualize it with a 'Parliament' analogy. Check out the full session summary here."
                  likes={42}
                  comments={12}
                  tags={['Systems', 'Conceptual']}
                />
                <CommunityPost
                  author="Sarah Miller"
                  authorAvatar="S"
                  topic="React Performance"
                  title="When to actually use useMemo vs useCallback"
                  desc="Compiled a list of real-world scenarios where memoization actually hurts performance. Verified with Byte."
                  likes={128}
                  comments={45}
                  tags={['Frontend', 'Performance']}
                  featured
                />
                <CommunityPost
                  author="Jordan Smith"
                  authorAvatar="J"
                  topic="Algorithms"
                  title="Dynamic Programming: The 'Bottom-Up' Secret"
                  desc="If you're stuck on recursion, try this iterative approach Byte taught me. Makes DP problems feel like filling out a spreadsheet."
                  likes={89}
                  comments={18}
                  tags={['Algorithms', 'CS Fundamentals']}
                />
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Card className="p-0 border-white/5 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/2">
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                      <th className="px-6 py-4 text-left">Rank</th>
                      <th className="px-6 py-4 text-left">Student</th>
                      <th className="px-6 py-4 text-right">Mastery XP</th>
                      <th className="px-6 py-4 text-right">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-text-muted">Loading rankings...</td>
                      </tr>
                    ) : leaderboard.length > 0 ? (
                      leaderboard.map((entry, idx) => (
                        <LeaderboardRow
                          key={entry.user_id}
                          rank={idx + 1}
                          name={entry.name || 'Anonymous Student'}
                          xp={entry.xp}
                          streak={entry.streak || 0}
                          isMe={false} // Would need real user context to compare
                        />
                      ))
                    ) : (
                      <>
                        <LeaderboardRow rank={1} name="Alex Chen" xp={14250} streak={42} isMe />
                        <LeaderboardRow rank={2} name="Sarah Miller" xp={12100} streak={15} />
                        <LeaderboardRow rank={3} name="Jordan Smith" xp={9800} streak={8} />
                        <LeaderboardRow rank={4} name="Elena Rodriguez" xp={8500} streak={31} />
                        <LeaderboardRow rank={5} name="Liam Wilson" xp={7200} streak={12} />
                      </>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}
        </div>

        <div className="lg:w-1/3 space-y-8">
          <Card className="p-6 border-white/5 glass-card space-y-6">
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

          <Card className="p-6 border-white/5 bg-gradient-to-br from-primary/10 to-transparent space-y-4 text-center">
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

const CommunityPost = ({ author, authorAvatar, topic, title, desc, likes, comments, tags, featured }: any) => (
  <Card className={`p-6 border-white/5 glass-card hover:border-white/20 transition-all cursor-pointer relative overflow-hidden group ${featured ? 'bg-primary/5 border-primary/20' : ''}`}>
    {featured && <div className="absolute top-0 right-0 bg-primary text-[10px] font-black text-white px-3 py-1 rounded-bl-xl uppercase tracking-tighter">Featured</div>}

    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center font-bold text-xs border border-white/5">
        {authorAvatar}
      </div>
      <div>
        <h4 className="text-xs font-bold">{author}</h4>
        <p className="text-[10px] text-text-muted">shared a byte in <span className="text-primary font-medium">{topic}</span></p>
      </div>
    </div>

    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-all">{title}</h3>
    <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">{desc}</p>

    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag: string) => (
        <Badge key={tag} variant="outline" className="text-[10px] border-white/10 text-text-muted">{tag}</Badge>
      ))}
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-white/5">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-error transition-all">
          <Heart size={14} /> {likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-all">
          <MessageCircle size={14} /> {comments}
        </button>
      </div>
      <button className="text-xs font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        Read Byte <ArrowRight size={14} />
      </button>
    </div>
  </Card>
);

const LeaderboardRow = ({ rank, name, xp, streak, isMe }: any) => (
  <tr className={cn("group hover:bg-white/2 transition-all", isMe && "bg-primary/5")}>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        {rank === 1 && <Trophy size={16} className="text-amber-500" />}
        {rank === 2 && <Medal size={16} className="text-slate-400" />}
        {rank === 3 && <Medal size={16} className="text-amber-700" />}
        <span className={cn("text-sm font-black", rank <= 3 ? "text-white" : "text-text-muted")}>#{rank}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center font-bold text-xs border border-white/5 group-hover:scale-110 transition-transform">
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
  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
    <span className="text-sm font-medium">{label}</span>
    <Badge className="bg-white/5 text-[10px] border-white/5 text-text-muted">{count} bytes</Badge>
  </div>
);

export default CommunityPage;
