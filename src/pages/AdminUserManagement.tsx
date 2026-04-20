import React from 'react';

const AdminUserManagement: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Academic Administration</span>
          <h1 className="text-5xl font-black tracking-tight text-on-surface leading-tight">User Management</h1>
          <p className="text-outline text-lg max-w-xl">Oversee ecosystem health, track mastery metrics, and manage administrative privileges across the intelligent atelier.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high px-6 py-3 rounded-xl font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:translate-y-[-2px] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_add</span>
            Add User
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Students" value="1,284" change="+12% this month" trend="up" />
        <StatCard label="Instructors" value="42" change="Active session capacity: 88%" />
        <StatCard label="At Risk" value="18" change="Requires immediate intervention" variant="error" />
        <StatCard label="Top Performers" value="156" change="Mastery Index > 92%" variant="primary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* User Table */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-[1.5rem] ambient-shadow rim-light overflow-hidden">
          <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
            <div className="flex gap-4">
              <button className="text-sm font-bold text-primary border-b-2 border-primary pb-1">All Users</button>
              <button className="text-sm font-medium text-outline hover:text-on-surface transition-all">At Risk</button>
              <button className="text-sm font-medium text-outline hover:text-on-surface transition-all">Top Performers</button>
            </div>
            <span className="text-xs font-bold text-outline">Viewing 1-10 of 1,326</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Activity</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Mastery Index</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                <UserRow name="Elena Rodriguez" email="e.rodriguez@eduadapt.com" role="Student" activity="Daily" lastSeen="2m ago" mastery={94} status="Online" />
                <UserRow name="Julian Vance" email="j.vance@eduadapt.com" role="Student" activity="Inactive" lastSeen="5d ago" mastery={32} status="At Risk" variant="error" />
                <UserRow name="Dr. Marcus Chen" email="m.chen@eduadapt.com" role="Instructor" activity="High" lastSeen="Moderating 4 labs" status="Offline" />
                <UserRow name="Sarah Jenkins" email="s.jenkins@eduadapt.com" role="Student" activity="Steady" lastSeen="4h ago" mastery={78} status="Offline" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] rim-light ambient-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 ai-pulse-gradient"></div>
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 border-2 border-white shadow-sm" />
                <div>
                  <h3 className="text-2xl font-black text-on-surface">Elena Rodriguez</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Quantum Computing Path</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <span className="material-symbols-outlined text-outline">more_vert</span>
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-4">Login Frequency (Last 7 Days)</p>
                <div className="flex items-end justify-between h-24 gap-2">
                  <div className="w-full bg-primary/10 rounded-t-lg h-[60%]"></div>
                  <div className="w-full bg-primary/10 rounded-t-lg h-[40%]"></div>
                  <div className="w-full bg-primary/10 rounded-t-lg h-[85%]"></div>
                  <div className="w-full bg-primary/10 rounded-t-lg h-[95%]"></div>
                  <div className="w-full bg-primary rounded-t-lg h-[100%]"></div>
                  <div className="w-full bg-primary/10 rounded-t-lg h-[50%]"></div>
                  <div className="w-full ai-pulse-gradient rounded-t-lg h-[90%]"></div>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">AI Tutor Engagement</p>
                <EngagementRow label="Session Duration" value="42m Avg." />
                <EngagementRow label="Questions Asked" value="12 / day" />
                <EngagementRow label="Success Rate" value="91%" highlight />
              </div>
              <button className="w-full py-4 bg-white border border-outline-variant/30 text-on-surface font-bold text-sm rounded-xl hover:bg-surface-container-low transition-all">
                View Full Academic Portfolio
              </button>
            </div>
          </div>

          <div className="bg-error/5 p-6 rounded-[2rem] border border-error/10">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center text-error">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <p className="text-sm font-bold text-error">Anomaly Detected</p>
                <p className="text-xs text-on-error-container">Julian Vance's engagement dropped 64%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, change, trend, variant }: any) => (
  <div className={`bg-surface-container-lowest p-6 rounded-[1.5rem] rim-light ambient-shadow ${variant === 'error' ? 'border-t-4 border-error/20' : ''}`}>
    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${variant === 'error' ? 'text-error' : variant === 'primary' ? 'text-primary' : 'text-outline'}`}>{label}</p>
    <p className={`text-3xl font-black ${variant === 'error' ? 'text-error' : 'text-on-surface'}`}>{value}</p>
    <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-slate-400'}`}>
      {trend === 'up' && <span className="material-symbols-outlined text-xs">trending_up</span>} {change}
    </div>
  </div>
);

const UserRow = ({ name, email, role, activity, lastSeen, mastery, status, variant }: any) => (
  <tr className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${variant === 'error' ? 'bg-error/5' : 'bg-white'}`}>
    <td className="px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 grayscale group-hover:grayscale-0 transition-all" />
        <div>
          <p className="font-bold text-on-surface">{name}</p>
          <p className="text-xs text-outline">{email}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-5">
      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${role === 'Instructor' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>{role}</span>
    </td>
    <td className="px-6 py-5">
      <p className="text-sm font-medium">{activity}</p>
      <p className="text-[10px] text-outline">{lastSeen}</p>
    </td>
    <td className="px-6 py-5">
      {mastery !== undefined ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden w-24">
            <div className={`h-full ${variant === 'error' ? 'bg-error' : 'ai-pulse-gradient'}`} style={{ width: `${mastery}%` }}></div>
          </div>
          <span className={`text-sm font-black ${variant === 'error' ? 'text-error' : 'text-primary'}`}>{mastery}%</span>
        </div>
      ) : <span className="text-xs font-bold text-outline">N/A (Staff)</span>}
    </td>
    <td className="px-6 py-5">
      <span className={`flex items-center gap-1.5 text-xs font-bold ${status === 'Online' ? 'text-green-600' : status === 'At Risk' ? 'text-error' : 'text-slate-400'}`}>
        <span className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-green-600' : status === 'At Risk' ? 'bg-error' : 'bg-slate-400'}`}></span> {status}
      </span>
    </td>
  </tr>
);

const EngagementRow = ({ label, value, highlight = false }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-sm font-medium">{label}</span>
    <span className={`text-sm font-black ${highlight ? 'text-primary' : 'text-on-surface'}`}>{value}</span>
  </div>
);

export default AdminUserManagement;
