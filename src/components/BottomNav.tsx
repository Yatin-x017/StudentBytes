import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const mobileNavItems = [
  { name: 'Home', icon: 'grid_view', path: '/dashboard' },
  { name: 'Practice', icon: 'fitness_center', path: '/dashboard/practice' },
  { name: 'Route', icon: 'map', path: '/dashboard/learning-path' },
  { name: 'Feed', icon: 'forum', path: '/dashboard/community' },
  { name: 'Profile', icon: 'account_circle', path: '/dashboard/profile' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/40 backdrop-blur-2xl border-t border-white/40 lg:hidden z-[100] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-3 rounded-2xl transition-all relative ${
              isActive
                ? 'text-primary'
                : 'text-neutral-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-2xl relative z-10">{item.icon}</span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-primary/5 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
