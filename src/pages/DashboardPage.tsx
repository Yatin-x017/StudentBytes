import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  GraduationCap,
  FileText,
  CheckCircle2,
  Brain,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAppContext } from '@/context/AppContext';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';
import { useRealtime } from '@/hooks/useRealtime';
import { getDueCards, type SRCard } from '@/lib/spacedRepetition';
import { fetchCourses, fetchAllUpcomingAssignments, formatDueDate, dueDateColor } from '@/lib/canvas';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

const DashboardPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { user } = useAuth();
  const db = useDatabase(user?.id || '');
  const [srCards, setSrCards] = useState<SRCard[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);

  const [canvasAssignments, setCanvasAssignments] = useState<any[]>([]);
  const [canvasLoading, setCanvasLoading] = useState(false);
  const canvasToken = localStorage.getItem('sb_canvas_token') || '';
  const canvasDomain = localStorage.getItem('sb_canvas_domain') || '';
  const canvasConnected = !!(canvasToken && canvasDomain);
  useRealtime(user?.id);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const [sessions, notes, settings, cards, quizzes] = await Promise.all([
          db.fetchSessions(),
          db.fetchNotes(),
          db.fetchSettings(),
          db.fetchSRCards(),
          db.fetchQuizHistory(),
        ]);
        dispatch({ type: 'SET_SESSIONS', payload: sessions });
        dispatch({ type: 'SET_NOTES', payload: notes });
        setSrCards(cards);
        setQuizHistory(quizzes);
        if (settings) {
          dispatch({ type: 'UPDATE_SETTINGS', payload: {
            defaultLanguage: settings.default_language as any,
            provider: settings.provider,
          }});
          dispatch({ type: 'UPDATE_USER', payload: {
            xp: settings.xp,
            level: settings.level,
          }});
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadData();
  }, [user, db, dispatch]);

  useEffect(() => {
    if (!canvasConnected) return;
    setCanvasLoading(true);
    fetchCourses(canvasDomain, canvasToken)
      .then(courses => fetchAllUpcomingAssignments(canvasDomain, canvasToken, courses))
      .then(assignments => setCanvasAssignments(assignments.slice(0, 6)))
      .catch(err => console.error('Canvas dashboard error:', err))
      .finally(() => setCanvasLoading(false));
  }, [canvasConnected, canvasDomain, canvasToken]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'Coder';

  const today = new Date().setHours(0, 0, 0, 0);
  const sessionsToday = state.sessions.filter(s => s.createdAt >= today).length;
  const notesSaved = state.notes.length;
  const topicsStudied = new Set(state.sessions.map(s => s.topic)).size;
  const quizScoreAvg = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((acc: number, curr: any) => acc + (curr.score/curr.total), 0) / quizHistory.length * 100) + '%'
    : '0%';

  const recentSessions = state.sessions.slice(0, 3);
  const dueCards = srCards ? getDueCards(srCards) : [];

  const urgentCount = canvasAssignments.filter(a => {
    const diff = a.due_at
      ? Math.ceil((new Date(a.due_at).getTime() - Date.now()) / 86400000)
      : 99;
    return diff >= 0 && diff <= 3;
  }).length;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-border glass p-8 md:p-12">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-primary font-display font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-primary/30" />
              {greeting}, {displayName}
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-6 leading-[1.1]">
              {urgentCount > 0
                ? <>{urgentCount} urgent <span className="text-primary glow-text">deadlines</span> this week.</>
                : <>Master your courses <span className="text-primary glow-text">10x faster.</span></>
              }
            </h1>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                size="lg"
                onClick={() => navigate(ROUTES.STUDY)}
                className="h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 gap-3 text-base"
              >
                <Sparkles size={20} />
                Start Studying
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(ROUTES.QUIZ)}
                className="h-14 px-8 rounded-2xl border-border glass gap-3 text-base"
              >
                <Brain size={20} />
                Prove Mastery
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Clock size={20} className="text-primary" />} label="Sessions Today" value={sessionsToday} />
        <StatCard icon={<FileText size={20} className="text-success" />} label="Notes Saved" value={notesSaved} />
        <StatCard icon={<BrainCircuit size={20} className="text-warning" />} label="Topics Studied" value={topicsStudied} />
        <StatCard icon={<TrendingUp size={20} className="text-accent" />} label="Quiz Avg" value={quizScoreAvg} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Due for Review */}
          {dueCards.length > 0 && (
            <Card className="p-6 border-warning/20 bg-warning/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                 <Brain size={64} className="text-warning" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning border border-warning/20">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">Due for Review</h3>
                    <p className="text-xs text-text-muted">Spaced repetition picks for today</p>
                  </div>
                  <Badge className="ml-auto bg-warning/20 text-warning border-warning/30">
                    {dueCards.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dueCards.map(card => (
                    <button
                      key={card.id}
                      onClick={() => navigate(ROUTES.QUIZ, { state: { topic: card.topic } })}
                      className="px-4 py-2 rounded-xl bg-surface border
                                border-border text-xs font-bold
                                hover:border-warning/40 transition-all flex items-center gap-2 group/btn"
                    >
                      {card.topic}
                      <ArrowRight size={12} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Recent Sessions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
                   <Clock size={16} className="text-primary" />
                </div>
                Recent Sessions
              </h2>
              <button onClick={() => navigate(ROUTES.STUDY)} className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>

            {recentSessions.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {recentSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="flex items-center justify-between p-5 hover:bg-surface-2 transition-all cursor-pointer group border-border glass"
                    onClick={() => navigate(ROUTES.STUDY, { state: { sessionId: session.id } })}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{session.topic}</h3>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">
                          {formatDate(session.updatedAt)} · {session.messages.length} messages
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="h-48 flex flex-col items-center justify-center text-center p-8 border-dashed border-border bg-transparent">
                <p className="text-text-muted text-sm mb-6">No recent sessions yet. Byte is waiting!</p>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.STUDY)} className="rounded-xl border-border">
                  New Session
                </Button>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-sm font-display font-black uppercase tracking-widest text-text-faint">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <ActionLink
                icon={<MessageSquare size={18} />}
                title="AI Study Room"
                desc="Chat with Byte"
                onClick={() => navigate(ROUTES.STUDY)}
              />
              <ActionLink
                icon={<GraduationCap size={18} />}
                title="Canvas LMS"
                desc={canvasConnected ? "View deadlines" : "Connect account"}
                onClick={() => navigate(ROUTES.CANVAS)}
                dot={canvasConnected}
              />
              <ActionLink
                icon={<FileText size={18} />}
                title="Knowledge Base"
                desc="Review notes"
                onClick={() => navigate(ROUTES.NOTES)}
              />
            </div>
          </div>

          {/* Canvas Widget */}
          <Card className="p-6 border-border glass space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                <GraduationCap size={14} className="text-primary" />
                Deadlines
              </h3>
              <button
                onClick={() => navigate(ROUTES.CANVAS)}
                className="text-[10px] text-primary hover:underline font-bold"
              >
                All →
              </button>
            </div>

            {canvasLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-12 bg-surface-2 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !canvasConnected ? (
              <div className="text-center py-6 space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  Link Canvas to sync assignments
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(ROUTES.CANVAS)}
                  className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest border-border"
                >
                  Connect
                </Button>
              </div>
            ) : canvasAssignments.length === 0 ? (
              <p className="text-xs text-success flex items-center gap-2 py-4 font-bold justify-center">
                <CheckCircle2 size={14} /> All caught up!
              </p>
            ) : (
              <div className="space-y-1">
                {canvasAssignments.map(a => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between py-3 px-3
                               rounded-xl hover:bg-surface-2 transition-all group"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">
                        {a.name}
                      </p>
                      <p className="text-[10px] text-text-muted truncate mt-0.5">
                        {a.courseName}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black whitespace-nowrap px-2 py-1 rounded-lg glass border border-white/5 ${dueDateColor(a.due_at)}`}>
                      {formatDueDate(a.due_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <Card className="p-6 flex flex-col gap-4 border-border glass hover:border-primary/20 transition-all">
    <div className="bg-surface-2 w-10 h-10 rounded-xl flex items-center justify-center border border-border">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-display font-black tracking-tight">{value}</p>
      <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.1em] mt-1">{label}</p>
    </div>
  </Card>
);

const ActionLink = ({ icon, title, desc, onClick, dot }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, dot?: boolean }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-2xl bg-surface/30 hover:bg-surface-2 border border-border transition-all text-left w-full group relative overflow-hidden"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all border border-primary/20">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-bold text-sm group-hover:text-text transition-colors">{title}</p>
      <p className="text-[10px] text-text-muted font-medium mt-0.5 uppercase tracking-tighter">{desc}</p>
    </div>
    {dot && (
      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
    )}
  </button>
);

export default DashboardPage;
