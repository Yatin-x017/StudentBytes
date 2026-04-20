import React from 'react';
import { NavLink } from 'react-router-dom';

const mobileNavItems = [
  { name: 'Home', icon: 'home', path: '/' },
  { name: 'Path', icon: 'rebase_edit', path: '/learning-path' },
  { name: 'Tutor', icon: 'auto_awesome', path: '/ai-tutor' },
  { name: 'Feed', icon: 'forum', path: '/community' },
  { name: 'Profile', icon: 'account_circle', path: '/profile' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-white/20 lg:hidden z-[100] rounded-t-[1.5rem] shadow-[0_-12px_40px_rgba(26,28,31,0.08)]">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-2 rounded-2xl transition-transform active:scale-90 ${
              isActive
                ? 'bg-gradient-to-br from-primary/10 to-secondary/10 text-primary dark:text-[#68d3ff]'
                : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          <span className="material-symbols-outlined text-lg">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
