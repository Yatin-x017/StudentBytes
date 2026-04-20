import React from 'react';

const AdaptiveQuiz: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden min-h-[calc(100vh-140px)]">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]"></div>

      {/* Focused Quiz Card */}
      <div className="w-full max-w-2xl z-10">
        {/* Feedback Strip */}
        <div className="mb-8 flex justify-center">
          <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 ambient-shadow">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-sm font-medium text-on-surface-variant tracking-tight">
              You're doing great, Alex! Your analytical speed is in the top 5%.
            </p>
          </div>
        </div>

        {/* Main Question Container */}
        <div className="bg-surface-container-lowest rounded-[1.5rem] ambient-shadow specular-highlight overflow-hidden relative">
          {/* Difficulty Label Strip */}
          <div className="flex justify-between items-center px-8 py-4 bg-surface-container-low/50">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-outline">Difficulty Level</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-error/10 text-error rounded-full">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span className="text-xs font-bold uppercase tracking-wider">Hard</span>
              </div>
            </div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-outline">
              Question 14 <span className="text-on-surface">/ 20</span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* The Question */}
            <h1 className="text-2xl md:text-3xl font-semibold text-on-surface tracking-tight leading-tight mb-8">
              Analyze the following function. What is the <span className="text-primary italic">tightest</span> upper bound for its time complexity in the average case?
            </h1>

            {/* Code Block */}
            <div className="bg-surface-container-high/40 rounded-xl p-6 font-mono text-sm text-on-surface-variant mb-10 border border-outline-variant/5 overflow-x-auto">
              <pre><code>{`function findClusters(data) {
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
              <Option label="A" text="O(n log n)" />
              <Option label="B" text="O(n²)" />
              <Option label="C" text="O(2ⁿ)" />
              <Option label="D" text="O(n)" />
            </div>
          </div>

          {/* AI Interaction Input */}
          <div className="ai-pulse-border px-8 py-6 bg-surface-container-low/30 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-secondary to-tertiary-fixed-dim flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-on-surface-variant placeholder:text-outline/60"
                  placeholder="Ask AI Tutor for a hint..."
                />
              </div>
              <button className="text-primary font-bold text-xs uppercase tracking-widest hover:text-secondary transition-colors">Ask AI</button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Actions Footer */}
      <footer className="w-full mt-12 max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col w-full md:w-1/3 gap-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold tracking-widest uppercase text-outline">Current Progress</span>
              <span className="text-sm font-bold text-primary tracking-tight">70% Complete</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-8 py-3 rounded-xl font-bold text-sm bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all">
              Skip Question
            </button>
            <button className="px-10 py-3 rounded-xl font-bold text-sm bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform"></div>
              Submit Answer
            </button>
          </div>

          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-outline">schedule</span>
            <span className="text-sm font-medium tabular-nums">14:52 remaining</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Option = ({ label, text }: { label: string, text: string }) => (
  <button className="group flex items-center justify-between p-5 rounded-xl border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left w-full">
    <div className="flex items-center gap-4">
      <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-sm font-bold text-outline group-hover:bg-primary group-hover:text-white transition-colors">
        {label}
      </span>
      <span className="text-lg font-medium text-on-surface">{text}</span>
    </div>
    <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-primary">arrow_forward</span>
  </button>
);

export default AdaptiveQuiz;
