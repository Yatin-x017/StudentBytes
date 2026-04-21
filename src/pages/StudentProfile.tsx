import React from 'react';
import { motion } from 'framer-motion';
import { cn, animations } from '../lib/utils';

const StudentProfile: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-primary/10 blur-[60px] rounded-full opacity-50" />
          <div className="relative h-56 w-56 rounded-[3rem] border-[8px] border-white shadow-2xl overflow-hidden ring-1 ring-neutral-100">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              className="w-full h-full object-cover bg-indigo-50"
              alt="Alex Rivera"
            />
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-8 py-3 rounded-2xl shadow-xl whitespace-nowrap border border-neutral-800"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Beginner LV. 12</span>
          </motion.div>
        </motion.div>

        <div className="flex-1 text-center lg:text-left space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary font-black tracking-[0.2em] uppercase text-[10px]"
          >
            Student Identity
          </motion.span>
          <motion.h1
            {...animations.fadeInUp}
            className="text-6xl md:text-8xl font-black tracking-tight text-neutral-900 leading-none"
          >
            Alex Rivera
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-500 max-w-2xl font-medium leading-relaxed"
          >
            Computer Science student at University of Technology. Passionate about Algorithm Design and Distributed Systems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-neutral-900 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-neutral-900/10 transition-premium"
            >
              Launch Practice Lab
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border border-neutral-100 text-neutral-900 px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-neutral-50 transition-premium shadow-sm"
            >
              Export Records
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">Growth Markers</span>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900">Recent Achievements</h2>
          </div>
          <button className="text-primary text-[11px] font-black uppercase tracking-widest hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 md:row-span-2 bg-white/70 backdrop-blur-xl rounded-[3rem] p-12 border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -top-10 -right-10 p-8">
              <span className="material-symbols-outlined text-[10rem] text-primary/5">workspace_premium</span>
            </div>
            <div className="space-y-8 relative z-10">
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">architecture</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-neutral-900 tracking-tight">Logic Architect</h3>
                <p className="text-neutral-500 font-medium leading-relaxed text-lg">Completed 45 advanced modules in algorithmic logic with a 98% accuracy rate.</p>
              </div>
            </div>
            <div className="pt-12 relative z-10">
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Mastery Progress</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">85% Complete</span>
              </div>
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>

          <Badge icon="psychology" label="AI Mentor" color="indigo" index={1} />
          <Badge icon="verified" label="Fast Learner" color="emerald" index={2} />
          <Badge icon="local_fire_department" label="Streak King" color="rose" index={3} />
          <Badge icon="hub" label="Networker" color="amber" index={4} />
        </div>
      </section>

      {/* Curriculum Timeline */}
      <section className="space-y-10">
        <div className="space-y-2">
          <span className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">Learning Path</span>
          <h2 className="text-3xl font-black tracking-tight text-neutral-900">Academic Journey</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-12 border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          <div className="absolute left-[59px] top-20 bottom-20 w-[2px] bg-neutral-100" />
          <div className="space-y-16">
            <TimelineStep title="Advanced Algorithms" subtitle="Module 08: Dynamic Programming Mastery" status="Current" active index={0} />
            <TimelineStep title="Data Structures" subtitle="Module 07: B-Trees and Heaps" status="Completed" index={1} />
            <TimelineStep title="System Design" subtitle="Module 06: Scalable Architectures" status="Completed" index={2} />
            <TimelineStep title="Final Project" subtitle="Capstone: Build a Distributed Search Engine" status="Locked" locked index={3} />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const Badge = ({ icon, label, color, index }: any) => (
  <motion.div
    {...animations.stagger(index)}
    whileHover={{ y: -5 }}
    className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6 border border-white/40 shadow-sm transition-premium"
  >
    <div className={cn(
        "h-14 w-14 rounded-2xl flex items-center justify-center",
        color === 'indigo' ? "bg-indigo-50 text-indigo-500" :
        color === 'emerald' ? "bg-emerald-50 text-emerald-500" :
        color === 'rose' ? "bg-rose-50 text-rose-500" :
        "bg-amber-50 text-amber-500"
    )}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="text-[11px] font-black text-neutral-900 uppercase tracking-widest">{label}</div>
  </motion.div>
);

const TimelineStep = ({ title, subtitle, status, active = false, locked = false, index }: any) => (
  <motion.div
    {...animations.stagger(index)}
    className={cn("relative pl-20", locked && "opacity-40")}
  >
    <div className={cn(
        "absolute left-0 top-1 w-8 h-8 rounded-xl z-10 flex items-center justify-center border-4 border-white shadow-lg",
        active ? "bg-primary text-white" : locked ? "bg-neutral-100 text-neutral-300" : "bg-emerald-500 text-white"
    )}>
      <span className="material-symbols-outlined text-[16px]">{active ? 'bolt' : locked ? 'lock' : 'check'}</span>
    </div>
    <div className="flex flex-col md:row items-start md:items-center justify-between gap-4">
      <div>
        <h4 className="text-xl font-black text-neutral-900 tracking-tight">{title}</h4>
        <p className="text-neutral-500 font-medium mt-1">{subtitle}</p>
      </div>
      <div className={cn(
          "px-4 py-1.5 rounded-full",
          active ? "bg-primary/10 text-primary" : "bg-neutral-50 text-neutral-400"
      )}>
        <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
      </div>
    </div>
  </motion.div>
);

export default StudentProfile;
