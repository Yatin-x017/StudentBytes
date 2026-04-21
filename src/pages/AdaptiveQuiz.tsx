import React from 'react';
import { motion } from 'framer-motion';
import { animations } from '../lib/utils';

const AdaptiveQuiz: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden min-h-[calc(100vh-140px)] relative z-10">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Focused Quiz Card */}
      <div className="w-full max-w-3xl">
        {/* Feedback Strip */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex justify-center"
        >
          <div className="bg-white/60 backdrop-blur-md px-8 py-4 rounded-full flex items-center gap-4 shadow-sm border border-white/40">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
            <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">
              Analytical speed is in the top 5%. Keep it up!
            </p>
          </div>
        </motion.div>

        {/* Main Question Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-[0_40px_100px_rgba(0,0,0,0.06)] overflow-hidden relative"
        >
          {/* Header Strip */}
          <div className="flex justify-between items-center px-10 py-6 bg-neutral-50/50 border-b border-neutral-100">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">Complexity Analysis</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Hard</span>
              </div>
            </div>
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">
              Q 14 <span className="text-neutral-900">/ 20</span>
            </div>
          </div>

          <div className="p-10 md:p-16">
            {/* The Question */}
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight leading-tight mb-10">
              Analyze the following function. What is the <span className="text-primary italic font-serif">tightest</span> upper bound for its time complexity?
            </h1>

            {/* Code Block */}
            <div className="bg-neutral-900 rounded-3xl p-8 font-mono text-[13px] text-indigo-100 mb-12 shadow-inner relative group">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              </div>
              <pre className="mt-4"><code>{`function findClusters(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      if (computeProximity(data[i], data[j]) < threshold) {
        result.push([i, j]);
      }
    }
  }
  return result;
}`}</code></pre>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4">
              <Option label="A" text="O(n log n)" index={0} />
              <Option label="B" text="O(n²)" index={1} />
              <Option label="C" text="O(2ⁿ)" index={2} />
              <Option label="D" text="O(n)" index={3} />
            </div>
          </div>

          {/* AI Interaction Input */}
          <div className="px-10 py-8 bg-neutral-50/50 border-t border-neutral-100 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full bg-transparent border-none outline-none text-sm font-bold text-neutral-900 placeholder:text-neutral-400"
                  placeholder="Need a hint? Ask the AI Tutor..."
                />
              </div>
              <button className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:text-indigo-700 transition-colors">Invoke AI</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress & Actions Footer */}
      <footer className="w-full mt-12 max-w-3xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col w-full md:w-1/3 gap-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">Assessment Flow</span>
              <span className="text-sm font-black text-primary tracking-tight">70%</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-100 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
               whileHover={{ y: -2 }}
               whileTap={{ scale: 0.95 }}
               className="px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white border border-neutral-100 text-neutral-400 hover:text-neutral-900 transition-premium shadow-sm"
            >
              Skip
            </motion.button>
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-neutral-900 text-white shadow-xl shadow-neutral-900/10 hover:bg-neutral-800 transition-premium"
            >
              Submit Answer
            </motion.button>
          </div>

          <div className="flex items-center gap-3 text-neutral-400">
            <span className="material-symbols-outlined text-lg">schedule</span>
            <span className="text-sm font-black tabular-nums">14:52</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Option = ({ label, text, index }: { label: string, text: string, index: number }) => (
  <motion.button
    {...animations.stagger(index)}
    whileHover={{ x: 8 }}
    className="group flex items-center justify-between p-6 rounded-2xl border border-neutral-100 bg-white hover:border-primary/20 hover:bg-neutral-50 transition-premium text-left w-full shadow-sm hover:shadow-md"
  >
    <div className="flex items-center gap-6">
      <span className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-xs font-black text-neutral-400 group-hover:bg-primary group-hover:text-white transition-colors">
        {label}
      </span>
      <span className="text-xl font-bold text-neutral-700">{text}</span>
    </div>
    <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-primary translate-x-4 group-hover:translate-x-0 transition-transform duration-500">arrow_forward</span>
  </motion.button>
);

export default AdaptiveQuiz;
