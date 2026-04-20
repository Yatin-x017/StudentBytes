import React from 'react';

const AdminAnalytics: React.FC = () => {
  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 pb-32">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-on-background mb-2">Executive Overview</h2>
          <p className="text-on-surface-variant max-w-xl text-lg">Synthesized insights across global cohorts. Real-time adaptation intelligence and system health monitoring.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-low px-6 py-3 rounded-xl font-bold text-sm text-on-surface-variant flex items-center gap-2 hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Last 30 Days
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 specular-highlight hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Bento Grid: Top Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cohort Mastery */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-[1.5rem] p-8 specular-highlight">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-on-background">Cohort Mastery Over Time</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-outline-variant mt-1">Global Proficiency Tracking</p>
            </div>
            <div className="flex gap-4">
              <LegendItem color="bg-primary" label="STEM" />
              <LegendItem color="bg-secondary" label="Humanities" />
            </div>
          </div>
          <div className="h-64 flex items-end gap-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/20 to-transparent pointer-events-none"></div>
            {[40, 55, 48, 70, 65, 82, 95, 60, 52, 68, 75, 88].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-lg transition-all duration-500 hover:bg-primary ${i === 6 ? 'bg-primary shadow-lg shadow-primary/20' : i > 3 && i < 6 ? 'bg-primary/60' : 'bg-surface-container-high'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest">
            <span>Sept 01</span>
            <span>Sept 10</span>
            <span>Sept 20</span>
            <span>Sept 30</span>
          </div>
        </div>

        {/* AI Helpfulness */}
        <div className="lg:col-span-4 glass-panel rounded-[1.5rem] p-8 specular-highlight flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 ai-pulse-gradient"></div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="text-lg font-bold text-on-background">AI Helpfulness</h3>
            </div>
            <p className="text-sm text-on-surface-variant">Aggregated student feedback loop on personalized tutor responses.</p>
          </div>
          <div className="py-6 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle className="text-surface-container-highest" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                <circle cx="80" cy="80" fill="transparent" r="70" stroke="url(#aiGradient)" strokeDasharray="440" strokeDashoffset="44" strokeLinecap="round" strokeWidth="12"></circle>
                <defs>
                  <linearGradient id="aiGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#4441cc" />
                    <stop offset="50%" stopColor="#9026c3" />
                    <stop offset="100%" stopColor="#68d3ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-black text-on-background">91%</span>
                <p className="text-[10px] font-bold text-outline-variant uppercase">Positive</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low/50 p-4 rounded-xl">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-on-surface-variant">Vs. Previous Month</span>
              <span className="text-primary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +4.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid: Lower Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Engagement Heatmap */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-[1.5rem] p-8 specular-highlight">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-on-background">Engagement Heatmap</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-outline-variant mt-1">Activity Density by Subject</p>
            </div>
            <select className="text-xs font-bold border-none bg-surface-container-low rounded-lg focus:ring-0">
              <option>Daily Average</option>
              <option>Peak Hours</option>
            </select>
          </div>
          <div className="grid grid-cols-12 gap-2">
             {Array.from({ length: 36 }).map((_, i) => (
               <div key={i} className={`col-span-1 h-8 rounded-md ${i % 7 === 0 ? 'bg-secondary' : i % 5 === 0 ? 'bg-primary' : i % 3 === 0 ? 'bg-primary-container' : i % 2 === 0 ? 'bg-primary-fixed' : 'bg-surface-container-highest'}`}></div>
             ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
              <HeatmapLegend color="bg-surface-container-highest" label="Low" />
              <HeatmapLegend color="bg-primary-fixed" label="Moderate" />
              <HeatmapLegend color="bg-primary" label="High" />
              <HeatmapLegend color="bg-secondary" label="Peak" />
            </div>
            <p className="text-xs font-medium text-outline">Calculated across 14,202 active nodes.</p>
          </div>
        </div>

        {/* LMS Sync Latency */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-[1.5rem] p-8 specular-highlight border-l-4 border-tertiary-container/20">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-on-background">LMS Sync Latency</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-outline-variant mt-1">Infrastructure Performance</p>
          </div>
          <div className="space-y-6">
            <LatencyBar label="Canvas API" value="124ms" progress={15} color="bg-tertiary-container" bgColor="bg-tertiary-fixed" />
            <LatencyBar label="Blackboard Ultra" value="2,450ms" progress={85} color="bg-error" bgColor="bg-error-container" />
            <LatencyBar label="Moodle Cloud" value="45ms" progress={8} color="bg-primary" bgColor="bg-primary-fixed" />
          </div>
          <div className="mt-8 p-4 bg-surface-container-low rounded-xl border-t-2 border-primary-container/30">
            <p className="text-xs text-on-surface-variant italic">"High latency detected in Blackboard nodes likely due to region-wide API rate limiting. Autoscaling engaged."</p>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatSummary label="Total Learners" value="48.2k" change="+12%" color="border-primary/20" textColor="text-primary" />
        <StatSummary label="Avg Session" value="42m" change="+5m" color="border-secondary/20" textColor="text-secondary" />
        <StatSummary label="AI Gen Content" value="1.2M" change="+24%" color="border-tertiary-container/20" textColor="text-tertiary-container" />
        <StatSummary label="System Health" value="99.9%" change="Stable" color="border-error/20" textColor="text-error" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full ${color}`}></span>
    <span className="text-xs font-medium text-on-surface-variant">{label}</span>
  </div>
);

const HeatmapLegend = ({ color, label }: any) => (
  <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-sm ${color}`}></span> {label}</span>
);

const LatencyBar = ({ label, value, progress, color, bgColor }: any) => (
  <div className="relative pt-1">
    <div className="flex mb-2 items-center justify-between">
      <div><span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${color.replace('bg-', 'text-')} ${bgColor}`}>{label}</span></div>
      <div className="text-right"><span className={`text-xs font-semibold inline-block ${color.replace('bg-', 'text-')}`}>{value}</span></div>
    </div>
    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-surface-container-highest">
      <div className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color}`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const StatSummary = ({ label, value, change, color, textColor }: any) => (
  <div className={`bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-2 ${color}`}>
    <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black text-on-background">{value}</span>
      <span className={`text-[10px] ${textColor} font-bold`}>{change}</span>
    </div>
  </div>
);

export default AdminAnalytics;
