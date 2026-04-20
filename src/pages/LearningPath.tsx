import React from 'react';

const LearningPath: React.FC = () => {
  return (
    <div className="flex-1 p-8 pt-12 max-w-7xl mx-auto w-full">
      {/* Hero / Global Stats */}
      <section className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <span className="text-primary font-bold tracking-[0.1em] uppercase mb-4 block text-xs">Advanced Heuristics • Path 04</span>
          <h1 className="text-5xl font-bold tracking-tight text-on-surface leading-tight mb-4">Mastery Roadmap</h1>
          <p className="text-on-surface-variant leading-relaxed text-lg">
            Your cognitive journey through advanced problem-solving frameworks. The path adapts in real-time to your response patterns.
          </p>
        </div>
        <div className="glass-panel ambient-shadow rounded-3xl p-6 min-w-[240px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 ai-pulse-gradient opacity-60"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Mastery</span>
            <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-on-surface tracking-tighter">84.2</span>
            <span className="text-xl font-bold text-primary">%</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full ai-pulse-gradient w-[84.2%]"></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Vertical Roadmap Modules */}
        <div className="lg:col-span-8 space-y-16 relative">
          {/* The Connection Line */}
          <div className="absolute left-8 top-8 bottom-8 w-[2px] bg-surface-container-highest -z-10"></div>

          {/* Module 01 - Completed */}
          <ModuleCard
            number="01"
            title="Cognitive Biases & Noise"
            description="Identifying structural flaws in intuitive judgment and quantifying systemic noise in decision-making processes."
            status="Completed"
            progress={100}
            icon="check_circle"
            completed
          />

          {/* Module 02 - Active */}
          <ModuleCard
            number="02"
            title="Bayesian Inference Models"
            description="EduAdapt has integrated a 'Medical Context' overlay based on your recent activity in Bio-Heuristics. Master the application of Bayes' Theorem in clinical diagnosis."
            status="In Progress"
            progress={64.2}
            icon="psychology"
            active
            adjusted
          />

          {/* Module 03 - Locked */}
          <ModuleCard
            number="03"
            title="Probabilistic Sensitivity Analysis"
            description="Complete Bayesian Inference Models to unlock this stage."
            status="Locked"
            progress={0}
            icon="lock"
            locked
          />
        </div>

        {/* AI Sidebar (Insight Panel) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          <div className="glass-panel ambient-shadow rounded-[2rem] p-8 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl ai-pulse-gradient flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>
              <h4 className="text-lg font-bold text-on-surface">AI Analysis</h4>
            </div>

            <div className="space-y-6">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Strengths</span>
                <p className="text-sm text-on-surface mt-1 leading-relaxed">Your retention for <strong>Pattern Recognition</strong> is in the top 4% of the cohort.</p>
              </div>
              <div className="bg-secondary/5 rounded-2xl p-4 border border-secondary/10">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.15em]">Neural Focus</span>
                <p className="text-sm text-on-surface mt-1 leading-relaxed">Slight hesitation detected in <strong>Statistical Calibration</strong>. We've queued 3 extra micro-labs for Module 02.</p>
              </div>

              <div className="space-y-3 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Suggested Resources</span>
                <ResourceItem icon="picture_as_pdf" text="Bayes Rule Cheat Sheet" />
                <ResourceItem icon="play_circle" text="Visualizing Uncertainty" />
              </div>
            </div>
          </div>

          {/* AI Interaction Bubble */}
          <div className="bg-on-surface rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 ai-pulse-gradient opacity-10"></div>
            <p className="text-sm leading-relaxed mb-4 relative z-10">"I noticed you struggled with <strong>Prior Probability</strong> estimates. Want to do a quick 2-minute visual exercise before you continue?"</p>
            <div className="flex gap-2 relative z-10">
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all">Not now</button>
              <button className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all">Let's do it</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ModuleCard = ({ number, title, description, status, progress, icon, active = false, completed = false, locked = false, adjusted = false }: any) => (
  <div className={`relative flex gap-8 ${locked ? 'opacity-60' : ''}`}>
    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${active ? 'ai-pulse-gradient shadow-lg scale-110' : 'bg-white shadow-md border border-slate-100'} flex items-center justify-center z-10`}>
      <span className={`material-symbols-outlined ${active || completed ? 'text-white' : 'text-outline'} text-3xl`} style={completed ? { fontVariationSettings: "'FILL' 1" } : {}}>
        {icon}
      </span>
    </div>
    <div className={`flex-1 bg-white rounded-[2rem] p-8 ambient-shadow ${active ? 'border-2 border-primary/10 relative' : 'specular-highlight border border-white/40'}`}>
      {adjusted && (
        <div className="absolute -top-3 right-8 px-4 py-1.5 rounded-full ai-pulse-gradient flex items-center gap-2 shadow-md">
          <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>magic_button</span>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Adjusted for you</span>
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-primary' : 'text-slate-400'}`}>Module {number} {active ? '• Active' : ''}</span>
          <h3 className="text-2xl font-bold text-on-surface mt-1">{title}</h3>
        </div>
        <div className={`${completed ? 'bg-surface-container-low' : active ? 'bg-primary/5' : 'bg-surface-container-low'} px-3 py-1 rounded-full flex items-center gap-2`}>
          <div className={`w-2 h-2 rounded-full ${completed ? 'bg-green-500' : active ? 'bg-primary animate-pulse' : 'bg-slate-400'}`}></div>
          <span className={`text-xs font-bold ${active ? 'text-primary' : 'text-on-surface-variant'}`}>{status}</span>
        </div>
      </div>
      <p className={`text-on-surface-variant mb-6 ${locked ? 'italic text-on-surface-variant/70' : ''}`}>{description}</p>
      {!locked && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div className={`h-full ${active ? 'ai-pulse-gradient' : 'bg-primary'} w-[${progress}%]`} style={{ width: `${progress}%` }}></div>
          </div>
          <span className={`text-sm font-bold ${active ? 'text-primary' : 'text-on-surface'}`}>{progress}%</span>
        </div>
      )}
      {active && (
        <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2">
          Continue Lesson <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      )}
    </div>
  </div>
);

const ResourceItem = ({ icon, text }: { icon: string, text: string }) => (
  <a href="#" className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
        <span className="material-symbols-outlined text-sm">{icon}</span>
      </div>
      <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">{text}</span>
    </div>
    <span className="material-symbols-outlined text-sm text-outline group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
  </a>
);

export default LearningPath;
