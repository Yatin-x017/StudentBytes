import React from 'react';
import { motion } from 'framer-motion';
import { cn, animations } from '../lib/utils';

const LearningPath: React.FC = () => {
  return (
    <div className="flex flex-col gap-12 p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen relative z-10">
      {/* Hero / Global Stats */}
      <section className="flex flex-col lg:flex-row justify-between items-end gap-10">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary font-black tracking-[0.2em] uppercase mb-4 block text-[10px]"
          >
            Advanced Heuristics • Path 04
          </motion.span>
          <motion.h1
            {...animations.fadeInUp}
            className="text-5xl font-black tracking-tight text-neutral-900 leading-tight mb-6"
          >
            Mastery Roadmap
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 leading-relaxed text-lg font-medium"
          >
            Your cognitive journey through advanced problem-solving frameworks. The path adapts in real-time to your response patterns.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 min-w-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Global Mastery</span>
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-neutral-900 tracking-tighter">84.2</span>
            <span className="text-xl font-black text-primary">%</span>
          </div>
          <div className="mt-6 h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '84.2%' }}
              className="h-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Vertical Roadmap Modules */}
        <div className="lg:col-span-8 space-y-12 relative">
          {/* The Connection Line */}
          <div className="absolute left-[31px] top-10 bottom-10 w-[2px] bg-neutral-100 -z-0"></div>

          <ModuleCard
            number="01"
            title="Cognitive Biases & Noise"
            description="Identifying structural flaws in intuitive judgment and quantifying systemic noise in decision-making processes."
            status="Completed"
            progress={100}
            icon="check_circle"
            completed
            index={0}
          />

          <ModuleCard
            number="02"
            title="Bayesian Inference Models"
            description="EduAdapt has integrated a 'Medical Context' overlay based on your recent activity in Bio-Heuristics."
            status="In Progress"
            progress={64.2}
            icon="psychology"
            active
            adjusted
            index={1}
          />

          <ModuleCard
            number="03"
            title="Probabilistic Sensitivity Analysis"
            description="Complete Bayesian Inference Models to unlock this stage."
            status="Locked"
            progress={0}
            icon="lock"
            locked
            index={2}
          />
        </div>

        {/* AI Sidebar */}
        <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-8 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">insights</span>
              </div>
              <h4 className="text-lg font-black text-neutral-900 uppercase tracking-tight">AI Insights</h4>
            </div>

            <div className="space-y-6">
              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Strengths</span>
                <p className="text-sm text-emerald-900 mt-2 font-bold leading-relaxed">Your Pattern Recognition is in the top 4% of the cohort.</p>
              </div>
              <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Neural Focus</span>
                <p className="text-sm text-indigo-900 mt-2 font-bold leading-relaxed">Slight hesitation detected in Statistical Calibration. Extra labs queued.</p>
              </div>

              <div className="space-y-4 pt-4">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Suggested Resources</span>
                <ResourceItem icon="picture_as_pdf" text="Bayes Rule Cheat Sheet" />
                <ResourceItem icon="play_circle" text="Visualizing Uncertainty" />
              </div>
            </div>
          </motion.div>

          {/* AI Bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <p className="text-lg font-medium leading-relaxed mb-8 relative z-10">"Want to do a quick 2-minute visual exercise on <strong>Prior Probability</strong>?"</p>
            <div className="flex gap-3 relative z-10">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors">Later</button>
              <button className="bg-white text-neutral-900 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-premium">Let's go</button>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

const ModuleCard = ({ number, title, description, status, progress, icon, active = false, completed = false, locked = false, adjusted = false, index }: any) => (
  <motion.div
    {...animations.stagger(index)}
    className={cn("relative flex gap-10", locked && "opacity-50")}
  >
    <div className={cn(
      "flex-shrink-0 w-16 h-16 rounded-[1.25rem] z-10 flex items-center justify-center transition-premium",
      active ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" :
      completed ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" :
      "bg-white border border-neutral-100 text-neutral-400 shadow-sm"
    )}>
      <span className="material-symbols-outlined text-3xl">
        {icon}
      </span>
    </div>

    <div className={cn(
      "flex-1 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 border transition-premium relative overflow-hidden shadow-sm",
      active ? "border-primary/20 ring-4 ring-primary/5 shadow-xl shadow-primary/5" : "border-white/40 shadow-neutral-200/20"
    )}>
      {adjusted && (
        <div className="absolute top-6 right-8 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[14px]">magic_button</span>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Personalized</span>
        </div>
      )}

      <div className="flex flex-col md:row justify-between items-start gap-4 mb-6">
        <div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em]",
            active ? "text-primary" : "text-neutral-400"
          )}>Module {number}</span>
          <h3 className="text-3xl font-black text-neutral-900 tracking-tight mt-2">{title}</h3>
        </div>
        <div className={cn(
          "px-4 py-1.5 rounded-full flex items-center gap-2",
          completed ? "bg-emerald-50" : active ? "bg-indigo-50" : "bg-neutral-50"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            completed ? "bg-emerald-500" : active ? "bg-primary animate-pulse" : "bg-neutral-300"
          )} />
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            completed ? "text-emerald-600" : active ? "text-primary" : "text-neutral-400"
          )}>{status}</span>
        </div>
      </div>

      <p className="text-neutral-500 font-medium leading-relaxed text-lg mb-8">{description}</p>

      {!locked && (
        <div className="flex items-center gap-6 mb-8">
          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={cn("h-full", active ? "bg-primary" : "bg-emerald-500")}
            />
          </div>
          <span className={cn(
            "text-sm font-black tracking-tight",
            active ? "text-primary" : "text-emerald-500"
          )}>{progress}%</span>
        </div>
      )}

      {active && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-10 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-neutral-900/10 transition-premium flex items-center gap-3"
        >
          Resume Lesson <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </motion.button>
      )}
    </div>
  </motion.div>
);

const ResourceItem = ({ icon, text }: { icon: string, text: string }) => (
  <a href="#" className="flex items-center justify-between group p-3 hover:bg-neutral-50 rounded-2xl transition-premium">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
        <span className="material-symbols-outlined text-lg text-neutral-400 group-hover:text-primary transition-colors">{icon}</span>
      </div>
      <span className="text-sm font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors">{text}</span>
    </div>
    <span className="material-symbols-outlined text-lg text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_right_alt</span>
  </a>
);

export default LearningPath;
