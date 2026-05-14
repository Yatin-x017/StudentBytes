import React from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Settings,
  LayoutDashboard,
  MessageSquare,
  GraduationCap,
  FileText,
  TrendingUp,
  Users,
  Zap,
  ChevronRight,
  CalendarDays,
  Brain,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export const Sidebar: React.FC = () => {
  const { state } = useAppContext();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const mainNav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { label: 'Study AI', icon: MessageSquare, path: ROUTES.STUDY },
    { label: 'Mastery Quiz', icon: Brain, path: ROUTES.QUIZ },
    { label: 'Knowledge', icon: FileText, path: ROUTES.NOTES },
    { label: 'Canvas', icon: GraduationCap, path: ROUTES.CANVAS },
    { label: 'Timetable', icon: CalendarDays, path: ROUTES.TIMETABLE },
  ];

  const secondaryNav = [
    { label: 'Analytics', icon: TrendingUp, path: ROUTES.ANALYTICS },
    { label: 'Community', icon: Users, path: ROUTES.COMMUNITY },
    { label: 'Settings', icon: Settings, path: ROUTES.SETTINGS },
  ];

  const hasKey = state.settings.provider === 'gemini'
    ? !!state.settings.geminiApiKey
    : !!state.apiKey;

  return (
    <aside className="w-[240px] border-r border-border h-screen sticky top-0 hidden lg:flex flex-col bg-surface/95 backdrop-blur-xl z-30 overflow-hidden">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <Zap size={18} className="text-white fill-white" />
        </div>
        <div>
          <span className="font-display font-black text-base tracking-tight">Student</span>
          <span className="font-display font-black text-base tracking-tight text-primary">Bytes</span>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-8 py-4 overflow-y-auto custom-scrollbar">
        {/* Main Menu */}
        <div>
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-faint mb-4">Main Menu</h3>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                      isActive
                        ? 'text-primary bg-primary/10 border border-primary/20'
                        : 'text-text-muted hover:text-text hover:bg-surface-2 border border-transparent'
                    )
                  }
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                    {item.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-4 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Platform */}
        <div>
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-faint mb-4">Platform</h3>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                      isActive
                        ? 'text-primary bg-primary/10 border border-primary/20'
                        : 'text-text-muted hover:text-text hover:bg-surface-2 border border-transparent'
                    )
                  }
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <item.icon size={18} className={cn("transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                    {item.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill-sec"
                      className="absolute left-0 w-1 h-4 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Built-in AI Indicator */}
        {!hasKey && (
          <div className="mx-2 p-4 rounded-xl bg-surface-2 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Built-in AI</p>
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed mb-3">
              Unlimited with your own key.
            </p>
            <button
              onClick={() => navigate(ROUTES.SETTINGS)}
              className="text-[10px] font-bold text-text hover:underline uppercase tracking-tighter"
            >
              Add Key →
            </button>
          </div>
        )}
      </div>

      {/* User Area */}
      <div className="p-4 border-t border-border bg-surface-2/30 backdrop-blur-md">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-surface-2 transition-all group">
            <Link to={ROUTES.PROFILE} className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="w-9 h-9 rounded-lg object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black text-sm">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                <div className="flex items-center gap-1">
                   <Zap size={8} className="text-primary fill-primary" />
                   <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Level {state.user.level}</span>
                </div>
              </div>
            </Link>
            <button
              onClick={() => signOut()}
              className="p-2 text-text-muted hover:text-error transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group"
          >
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                 <Users size={16} />
               </div>
               <span className="text-xs font-black uppercase tracking-widest text-primary">Sync Data</span>
            </div>
            <ChevronRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </aside>
  );
};
