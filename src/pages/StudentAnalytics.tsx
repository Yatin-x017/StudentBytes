import React from 'react';
import { motion } from 'framer-motion';
import { cn, animations } from '../lib/utils';

const StudentAnalytics: React.FC = () => {
  return (
    <div className="flex flex-col gap-12 p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen relative z-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mb-4 block"
          >
            Performance Insight • Academic Q1
          </motion.span>
          <motion.h1
            {...animations.fadeInUp}
            className="text-5xl font-black tracking-tight text-neutral-900 leading-tight"
          >
            Intellectual Growth
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-500 mt-4 font-medium leading-relaxed"
          >
            Advanced data modeling synthesizing your cognitive velocity and conceptual mastery.
          </motion.p>
        </div>
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 shadow-sm">
          <button className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-[11px] font-black uppercase tracking-widest transition-premium shadow-lg shadow-neutral-900/10">This Quarter</button>
          <button className="px-6 py-2.5 rounded-xl text-neutral-400 text-[11px] font-black uppercase tracking-widest hover:text-neutral-900 transition-colors">Academic Year</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Estimated Grade */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-4 bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000"></div>
          <div>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[11px] font-black tracking-[0.2em] text-neutral-400 uppercase">Estimated Grade</h3>
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
              </div>
            </div>
            <div className="relative inline-block">
              <span className="text-[10rem] font-black text-neutral-900 tracking-tighter leading-none">A+</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-4 top-4 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-100">
            <p className="text-neutral-500 font-medium leading-relaxed">
              Based on <span className="font-black text-neutral-900">Mastery Velocity</span>, you are trending 4.2% above peer average.
            </p>
          </div>
        </motion.div>

        {/* Mastery Velocity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-8 bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col h-[500px]"
        >
          <div className="flex flex-col sm:row items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-[11px] font-black tracking-[0.2em] text-neutral-400 uppercase">Mastery Velocity</h3>
              <p className="text-xs text-neutral-300 font-bold mt-2 uppercase tracking-widest">Growth rate over time</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Actual</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Predicted</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative flex items-end justify-between px-6 pb-2">
            <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between opacity-5 pointer-events-none">
              <div className="border-b border-neutral-900"></div>
              <div className="border-b border-neutral-900"></div>
              <div className="border-b border-neutral-900"></div>
              <div className="border-b border-neutral-900"></div>
            </div>
            <ChartBar height="40%" fill="65%" index={0} />
            <ChartBar height="55%" fill="70%" index={1} />
            <ChartBar height="65%" fill="85%" index={2} />
            <ChartBar height="50%" fill="45%" index={3} />
            <ChartBar height="75%" fill="95%" index={4} />
            <ChartBar height="90%" fill="85%" index={5} gradient />
          </div>
        </motion.div>

        {/* Conceptual Radar */}
        <motion.div
          {...animations.fadeInUp}
          transition={{ delay: 0.2 }}
          className="md:col-span-7 bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-[11px] font-black tracking-[0.2em] text-neutral-400 uppercase">Conceptual Radar</h3>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-widest">Algo-DS Focus</span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-72 h-72 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-2xl" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1"></circle>
                <circle cx="50" cy="50" fill="none" r="30" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1"></circle>
                <circle cx="50" cy="50" fill="none" r="15" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1"></circle>
                <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="#f1f5f9" strokeWidth="0.5"></path>
                <motion.polygon
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  fill="rgba(99, 102, 241, 0.15)"
                  points="50,15 85,50 50,85 15,50"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[10px] font-black text-neutral-400 uppercase tracking-widest">BIG O</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 text-[10px] font-black text-neutral-400 uppercase tracking-widest">GRAPHS</div>
              <div className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">TREES</div>
              <div className="absolute right-0 top-1/2 translate-x-12 -translate-y-1/2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">SORTING</div>
            </div>
            <div className="flex-1 space-y-8 w-full">
              <ProgressItem label="Big O Complexity" percentage={88} color="bg-primary" index={0} />
              <ProgressItem label="Graph Theory" percentage={64} color="bg-indigo-400" index={1} />
            </div>
          </div>
        </motion.div>

        {/* Commitment Bar */}
        <motion.div
          {...animations.fadeInUp}
          transition={{ delay: 0.3 }}
          className="md:col-span-5 bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col"
        >
          <h3 className="text-[11px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-12">Commitment Velocity</h3>
          <div className="space-y-8 flex-1 flex flex-col justify-center">
            <CommitmentBar label="Algorithms" hours={42} percentage={92} color="bg-primary" index={0} />
            <CommitmentBar label="Systems" hours={31} percentage={74} color="bg-indigo-400" index={1} />
            <CommitmentBar label="Linear Alg" hours={24} percentage={58} color="bg-indigo-200" index={2} />
            <CommitmentBar label="Ethical AI" hours={12} percentage={35} color="bg-slate-200" index={3} />
          </div>
        </motion.div>
      </div>

      {/* Milestones */}
      <section className="space-y-10 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight text-neutral-900">Academic Milestones</h2>
          <motion.button
            whileHover={{ x: 5 }}
            className="text-primary text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:underline"
          >
            View Transcript <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <MilestoneCard icon="emoji_events" title="DS Mastery" description="Advanced binary search trees (100% accuracy)." date="Oct 24" color="bg-primary" index={0} />
          <MilestoneCard icon="forum" title="Top Contributor" description="Solved 15+ peer algorithm challenges." date="Nov 02" color="bg-indigo-400" index={1} />
          <MilestoneCard icon="rocket_launch" title="AI Lab Finalist" description="Lumina Logic project in top 5%." date="Nov 18" color="bg-indigo-200" index={2} />
          <MilestoneCard icon="verified" title="Ethics Credential" description="Certified for Human-AI Interaction research." date="Dec 01" color="bg-slate-900" index={3} />
        </div>
      </section>
    </div>
  );
};

