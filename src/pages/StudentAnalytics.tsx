import React from 'react';

const StudentAnalytics: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-secondary uppercase mb-2 block">Student Performance Insight</span>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface leading-tight">Intellectual Growth</h1>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl">
            Advanced data modeling synthesizing your cognitive velocity and conceptual mastery across the CS curriculum.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-lowest p-1 rounded-xl shadow-[0_4px_20px_rgba(26,28,31,0.04)] specular-highlight">
          <button className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-bold">This Quarter</button>
          <button className="px-4 py-2 rounded-lg text-outline text-sm font-medium hover:bg-surface-container-low transition-colors">Academic Year</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Estimated Grade */}
        <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0_12px_40px_rgba(26,28,31,0.08)] specular-highlight flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold tracking-widest text-outline uppercase">Estimated Final Grade</h3>
              <span className="material-symbols-outlined text-primary-fixed-dim">trending_up</span>
            </div>
            <div className="relative inline-block">
              <span className="text-8xl font-black text-on-surface tracking-tighter">A+</span>
              <div className="absolute -right-2 top-0 w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-surface-container-low">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Based on <span className="font-bold text-primary">Mastery Velocity</span> and recent assessments, you are trending 4.2% above peer average.
            </p>
          </div>
        </div>

        {/* Mastery Velocity Chart */}
        <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0_12px_40px_rgba(26,28,31,0.08)] specular-highlight flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-outline uppercase">Mastery Velocity</h3>
              <p className="text-xs text-outline-variant mt-1">Growth rate of complex concepts over time</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs font-bold text-on-surface-variant">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary/30"></div>
                <span className="text-xs font-bold text-on-surface-variant">Predicted</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative flex items-end justify-between px-4 pb-2">
            <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between opacity-10 pointer-events-none">
              <div className="border-b border-outline"></div>
              <div className="border-b border-outline"></div>
              <div className="border-b border-outline"></div>
              <div className="border-b border-outline"></div>
            </div>
            <ChartBar height="40%" fill="65%" />
            <ChartBar height="55%" fill="70%" />
            <ChartBar height="65%" fill="85%" />
            <ChartBar height="50%" fill="45%" />
            <ChartBar height="75%" fill="95%" />
            <ChartBar height="90%" fill="85%" gradient />
          </div>
        </div>

        {/* Radar Chart Section */}
        <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0_12px_40px_rgba(26,28,31,0.08)] specular-highlight">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold tracking-widest text-outline uppercase">Conceptual Radar</h3>
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">Algo-DS Focus</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-64 h-64 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="#e2e2e7" strokeDasharray="2 2" strokeWidth="1"></circle>
                <circle cx="50" cy="50" fill="none" r="30" stroke="#e2e2e7" strokeDasharray="2 2" strokeWidth="1"></circle>
                <circle cx="50" cy="50" fill="none" r="15" stroke="#e2e2e7" strokeDasharray="2 2" strokeWidth="1"></circle>
                <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="#e2e2e7" strokeWidth="0.5"></path>
                <polygon fill="rgba(68, 65, 204, 0.2)" points="50,15 80,50 50,85 20,50" stroke="#4441cc" strokeWidth="2"></polygon>
              </svg>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-[10px] font-bold text-outline">BIG O</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-[10px] font-bold text-outline">GRAPHS</div>
              <div className="absolute left-0 top-1/2 -translate-x-10 -translate-y-1/2 text-[10px] font-bold text-outline">TREES</div>
              <div className="absolute right-0 top-1/2 translate-x-10 -translate-y-1/2 text-[10px] font-bold text-outline">SORTING</div>
            </div>
            <div className="flex-1 space-y-6 w-full">
              <ProgressItem label="Big O Complexity" percentage={88} color="bg-primary" textColor="text-primary" />
              <ProgressItem label="Graph Theory" percentage={64} color="bg-secondary" textColor="text-secondary" />
            </div>
          </div>
        </div>

        {/* Topic Commitment */}
        <div className="md:col-span-5 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0_12px_40px_rgba(26,28,31,0.08)] specular-highlight flex flex-col">
          <h3 className="text-sm font-bold tracking-widest text-outline uppercase mb-8">Topic Commitment</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <CommitmentBar label="System Arch" hours={42} percentage={92} color="bg-primary" />
            <CommitmentBar label="UI Design" hours={31} percentage={74} color="bg-secondary" />
            <CommitmentBar label="Linear Alg" hours={24} percentage={58} color="bg-tertiary-container" />
            <CommitmentBar label="Ethical AI" hours={12} percentage={35} color="bg-outline-variant" />
          </div>
        </div>
      </div>

      {/* Milestones */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Academic Milestones</h2>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            View Full Transcript <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MilestoneCard icon="emoji_events" title="Data Structures Mastery" description="Completed advanced binary search trees module with 100% accuracy." date="Oct 24, 2023" color="hover:bg-primary" />
          <MilestoneCard icon="forum" title="Top Community Contributor" description="Provided verified solutions to 15 peer-requested algorithm challenges." date="Nov 02, 2023" color="hover:bg-secondary" />
          <MilestoneCard icon="rocket_launch" title="AI Lab Finalist" description="Prototype 'Lumina Logic' ranked in the top 5% of student projects." date="Nov 18, 2023" color="hover:bg-tertiary-container" />
          <MilestoneCard icon="verified" title="Research Ethics Credential" description="Certified for Human-AI Interaction research methodologies." date="Dec 01, 2023" color="hover:bg-outline" />
        </div>
      </section>
    </div>
  );
};

const ChartBar = ({ height, fill, gradient = false }: any) => (
  <div className="w-[12%] bg-surface-container-low rounded-t-xl relative group" style={{ height }}>
    <div
      className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-500 ${gradient ? 'bg-gradient-to-t from-primary to-secondary' : 'bg-primary'}`}
      style={{ height: fill }}
    ></div>
  </div>
);

const ProgressItem = ({ label, percentage, color, textColor }: any) => (
  <div className="p-4 bg-surface-container-low rounded-xl">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold">{label}</span>
      <span className={`text-xs font-black ${textColor}`}>{percentage}%</span>
    </div>
    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

const CommitmentBar = ({ label, hours, percentage, color }: any) => (
  <div className="flex items-center gap-4">
    <span className="text-xs font-bold text-outline w-16">{label}</span>
    <div className="flex-1 h-8 bg-surface-container-low rounded-lg overflow-hidden group">
      <div className={`h-full ${color} transition-all duration-700 flex items-center px-3`} style={{ width: `${percentage}%` }}>
        <span className="text-[10px] text-white font-bold">{hours} hrs</span>
      </div>
    </div>
  </div>
);

const MilestoneCard = ({ icon, title, description, date, color }: any) => (
  <div className={`bg-surface-container-low p-6 rounded-2xl hover:bg-white transition-all duration-300 group border border-transparent hover:border-outline-variant/20 hover:shadow-lg`}>
    <div className={`w-10 h-10 bg-on-primary rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:text-white transition-colors ${color.replace('hover:bg', 'group-hover:bg')}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <h4 className="font-bold text-on-surface">{title}</h4>
    <p className="text-xs text-on-surface-variant mt-1">{description}</p>
    <div className={`mt-4 text-[10px] font-black tracking-widest uppercase transition-colors ${color.replace('hover:bg', 'text')}`}>
      {date}
    </div>
  </div>
);

export default StudentAnalytics;
