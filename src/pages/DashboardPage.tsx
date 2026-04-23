import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  GraduationCap,
  FileText,
  Zap,
  CheckCircle2,
  ChevronRight,
  Brain
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAppContext } from '@/context/AppContext';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { useRealtime } from '@/hooks/useRealtime';
import { getDueCards, type SRCard } from '@/lib/spacedRepetition';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const DashboardPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { user } = useAuth();
  const db = useDatabase(user?.id || '');
  const [srCards, setSrCards] = useState<SRCard[]>([]);
  useRealtime(user?.id);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [sessions, notes, settings, cards] = await Promise.all([
          db.fetchSessions(),
          db.fetchNotes(),
          db.fetchSettings(),
          db.fetchSRCards(),
        ]);
        dispatch({ type: 'SET_SESSIONS', payload: sessions });
        dispatch({ type: 'SET_NOTES', payload: notes });
        setSrCards(cards);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().setHours(0, 0, 0, 0);
  const sessionsToday = state.sessions.filter(s => s.createdAt >= today).length;
  const notesSaved = state.notes.length;
  const topicsStudied = new Set(state.sessions.map(s => s.topic)).size;
  const quizHistory = JSON.parse(localStorage.getItem('sb_quiz_history') || '[]');
  const quizScoreAvg = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((acc: number, curr: any) => acc + (curr.score/curr.total), 0) / quizHistory.length * 100) + '%'
    : '0%';

  const recentSessions = state.sessions.slice(0, 3);
  const dueCards = srCards ? getDueCards(srCards) : [];

  // Onboarding Checklist
  const hasApiKey = !!state.apiKey;
  const hasSession = state.sessions.length > 0;
  const hasQuiz = quizHistory.length > 0;
  const isNewUser = state.sessions.length === 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {getGreeting()}, {state.user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-text-muted">Welcome back to your study hub. What are we mastering today?</p>
        </div>
        <Button size="lg" onClick={() => navigate(ROUTES.STUDY)}>
          Start Studying <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {isNewUser && (
        <Card className="p-8 border-primary/20 bg-primary/5 rounded-[2.5rem] relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Zap className="text-primary fill-primary" size={24} />
                Getting Started
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ChecklistItem
                  done={hasApiKey}
                  label="Add your Anthropic API key"
                  path={ROUTES.SETTINGS}
                  navigate={navigate}
                />
                <ChecklistItem
                  done={hasSession}
                  label="Start your first study session"
                  path={ROUTES.STUDY}
                  navigate={navigate}
                />
                <ChecklistItem
                  done={hasQuiz}
                  label="Take a quiz to earn XP"
                  path={ROUTES.QUIZ}
                  navigate={navigate}
                />
              </div>
           </div>
           <div className="absolute top-0 right-0 p-8 opacity-10">
             <Zap size={120} />
           </div>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Clock className="text-primary" />} label="Sessions Today" value={sessionsToday} />
        <StatCard icon={<FileText className="text-success" />} label="Notes Saved" value={notesSaved} />
        <StatCard icon={<BrainCircuit className="text-amber-500" />} label="Topics Studied" value={topicsStudied} />
        <StatCard icon={<TrendingUp className="text-primary" />} label="Quiz Avg" value={quizScoreAvg} />
      </div>

      {dueCards.length > 0 && (
        <Card className="p-6 border-amber-500/20 bg-amber-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Brain size={48} className="text-amber-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-amber-400" />
              <h3 className="font-black text-sm uppercase tracking-widest text-amber-200">Due for Review</h3>
              <Badge className="bg-amber-500/20 text-amber-400 text-[10px] border-amber-500/30">
                {dueCards.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {dueCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => navigate(ROUTES.QUIZ, { state: { topic: card.topic } })}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 border
                            border-amber-500/20 text-amber-300 text-xs font-bold
                            hover:bg-amber-500/20 hover:border-amber-500/40 transition-all flex items-center gap-2"
                >
                  {card.topic}
                  <ArrowRight size={12} />
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {dueCards.length === 0 && srCards.length > 0 && (
        <div className="text-xs text-success font-bold flex items-center gap-2 px-4 py-2 bg-success/5 border border-success/10 rounded-xl w-fit">
          <CheckCircle2 size={14} /> All caught up! Next review: {srCards[0]?.nextReviewDate}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Recent Sessions
            </h2>
            {state.sessions.length > 0 && (
               <button onClick={() => navigate(ROUTES.STUDY)} className="text-xs font-bold text-primary hover:underline">View All</button>
            )}
          </div>

          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <Card
                  key={session.id}
                  className="flex items-center justify-between p-5 hover:bg-surface-2 transition-all cursor-pointer group border-white/5"
                  onClick={() => navigate(ROUTES.STUDY, { state: { sessionId: session.id } })}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">{session.topic}</h3>
                      <p className="text-xs text-text-muted">{formatDate(session.updatedAt)} • {session.messages.length} messages</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Card>
              ))}
            </div>
          ) : (
            <Card className="h-48 flex flex-col items-center justify-center text-center p-8 border-dashed border-white/10 bg-transparent">
              <p className="text-text-muted mb-4">No recent sessions yet. Byte is waiting!</p>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.STUDY)}>
                New Session
              </Button>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap size={20} className="text-amber-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <ActionLink
              icon={<MessageSquare size={20} />}
              title="Start Studying"
              desc="Chat with Byte"
              onClick={() => navigate(ROUTES.STUDY)}
            />
            <ActionLink
              icon={<GraduationCap size={20} />}
              title="Canvas LMS"
              desc={localStorage.getItem('sb_canvas_token') ? "View assignments" : "Connect your account"}
              onClick={() => navigate(ROUTES.CANVAS)}
              dot={!!localStorage.getItem('sb_canvas_token')}
            />
            <ActionLink
              icon={<FileText size={20} />}
              title="Review Notes"
              desc="View saved summaries"
              onClick={() => navigate(ROUTES.NOTES)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChecklistItem = ({ done, label, path, navigate }: { done: boolean, label: string, path: string, navigate: any }) => (
  <button
    onClick={() => navigate(path)}
    className={cn(
      "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
      done ? "bg-success/10 border-success/20 opacity-60" : "bg-white/5 border-white/10 hover:border-white/30"
    )}
  >
    <div className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center",
      done ? "bg-success text-white" : "border-2 border-white/20"
    )}>
      {done && <CheckCircle2 size={14} />}
    </div>
    <span className={cn("text-sm font-bold", done && "line-through")}>{label}</span>
    {!done && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <Card className="p-6 flex flex-col gap-4 border-white/5">
    <div className="bg-white/5 w-10 h-10 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{label}</p>
    </div>
  </Card>
);

const ActionLink = ({ icon, title, desc, onClick, dot }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, dot?: boolean }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-xl bg-surface hover:bg-surface-2 border border-white/5 transition-all text-left w-full group cursor-pointer relative overflow-hidden"
  >
    <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-bold text-sm">{title}</p>
      <p className="text-xs text-text-muted">{desc}</p>
    </div>
    {dot && (
      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
    )}
  </button>
);

export default DashboardPage;
