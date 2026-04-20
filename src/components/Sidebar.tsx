import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/' },
  { name: 'Learning Path', icon: 'route', path: '/learning-path' },
  { name: 'AI Tutor', icon: 'psychology', path: '/ai-tutor' },
  { name: 'Community', icon: 'groups', path: '/community' },
  { name: 'Analytics', icon: 'analytics', path: '/analytics' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-surface-container-low dark:bg-slate-900 h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col p-6 gap-2 z-40">
      <div className="mb-10 px-2">
        <span className="text-xl font-black text-on-background dark:text-white tracking-tighter">EduAdapt</span>
        <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-bold">Intelligent Atelier</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-all hover:translate-x-1 duration-300 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#68d3ff] shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 font-medium'
              }`
            }
          >
            <span className="material-symbols-outlined text-sm">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-outline-variant/20">
        <button className="ai-pulse-gradient text-white rounded-xl py-3 px-4 text-sm font-bold shadow-lg hover:scale-[1.02] transition-transform duration-300">
          Launch AI Lab
        </button>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/50 ${
              isActive ? 'text-primary' : 'text-slate-500'
            }`
          }
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
