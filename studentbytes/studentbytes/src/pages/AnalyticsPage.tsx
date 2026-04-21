import React from 'react';
import {
  TrendingUp,
  Target,
  Activity,
  Flame,
  Award,
  BarChart2
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES } from '@/lib/constants';

const AnalyticsPage: React.FC = () => {
  const { state } = useAppContext();

  const totalXP = state.user.xp;
  const level = state.user.level;
  const sessionsCount = state.sessions.length;

  if (sessionsCount === 0) {
    return (
      <EmptyState
        icon={BarChart2}
        title="Nothing to analyze yet"
        description="Your learning stats will appear after your first session."
        actionLabel="Begin Learning"
        actionPath={ROUTES.STUDY}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Performance Analytics</h1>
        <p className="text-text-muted">Track your growth and conceptual mastery over time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 border-white/5 bg-gradient-to-br from-primary/10 to-transparent flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/10">
            <TrendingUp size={40} />
          </div>
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Mastery Velocity</h3>
          <p className="text-4xl font-black mb-4">+12% <span className="text-sm font-medium text-success">this week</span></p>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[65%]" />
          </div>
        </Card>

        <Card className="p-8 border-white/5 bg-gradient-to-br from-amber-500/10 to-transparent flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 flex items-center justify-center text-amber-500 mb-6 shadow-xl shadow-amber-500/10">
            <Flame size={40} />
          </div>
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Daily Streak</h3>
          <p className="text-4xl font-black mb-4">7 Days</p>
          <div className="flex gap-1.5">
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} className="w-3 h-3 rounded-full bg-amber-500" />
            ))}
          </div>
        </Card>

        <Card className="p-8 border-white/5 bg-gradient-to-br from-success/10 to-transparent flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-success/20 flex items-center justify-center text-success mb-6 shadow-xl shadow-success/10">
            <Award size={40} />
          </div>
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">XP Milestone</h3>
          <p className="text-4xl font-black mb-4">{totalXP.toLocaleString()}</p>
          <Badge variant="primary" className="bg-success/20 text-success border-success/20">Next: {(level * 1000).toLocaleString()}</Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-white/5 glass-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Learning Activity
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-bold outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-lg transition-all duration-1000"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] font-bold text-text-muted uppercase">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-white/5 glass-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target size={20} className="text-primary" />
              Conceptual Radar
            </h3>
            <Badge variant="outline" className="border-white/10 text-text-muted">Top Skills</Badge>
          </div>

          <div className="space-y-6">
            <SkillProgress label="Frontend Architecture" percent={88} color="bg-primary" />
            <SkillProgress label="Backend Systems" percent={64} color="bg-accent" />
            <SkillProgress label="Data Structures" percent={92} color="bg-success" />
            <SkillProgress label="DevOps & Cloud" percent={45} color="bg-amber-500" />
            <SkillProgress label="System Design" percent={71} color="bg-purple-500" />
          </div>
        </Card>
      </div>
    </div>
  );
};

const SkillProgress = ({ label, percent, color }: { label: string, percent: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-text-muted uppercase tracking-wider">{label}</span>
      <span>{percent}%</span>
    </div>
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-1000`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

export default AnalyticsPage;
