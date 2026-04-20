import React from 'react';
import { NavLink } from 'react-router-dom';

const mobileNavItems = [
  { name: 'Assistant', icon: 'auto_awesome', path: '/dashboard' },
  { name: 'Practice', icon: 'fitness_center', path: '/dashboard/practice' },
  { name: 'Learning', icon: 'map', path: '/dashboard/learning-path' },
  { name: 'Feed', icon: 'forum', path: '/dashboard/community' },
  { name: 'Profile', icon: 'account_circle', path: '/dashboard/profile' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-outline-variant/10 lg:hidden z-[100] rounded-t-[2rem] shadow-[0_-12px_40px_rgba(26,28,31,0.08)]">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-90 ${
              isActive
                ? 'bg-primary/5 text-primary'
                : 'text-outline'
            }`
          }
        >
          <span className="material-symbols-outlined text-xl">{item.icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
