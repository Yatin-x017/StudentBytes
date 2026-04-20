import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserStore } from '../hooks/useUserStore';

const navItems = [
  { name: 'AI Assistant', icon: 'auto_awesome', path: '/dashboard' },
  { name: 'Practice Lab', icon: 'fitness_center', path: '/dashboard/practice' },
  { name: 'Learning Path', icon: 'map', path: '/dashboard/learning-path' },
  { name: 'Analytics', icon: 'analytics', path: '/dashboard/analytics' },
  { name: 'Community', icon: 'forum', path: '/dashboard/community' },
];

const Sidebar: React.FC = () => {
  const { store } = useUserStore();
  const navigate = useNavigate();

  return (
    <aside className="bg-surface-container-low dark:bg-slate-900 h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col p-6 gap-2 z-40 border-r border-outline-variant/10">
      <div className="mb-10 px-2 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 ai-pulse-gradient rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">terminal</span>
        </div>
        <div>
            <span className="text-xl font-black text-on-background dark:text-white tracking-tighter block leading-none">Student Bytes</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-black">CS Edition</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-all hover:translate-x-1 duration-300 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#68d3ff] shadow-sm font-black'
                  : 'text-outline dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 font-bold'
              }`
            }
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="bg-white/50 p-4 rounded-2xl border border-outline-variant/10">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-outline">Progress</span>
                <span className="text-[10px] font-black text-primary">{store.xp} XP</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                    className="h-full ai-pulse-gradient"
                    style={{ width: `${Math.min(100, (store.xp / 150) * 100)}%` }}
                ></div>
            </div>
        </div>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/50 ${
              isActive ? 'text-primary font-black' : 'text-outline font-bold'
            }`
          }
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          <span className="text-sm">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
