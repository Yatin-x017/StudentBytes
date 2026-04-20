import React from 'react';

const CommunityFeed: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 pt-12 pb-24 md:pb-8">
      {/* Hero Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Community</span>
            <span className="material-symbols-outlined text-xs text-outline">chevron_right</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Computer Science</span>
          </nav>
          <h1 className="text-[3.5rem] font-black leading-[1.1] tracking-[-0.04em] text-on-surface mb-4">
            Computer Science <span className="text-outline-variant">Peer Network</span>
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Collaborate with peers on complex algorithms, discuss hardware architectures, and share research resources in our dedicated CS atelier.
          </p>
        </div>
        <div>
          <button className="ai-pulse-gradient text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all specular-highlight ambient-shadow">
            <span className="material-symbols-outlined">add_circle</span>
            Start Discussion
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Discussion Feed */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ThreadCard
            type="Discussion"
            author="alec_turing"
            time="2h ago"
            title="Understanding P vs NP: Is there a simpler intuition for non-determinism?"
            description="I've been struggling with the concept of non-deterministic polynomial time. While I understand the formal definition of verification in polynomial time..."
            votes={124}
            replies={42}
            views="1.2k"
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
            accent="secondary"
          />

          <ThreadCard
            type="Resource"
            author="grace_hopper_fan"
            time="1d ago"
            title="Curated List: Quantum Computing for CS Undergrads"
            description="Spent the last 6 months compiling the best lectures, papers, and simulators for getting into Quantum computing without a PhD in Physics."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuB1WfiEAzpa24JZqklSzsaDBNZlFHvTHnuaJzLqlb0HYqmRXrK9_0erSmNtqKPYctJZ7wgflTVYJZxuK3vUAXx0ggRxIbkqMWv-OMBp8uou5LxiSpKqjMsmeZCZhbkO03SN_u8GBhCau0XmV-EYF9ncFXVruJDICb57lpH645lwZxE1Fx9mduoaVB9FgEeB4Pg862vbeaGpDoUN1v2EhY78J2GEDo-Uj6iMAxeBE0bI_cPI8Fh9P0ubkXzsoIda7nBrZGjQUa-ss0e5"
            votes={312}
            replies={89}
            tags={["#Quantum", "#FutureTech"]}
            accent="tertiary"
          />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          <div className="glass-panel p-6 rounded-[1.5rem] ambient-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 ai-pulse-gradient"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Lumina Insights</h4>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              Trending topics in your learning circle suggest a shift towards **Rust** systems programming this week.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-on-surface">Community Activity</span>
                <span className="text-xs font-bold text-primary">+24%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full ai-pulse-gradient w-3/4"></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-[1.5rem]">
            <h4 className="text-sm font-black uppercase tracking-[0.1em] text-on-surface mb-6 flex items-center justify-between">
              Trending Now
              <span className="material-symbols-outlined text-outline text-lg">trending_up</span>
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {["#LargeLanguageModels", "#RustLang", "#CyberSecurity", "#DistributedSystems", "#FPGA", "#NeuralNetworks"].map(tag => (
                <a key={tag} href="#" className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-primary hover:shadow-sm transition-all">{tag}</a>
              ))}
            </div>
            <div className="border-t border-outline-variant/10 pt-6">
              <h5 className="text-[10px] font-black text-outline uppercase tracking-widest mb-4">Top Contributors</h5>
              <div className="space-y-4">
                <Contributor name="alec_turing" points="12k pts" rank="Gold Scholar" icon="stars" />
                <Contributor name="binary_queen" points="8.4k pts" rank="Expert Mentor" icon="verified" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ThreadCard = ({ type, author, time, title, description, votes, replies, views, code, image, aiResponded, tags, accent = "primary" }: any) => (
  <article className={`bg-surface-container-lowest rounded-[1.5rem] p-6 ambient-shadow specular-highlight group border border-transparent hover:border-${accent}/10 transition-all duration-500`}>
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-1">
        <button className="p-2 text-outline-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[28px]">arrow_drop_up</span>
        </button>
        <span className="text-sm font-bold text-on-surface">{votes}</span>
        <button className="p-2 text-outline-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined text-[28px]">arrow_drop_down</span>
        </button>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className={`bg-${accent}/10 text-${accent} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest`}>{type}</span>
          <span className="text-xs text-outline">Posted by <span className="text-on-surface font-medium">{author}</span> • {time}</span>
        </div>
        <div className={image ? "flex gap-4 mb-4" : ""}>
          <div className="flex-1">
            <h3 className={`text-xl font-bold text-on-surface leading-tight mb-3 group-hover:text-${accent} transition-colors`}>{title}</h3>
            {description && <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{description}</p>}
          </div>
          {image && (
            <div className="hidden sm:block w-32 h-20 rounded-xl overflow-hidden shadow-sm">
              <img src={image} className="w-full h-full object-cover" alt="Thumb" />
            </div>
          )}
        </div>
        {code && (
          <div className="bg-surface-container-low p-4 rounded-xl mb-4 font-mono text-xs text-on-surface-variant overflow-x-auto">
            <pre><code>{code}</code></pre>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-outline-variant">
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              <span className="text-xs font-semibold">{replies} replies</span>
            </div>
            {views && (
              <div className="flex items-center gap-1.5 text-outline-variant">
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span className="text-xs font-semibold">{views} views</span>
              </div>
            )}
            {aiResponded && (
              <div className="flex items-center gap-1.5 text-outline-variant">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-xs font-semibold text-primary">AI Tutor responded</span>
              </div>
            )}
          </div>
          {tags && (
             <div className="flex items-center gap-2">
              {tags.map((tag: string) => <span key={tag} className="text-[10px] text-outline-variant font-medium">{tag}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  </article>
);

const Contributor = ({ name, rank, points, icon }: any) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg overflow-hidden bg-surface-container-highest">
      <div className="w-full h-full bg-slate-300" />
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold text-on-surface">{name}</p>
      <p className="text-[10px] text-outline">{rank} • {points}</p>
    </div>
    <span className="material-symbols-outlined text-tertiary text-sm">{icon}</span>
  </div>
);

export default CommunityFeed;
