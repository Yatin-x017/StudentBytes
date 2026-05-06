import React from 'react';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Brain,
  Activity,
  Target,
  Zap,
  Calendar
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const AnalyticsPage: React.FC = () => {
  const { state } = useAppContext();

  // Real stats
  const totalSessions = state.sessions.length;
  const totalMessages = state.sessions.reduce(
    (sum, s) => sum + s.messages.length, 0
  );
  const totalNotes = state.notes.length;
  const totalXP = state.user.xp;
  const level = state.user.level;

  // Sessions over time (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStart = new Date(date.setHours(0,0,0,0)).getTime();
    const dayEnd = dayStart + 86400000;
    const count = state.sessions.filter(
      s => s.createdAt >= dayStart && s.createdAt < dayEnd
    ).length;
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions: count,
    };
  });

  // Subject distribution from session topics
  const subjectCounts: Record<string, number> = {};
  state.sessions.forEach(s => {
    const subject = s.subjectId || s.topic?.split(' ')[0] || 'General';
    // Normalize subject string
    const normalized = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
    subjectCounts[normalized] = (subjectCounts[normalized] || 0) + 1;
  });
  const topSubjects = Object.entries(subjectCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Study streak (consecutive days with sessions)
  const sessionDates = new Set(
    state.sessions.map(s =>
      new Date(s.createdAt).toISOString().split('T')[0]
    )
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (sessionDates.has(dateStr)) {
      streak++;
    } else if (i === 0) {
      // If no session today, continue checking from yesterday to see current streak
      continue;
    } else {
      break;
    }
  }

  const activeDays = last7Days.filter(d => d.sessions > 0).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Study Analytics</h1>
          <p className="text-text-muted">Real-time breakdown of your learning progress.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-2xl border border-primary/20">
          <Zap size={18} className="text-primary fill-primary" />
          <span className="text-sm font-black uppercase tracking-widest text-primary">{streak} Day Streak</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-white/5 bg-surface-2 flex flex-col justify-between">
          <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-4">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-3xl font-black">{totalSessions}</p>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Total Sessions</p>
          </div>
        </Card>

        <Card className="p-6 border-white/5 bg-surface-2 flex flex-col justify-between">
          <div className="bg-success/10 w-10 h-10 rounded-xl flex items-center justify-center text-success mb-4">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-3xl font-black">{totalMessages}</p>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">AI Interactions</p>
          </div>
        </Card>

        <Card className="p-6 border-white/5 bg-surface-2 flex flex-col justify-between">
          <div className="bg-amber-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-amber-500 mb-4">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-3xl font-black">{totalNotes}</p>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Saved Notes</p>
          </div>
        </Card>

        <Card className="p-6 border-white/5 bg-surface-2 flex flex-col justify-between">
          <div className="bg-violet-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-violet-500 mb-4">
            <Target size={20} />
          </div>
          <div>
            <p className="text-3xl font-black">{totalXP}</p>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Mastery XP</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 border-white/5">
          <h3 className="font-black text-sm mb-8 flex items-center gap-2 uppercase tracking-widest">
            <Calendar size={16} className="text-primary" />
            Study Activity — Last 7 Days
          </h3>
          <div className="flex items-end gap-3 h-48">
            {last7Days.map((day, i) => {
              const maxSessions = Math.max(...last7Days.map(d => d.sessions), 1);
              const heightPct = (day.sessions / maxSessions) * 100;
              const isToday = i === 6;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ease-out group relative ${
                        isToday ? 'bg-primary' :
                        day.sessions > 0 ? 'bg-primary/40' : 'bg-white/5'
                      }`}
                      style={{ height: `${Math.max(heightPct, day.sessions > 0 ? 8 : 4)}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface border border-white/10 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {day.sessions} sessions
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${
                    isToday ? 'text-primary' : 'text-text-muted'
                  }`}>
                    {isToday ? 'Today' : day.day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Weekly Engagement
            </p>
            <Badge variant="success">
              +{activeDays} active days
            </Badge>
          </div>
        </Card>

        <div className="space-y-6">
          {topSubjects.length > 0 ? (
            <Card className="p-6 border-white/5">
              <h3 className="font-black text-sm mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Target size={16} className="text-primary" />
                Topics Studied
              </h3>
              <div className="space-y-5">
                {topSubjects.map(([subject, count]) => {
                  const maxCount = topSubjects[0][1];
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={subject}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-tight truncate">{subject}</span>
                        <span className="text-[10px] font-bold text-text-muted shrink-0 ml-2">
                          {count} session{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card className="p-8 border-white/5 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-text-muted mx-auto">
                <BarChart3 size={24} />
              </div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">No topic data yet</p>
            </Card>
          )}

          <Card className="p-6 border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                 <Brain size={20} />
               </div>
               <div>
                 <h4 className="font-bold text-sm">Level {level}</h4>
                 <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Mastery Progress</p>
               </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                <span>{totalXP % 1000} / 1000 XP</span>
                <span>{Math.round((totalXP % 1000) / 10)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(totalXP % 1000) / 10}%` }}
                />
              </div>
              <p className="text-[10px] text-text-muted leading-tight mt-3">
                {1000 - (totalXP % 1000)} XP until Level {level + 1}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
