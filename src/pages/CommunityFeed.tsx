import React from 'react';
import { motion } from 'framer-motion';
import { cn, animations } from '../lib/utils';

const CommunityFeed: React.FC = () => {
  return (
    <div className="flex flex-col gap-12 p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen relative z-10">
      {/* Hero Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Community</span>
            <span className="material-symbols-outlined text-sm text-neutral-300">chevron_right</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Computer Science</span>
          </nav>
          <motion.h1
            {...animations.fadeInUp}
            className="text-5xl md:text-7xl font-black tracking-tight text-neutral-900 leading-none mb-6"
          >
            Peer Network
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-500 font-medium leading-relaxed"
          >
            Collaborate with peers on complex algorithms and share research resources.
          </motion.p>
        </div>
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-neutral-900 text-white px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-neutral-900/10 flex items-center gap-4 hover:bg-neutral-800 transition-premium"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Start Discussion
          </motion.button>
        </motion.div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Discussion Feed */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <ThreadCard
            type="Discussion"
            author="alec_turing"
            time="2h ago"
            title="Understanding P vs NP: Is there a simpler intuition for non-determinism?"
            description="I've been struggling with the concept of non-deterministic polynomial time. While I understand the formal definition..."
            votes={124}
            replies={42}
            views="1.2k"
            index={0}
          />

          <ThreadCard
            type="Doubt"
            author="binary_queen"
            time="5h ago"
            title="Kernel panic in custom OS hobby project - Memory management issue?"
            code={`[0.000000] CPU: 0 PID: 0 Comm: swapper Not tainted 5.15.0-generic
[0.000000] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996)`}
            votes={56}
            replies={12}
            aiResponded
            accent="indigo"
            index={1}
          />

          <ThreadCard
            type="Resource"
            author="grace_hopper_fan"
            time="1d ago"
            title="Curated List: Quantum Computing for CS Undergrads"
            description="Spent the last 6 months compiling the best lectures, papers, and simulators for getting into Quantum computing."
            image="https://api.dicebear.com/7.x/shapes/svg?seed=Quantum"
            votes={312}
            replies={89}
            tags={["#Quantum", "#FutureTech"]}
            accent="emerald"
            index={2}
          />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-28">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/40 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
              </div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Network Intel</h4>
            </div>
            <p className="text-neutral-500 font-medium mb-10 leading-relaxed">
              Trending topics suggest a shift towards **Distributed Systems** this week.
            </p>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-neutral-400">Activity Velocity</span>
                <span className="text-primary">+24%</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: '75%' }}
                   className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-50/50 p-10 rounded-[3rem] border border-neutral-100"
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-8 flex items-center justify-between">
              Trending Now
              <span className="material-symbols-outlined text-lg">trending_up</span>
            </h4>
            <div className="flex flex-wrap gap-3 mb-10">
              {["#RustLang", "#CyberSecurity", "#DistributedSystems", "#FPGA", "#NeuralNetworks"].map(tag => (
                <a key={tag} href="#" className="bg-white border border-neutral-100 px-5 py-2.5 rounded-2xl text-[11px] font-black text-neutral-400 hover:text-primary hover:border-primary/20 transition-premium shadow-sm hover:shadow-md">{tag}</a>
              ))}
            </div>
            <div className="border-t border-neutral-100 pt-10">
              <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6">Active Contributors</h5>
              <div className="space-y-6">
                <Contributor name="alec_turing" points="12k pts" icon="stars" />
                <Contributor name="binary_queen" points="8.4k pts" icon="verified" />
              </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

const ThreadCard = ({ type, author, time, title, description, votes, replies, code, image, aiResponded, tags, accent = "primary", index }: any) => (
  <motion.article
    {...animations.stagger(index)}
    whileHover={{ y: -5 }}
    className={cn(
        "bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 border border-white/40 shadow-sm transition-premium group",
        accent === 'indigo' ? "hover:border-indigo-200" : accent === 'emerald' ? "hover:border-emerald-200" : "hover:border-primary/20"
    )}
  >
    <div className="flex gap-10">
      <div className="flex flex-col items-center gap-2">
        <motion.button whileHover={{ scale: 1.2 }} className="w-10 h-10 rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center text-neutral-300 hover:text-primary">
          <span className="material-symbols-outlined text-3xl">arrow_drop_up</span>
        </motion.button>
        <span className="text-sm font-black text-neutral-900">{votes}</span>
        <motion.button whileHover={{ scale: 1.2 }} className="w-10 h-10 rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center text-neutral-300 hover:text-rose-500">
          <span className="material-symbols-outlined text-3xl">arrow_drop_down</span>
        </motion.button>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <span className={cn(
              "text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest",
              accent === 'indigo' ? "bg-indigo-50 text-indigo-600" : accent === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-primary/5 text-primary"
          )}>{type}</span>
          <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">By <span className="text-neutral-900">{author}</span> • {time}</span>
        </div>
        <div className={image ? "flex gap-8 mb-6" : ""}>
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-black text-neutral-900 leading-tight group-hover:text-primary transition-colors">{title}</h3>
            {description && <p className="text-neutral-500 font-medium text-lg leading-relaxed line-clamp-2">{description}</p>}
          </div>
          {image && (
            <div className="hidden sm:block w-40 h-24 rounded-3xl overflow-hidden shadow-lg border border-white">
              <img src={image} className="w-full h-full object-cover" alt="Thumb" />
            </div>
          )}
        </div>
        {code && (
          <div className="bg-neutral-900 p-8 rounded-3xl mb-8 font-mono text-xs text-indigo-100 overflow-x-auto shadow-inner relative">
            <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            </div>
            <pre className="mt-4"><code>{code}</code></pre>
          </div>
        )}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 text-neutral-400">
              <span className="material-symbols-outlined text-lg">chat_bubble</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{replies} replies</span>
            </div>
            {aiResponded && (
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg text-primary">verified</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Mentored</span>
              </div>
            )}
          </div>
          {tags && (
             <div className="flex items-center gap-3">
              {tags.map((tag: string) => <span key={tag} className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">{tag}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.article>
);

const Contributor = ({ name, icon, points }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-premium">
      <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
    </div>
    <div className="flex-1">
      <p className="text-sm font-black text-neutral-900 group-hover:text-primary transition-colors">{name}</p>
      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{points}</p>
    </div>
    <span className="material-symbols-outlined text-neutral-200 group-hover:text-primary transition-colors">chevron_right</span>
  </div>
);

export default CommunityFeed;
