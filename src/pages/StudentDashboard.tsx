import React from 'react';

const StudentDashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7">
          <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2">Current Status</p>
          <h2 className="text-5xl font-extrabold text-on-background tracking-tighter leading-tight">Good morning, Alex!</h2>
          <p className="text-on-surface-variant mt-4 text-lg max-w-lg">
            Your cognitive resonance is at 94% today. Ready to continue your journey into <span className="text-primary font-semibold">Architectural Systems</span>?
          </p>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="glass-panel rim-light p-6 rounded-[1.5rem] space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">Rank</span>
                <span className="text-lg font-black text-secondary tracking-tight">Level 12 Architect</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary-fixed/30 px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="text-sm font-bold text-on-secondary-fixed">14 DAY STREAK</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-outline">
                <span>3,450 XP</span>
                <span>4,000 XP</span>
              </div>
              <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full ai-pulse-gradient w-[75%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Progress Rings (Courses) */}
        <div className="bg-surface-container-lowest ambient-shadow rim-light p-8 rounded-[2rem] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-6">Active Mastery</h3>
            <div className="space-y-8">
              <MasteryRing percentage={75} title="Data Structures" subtitle="Module 4: Heaps & Graphs" color="text-primary" />
              <MasteryRing percentage={50} title="World History" subtitle="Module 2: Industrial Age" color="text-secondary" />
              <MasteryRing percentage={90} title="Microeconomics" subtitle="Module 8: Market Failure" color="text-tertiary-container" />
            </div>
          </div>
          <button className="mt-8 text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
            View All Courses <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* AI Tutor Card */}
        <div className="lg:col-span-1 glass-panel ambient-shadow rounded-[2rem] overflow-hidden flex flex-col relative">
          <div className="ai-pulse-gradient h-1.5 w-full"></div>
          <div className="p-8 flex-1 flex flex-col">
            <div className="bg-primary/10 h-14 w-14 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">Consult AI Tutor</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              "Based on your recent quiz in Data Structures, I recommend reviewing Time Complexity before your midterm."
            </p>
            <div className="mt-auto space-y-3">
              <div className="bg-white/50 border border-outline-variant/10 p-4 rounded-xl text-xs font-medium text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                <span>Prepare for Big-O Analysis Quiz?</span>
              </div>
              <div className="bg-white/50 border border-outline-variant/10 p-4 rounded-xl text-xs font-medium text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-lg">bolt</span>
                <span>Generate flashcards for Economics</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-surface-container-low mt-auto">
            <button className="w-full ai-pulse-gradient text-white rounded-xl py-4 font-bold text-sm shadow-lg flex items-center justify-center gap-3">
              Open Neural Chat <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-surface-container-lowest ambient-shadow rim-light p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight">Timeline</h3>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">Live Feed</span>
          </div>
          <div className="space-y-0 relative">
            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-outline-variant/20"></div>

            <TimelineItem
              time="Today, 09:15 AM"
              title="Completed 'Binary Trees' Lab"
              description="+120 XP earned • Level 12 Reached"
              iconColor="bg-secondary"
              active
            />
            <TimelineItem
              time="Yesterday"
              title="Academic Milestone: 'Code Sage'"
              description="Consistency badge for 14-day streak"
              iconColor="bg-outline-variant"
            />
             <TimelineItem
              time="Oct 22"
              title="Submitted Microeconomics Essay"
              description="Grade Pending • Peer review requested"
              iconColor="bg-primary"
              active
            />
          </div>
        </div>
      </div>

      {/* Bottom Asymmetrical Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container-low rounded-[2rem] p-10 overflow-hidden relative group">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 group-hover:opacity-20 transition-opacity">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6ziA6pgmYQtUxOS3m0jmmbL1k8YGj85Yc6eWYTPlAl0CgeSm2K56G5FV3X4DaINVzOZihfoR2bdmpOi8CtED72JA6434hD102-oT-G7g5kBhVbqm1SPXSHqXx-JWkNDOQZ2RROS-FsOJAoP7rBfvd-YOEnEuC2INwCXHD5lJDGDVarThwp4gtvF_X7NP-TFlNZU55rPUi35wjFR7ORhxrGrMqRWCdp7KS-87tTSKL6ETxaKQDGvLKdpLjV7qI4Gtbn4j5YH444SML"
              className="w-full h-full object-cover"
              alt="Background"
            />
          </div>
          <div className="relative z-10 max-w-lg">
            <h3 className="text-3xl font-extrabold tracking-tighter mb-4">Mastering Abstract Logic</h3>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              You've spent 14 hours on algorithmic complexity this week. Users who follow this pattern have a 40% higher chance of acing their final exams.
            </p>
            <div className="flex gap-4">
              <button className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Continue Lecture</button>
              <button className="bg-white font-bold py-3 px-8 rounded-xl border border-outline-variant/30 hover:bg-white/50 transition-all">Review Insights</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <ActionCard icon="menu_book" title="Library Access" subtitle="Premium Active" color="bg-tertiary-fixed text-tertiary" />
          <ActionCard icon="forum" title="Study Circle" subtitle="3 New Messages" color="bg-secondary-fixed text-secondary" />
        </div>
      </section>
    </div>
  );
};

const MasteryRing = ({ percentage, title, subtitle, color }: { percentage: number, title: string, subtitle: string, color: string }) => {
  const dashArray = 175.9;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-16 w-16 flex items-center justify-center">
        <svg className="h-full w-full transform -rotate-90">
          <circle className="text-surface-container-highest" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
          <circle className={color} cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeWidth="6"></circle>
        </svg>
        <span className="absolute text-xs font-bold">{percentage}%</span>
      </div>
      <div>
        <h4 className="font-bold text-on-surface">{title}</h4>
        <p className="text-xs text-outline-variant font-medium">{subtitle}</p>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, title, description, iconColor, active = false }: { time: string, title: string, description: string, iconColor: string, active?: boolean }) => (
  <div className="relative pl-12 pb-8">
    <div className={`absolute ${active ? 'left-2.5 top-1 h-3 w-3 ring-4 ring-opacity-20 ring-current' : 'left-3 top-1 h-2 w-2'} rounded-full ${iconColor} ${active ? (iconColor === 'bg-secondary' ? 'ring-secondary' : 'ring-primary') : ''}`}></div>
    <span className="text-[10px] font-bold text-outline uppercase block mb-1">{time}</span>
    <h4 className={`font-bold text-sm ${!active ? 'text-outline' : ''}`}>{title}</h4>
    <p className="text-xs text-on-surface-variant mt-1">{description}</p>
  </div>
);

const ActionCard = ({ icon, title, subtitle, color }: { icon: string, title: string, subtitle: string, color: string }) => (
  <div className="bg-white ambient-shadow rim-light p-6 rounded-[2rem] flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h5 className="font-bold text-sm">{title}</h5>
        <p className="text-[10px] text-outline font-bold uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
    <span className="material-symbols-outlined text-outline">arrow_forward</span>
  </div>
);

export default StudentDashboard;