const ChartBar = ({ fill, index, gradient = false }: any) => (
  <div className="w-[12%] bg-neutral-50 rounded-t-3xl relative group h-full">
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: fill }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
      className={cn(
        "absolute bottom-0 w-full rounded-t-3xl transition-premium shadow-lg",
        gradient ? "bg-gradient-to-t from-primary to-indigo-400" : "bg-primary/20 hover:bg-primary"
      )}
    />
  </div>
);

const ProgressItem = ({ label, percentage, color, index }: any) => (
  <motion.div
    {...animations.stagger(index)}
    className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100"
  >
    <div className="flex justify-between items-center mb-4">
      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">{label}</span>
      <span className={cn("text-[11px] font-black uppercase tracking-widest", color.replace('bg-', 'text-'))}>{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-neutral-100">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ delay: 0.5 + index * 0.1 }}
        className={cn("h-full", color)}
      />
    </div>
  </motion.div>
);

const CommitmentBar = ({ label, hours, percentage, color, index }: any) => (
  <motion.div
    {...animations.stagger(index)}
    className="flex items-center gap-6 group"
  >
    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest w-20 truncate">{label}</span>
    <div className="flex-1 h-10 bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 relative shadow-inner">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
        className={cn("h-full transition-premium flex items-center px-4 shadow-lg", color)}
      >
        <span className="text-[10px] text-white font-black uppercase tracking-widest whitespace-nowrap">{hours} HRS</span>
      </motion.div>
    </div>
  </motion.div>
);

const MilestoneCard = ({ icon, title, description, date, color, index }: any) => (
  <motion.div
    {...animations.stagger(index)}
    whileHover={{ y: -5 }}
    className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 hover:border-primary/20 shadow-sm hover:shadow-xl transition-premium group"
  >
    <div className={cn(
      "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-premium group-hover:scale-110",
      color.replace('bg-', 'bg-').concat('/10 '), color.replace('bg-', 'text-')
    )}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <h4 className="text-xl font-black text-neutral-900 tracking-tight">{title}</h4>
    <p className="text-sm text-neutral-500 font-medium mt-2 leading-relaxed">{description}</p>
    <div className={cn(
      "mt-6 text-[10px] font-black tracking-[0.2em] uppercase",
      color.replace('bg-', 'text-')
    )}>
      {date}
    </div>
  </motion.div>
);

export default StudentAnalytics;
