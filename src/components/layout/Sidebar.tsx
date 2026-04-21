import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Terminal,
  Settings,
  LayoutDashboard,
  MessageSquare,
  GraduationCap,
  FileText,
  TrendingUp,
  Users,
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Card } from '../ui/Card';

export const Sidebar: React.FC = () => {
  const { state } = useAppContext();
  const location = useLocation();

  const mainNav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { label: 'Study AI', icon: MessageSquare, path: ROUTES.STUDY },
    { label: 'Mastery Quiz', icon: GraduationCap, path: ROUTES.QUIZ },
    { label: 'Knowledge', icon: FileText, path: ROUTES.NOTES },
  ];

  const secondaryNav = [
    { label: 'Analytics', icon: TrendingUp, path: ROUTES.ANALYTICS },
    { label: 'Community', icon: Users, path: ROUTES.COMMUNITY },
    { label: 'Settings', icon: Settings, path: ROUTES.SETTINGS },
  ];

  return (
    <aside className="w-72 border-r border-white/5 h-screen sticky top-0 hidden lg:flex flex-col bg-bg overflow-hidden">
      <div className="p-8">
        <Link to={ROUTES.LANDING} className="flex items-center gap-3 group">
          <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/20 group-hover:scale-110 transition-all duration-300">
            <Terminal size={24} className="text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter">Student Bytes</span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-8 py-4 overflow-y-auto custom-scrollbar">
        <div>
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4">Main Menu</h3>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all group relative',
                      isActive
                        ? 'text-white bg-white/5 shadow-sm border border-white/5'
                        : 'text-text-muted hover:text-white hover:bg-white/2 border border-transparent'
                    )
                  }
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                    {item.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4">Platform</h3>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all group relative',
                      isActive
                        ? 'text-white bg-white/5 shadow-sm border border-white/5'
                        : 'text-text-muted hover:text-white hover:bg-white/2 border border-transparent'
                    )
                  }
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                    {item.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill-sec"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="px-4">
          <Card className="p-5 border-primary/20 bg-primary/5 rounded-3xl relative overflow-hidden group cursor-pointer" onClick={() => {}}>
             <div className="absolute -right-4 -bottom-4 text-primary opacity-10 group-hover:scale-110 transition-transform">
               <Zap size={80} />
             </div>
             <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Upgrade to Pro</p>
             <p className="text-xs font-bold mb-3 leading-tight">Get unlimited AI study sessions & advanced analytics.</p>
             <div className="flex items-center gap-1 text-[10px] font-black text-white bg-primary py-1.5 px-3 rounded-lg w-fit shadow-lg shadow-primary/20">
               LEARN MORE
             </div>
          </Card>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-white/2 backdrop-blur-md">
        <Link
          to={ROUTES.PROFILE}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 group-hover:rotate-3 transition-transform">
            {state.user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{state.user.name}</p>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Level {state.user.level} Coder</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        </Link>
      </div>
    </aside>
  );
};
