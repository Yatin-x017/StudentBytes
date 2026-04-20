import React from 'react';

const AdminIntegrations: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto pt-6 px-8 pb-32">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">Integration Engine</h1>
          <p className="text-on-surface-variant max-w-md">Orchestrate LMS connections and fine-tune machine learning models across the EduAdapt ecosystem.</p>
        </div>
        <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 specular-highlight shadow-lg active:scale-95 transition-all">
          <span className="material-symbols-outlined">sync</span>
          Force Sync All
        </button>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Status Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <IntegrationCard
            name="Canvas LMS"
            lastSync="4m ago"
            stability={99.9}
            progress={88}
            status="Active"
            statusColor="emerald"
            icon="school"
          />
          <IntegrationCard
            name="Newton School"
            lastSync="Passive monitoring"
            stability={null}
            progress={45}
            status="Standby"
            statusColor="amber"
            icon="hub"
          />
        </div>

        {/* Global AI Tuning */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgba(26,28,31,0.04)] glass-panel relative">
          <div className="absolute top-0 left-0 w-full h-1 ai-pulse-gradient"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl ai-pulse-gradient flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Global AI Tuning</h2>
              <p className="text-sm text-on-surface-variant">Adjust hyper-parameters for cross-integration intelligence.</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-on-surface">Engine Sensitivity</label>
                <span className="text-2xl font-black text-primary">0.84<span className="text-sm font-medium text-outline ml-1">σ</span></span>
              </div>
              <input type="range" className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" defaultValue="84" />
              <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-widest">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <TuningParam label="Token Persistence" value="High (48h)" />
              <TuningParam label="Sampling Temperature" value="0.72" />
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-3 px-6 rounded-xl bg-surface-container-high font-bold text-sm text-on-surface-variant hover:bg-surface-variant transition-colors">Reset Defaults</button>
              <button className="flex-[2] py-3 px-6 rounded-xl ai-pulse-gradient font-bold text-sm text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Apply Parameters</button>
            </div>
          </div>
        </div>

        {/* Sync Logs Feed */}
        <div className="col-span-12 bg-surface-container-lowest rounded-[1.5rem] shadow-[0_12px_40px_rgba(26,28,31,0.08)] overflow-hidden">
          <div className="p-8 border-b border-surface-container">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-on-surface">Sync Logs Feed</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">Live</span>
                <span className="px-3 py-1 rounded-full bg-surface-container-low text-outline text-[10px] font-bold uppercase tracking-widest">Filter: All</span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-surface-container">
            <LogItem
              title="Canvas API: Resource Batch #9921"
              time="12:45:02"
              description="Successfully ingested 421 student artifacts and updated taxonomy vectors."
              type="success"
            />
            <LogItem
              title="Newton Sync: Rate Limit Warning"
              time="12:41:55"
              description="Approaching API threshold. Sync frequency automatically adjusted to 10m intervals."
              type="warning"
            />
            <LogItem
              title="Vector DB: Re-indexing Complete"
              time="12:30:10"
              description="Knowledge graph refreshed. Global AI tuning parameters applied to all active sessions."
              type="success"
            />
          </div>
          <div className="p-4 bg-surface-container-low text-center">
            <button className="text-sm font-bold text-primary hover:underline">View All Historical Logs</button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
        <MetricCard icon="database" label="Database Size" value="2.4 TB" change="+12% wk" color="text-primary" />
        <MetricCard icon="speed" label="Latency (P95)" value="142 ms" change="Stable" color="text-secondary" />
        <MetricCard icon="neurology" label="AI Inferences" value="8.2M" change="Real-time" color="text-tertiary-container" />
      </div>
    </div>
  );
};

const IntegrationCard = ({ name, lastSync, stability, progress, status, statusColor, icon }: any) => (
  <div className="bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgba(26,28,31,0.04)] relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
      <span className="material-symbols-outlined text-6xl">{icon}</span>
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-2 h-2 rounded-full bg-${statusColor}-500 ${statusColor === 'emerald' ? 'animate-pulse' : ''}`}></div>
      <span className={`text-xs font-bold text-${statusColor}-600 tracking-widest uppercase`}>{status}</span>
    </div>
    <h3 className="text-2xl font-bold text-on-surface mb-1">{name}</h3>
    <p className="text-sm text-on-surface-variant mb-6">Last synced: {lastSync}</p>
    <div className="bg-surface-container-low h-1 rounded-full overflow-hidden">
      <div className={`${statusColor === 'emerald' ? 'bg-primary' : 'bg-outline-variant'} h-full`} style={{ width: `${progress}%` }}></div>
    </div>
    <div className="mt-2 flex justify-between text-[10px] font-bold text-outline uppercase tracking-wider">
      <span>{stability ? 'Stability' : 'Ready State'}</span>
      <span>{stability ? `${stability}%` : 'Linked'}</span>
    </div>
  </div>
);

const TuningParam = ({ label, value }: { label: string, value: string }) => (
  <div className="p-4 rounded-xl bg-surface-container-low border border-white/40">
    <p className="text-xs font-bold text-outline mb-1 uppercase tracking-tighter">{label}</p>
    <p className="text-lg font-bold text-on-surface">{value}</p>
  </div>
);

const LogItem = ({ title, time, description, type }: any) => (
  <div className="p-6 flex items-center gap-6 hover:bg-surface-container-low transition-colors group">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
      <span className="material-symbols-outlined text-xl">{type === 'success' ? 'check_circle' : 'warning'}</span>
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-on-surface">{title}</h4>
        <span className="text-xs text-outline font-medium">{time}</span>
      </div>
      <p className="text-sm text-on-surface-variant mt-1">{description}</p>
    </div>
  </div>
);

const MetricCard = ({ icon, label, value, change, color }: any) => (
  <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-4">
    <div className={`p-3 bg-white rounded-xl shadow-sm ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{label}</p>
      <p className="text-xl font-bold text-on-surface">{value} <span className={`${change === 'Stable' ? 'text-emerald-500' : 'text-primary'} text-xs font-normal`}>{change}</span></p>
    </div>
  </div>
);

export default AdminIntegrations;
