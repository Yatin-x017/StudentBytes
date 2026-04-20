import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
  { name: 'Practice', icon: 'fitness_center', path: '/dashboard/practice' },
  { name: 'Progress', icon: 'analytics', path: '/dashboard/analytics' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <aside className="bg-white/40 backdrop-blur-xl h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col p-8 gap-12 z-40 border-r border-neutral-100">
      <div
        className="px-2 flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-white text-2xl">terminal</span>
        </div>
        <div>
            <span className="text-xl font-black text-neutral-900 tracking-tighter block leading-none">Student Bytes</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold">Premium</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group",
                isActive
                  ? "text-primary font-bold bg-primary/5"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn(
                  "material-symbols-outlined text-2xl transition-colors",
                  isActive ? "text-primary" : "text-neutral-400 group-hover:text-neutral-600"
                )}>
                  {item.icon}
                </span>
                <span className="text-[15px]">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-neutral-100">
        <NavLink
          to="/dashboard/profile"
          className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-all font-medium group"
        >
          <span className="material-symbols-outlined text-2xl text-neutral-400 group-hover:text-neutral-600 transition-colors">settings</span>
          <span className="text-[15px]">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
