import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Settings, LayoutDashboard, MessageSquare, GraduationCap,
  FileText, TrendingUp, Users, Zap, CalendarDays, Brain,
  LogOut, ChevronRight, User, Sun, Moon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

// Simple theme toggle hook
function useTheme() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    () => (localStorage.getItem('sb_theme') as 'light' | 'dark') || 'light'
  );
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sb_theme', theme);
  }, [theme]);
  return { theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') };
}

const NAV_MAIN = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: 'Study AI',     icon: MessageSquare,   path: ROUTES.STUDY },
  { label: 'Mastery Quiz', icon: Brain,            path: ROUTES.QUIZ },
  { label: 'Knowledge',    icon: FileText,         path: ROUTES.NOTES },
  { label: 'Canvas',       icon: GraduationCap,    path: ROUTES.CANVAS },
  { label: 'Timetable',    icon: CalendarDays,     path: ROUTES.TIMETABLE },
];

const NAV_PLATFORM = [
  { label: 'Analytics',  icon: TrendingUp, path: ROUTES.ANALYTICS },
  { label: 'Community',  icon: Users,       path: ROUTES.COMMUNITY },
  { label: 'Settings',   icon: Settings,    path: ROUTES.SETTINGS },
];

export const Sidebar: React.FC = () => {
  const { state } = useAppContext();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const hasKey = state.settings.provider === 'gemini'
    ? !!state.settings.geminiApiKey
    : !!state.apiKey;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student';

  return (
    <aside className="w-[240px] h-screen sticky top-0 hidden lg:flex flex-col glass-sidebar z-30 overflow-hidden">

      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <div>
            <span className="font-display font-black text-[15px] tracking-tight text-text">
              Student
            </span>
            <span className="font-display font-black text-[15px] tracking-tight text-primary">
              Bytes
            </span>
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-xl hover:bg-primary/8 text-text-muted hover:text-primary transition-all"
          title="Toggle theme"
        >
          {theme === 'light'
            ? <Moon size={15} />
            : <Sun size={15} className="text-warning" />
          }
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 space-y-6 py-2 overflow-y-auto no-scrollbar">

        {/* Main */}
        <div>
          <p className="px-3 text-[9px] font-black uppercase tracking-[0.25em] text-text-faint mb-3">
            Main Menu
          </p>
          <nav className="space-y-0.5">
            {NAV_MAIN.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    isActive
                      ? 'nav-active'
                      : 'text-text-muted hover:text-text hover:bg-white/50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={17}
                        className={cn(
                          'transition-colors shrink-0',
                          isActive ? 'text-primary' : 'group-hover:text-primary'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive
                      ? <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      : <ChevronRight
                          size={13}
                          className="opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all"
                        />
                    }
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Platform */}
        <div>
          <p className="px-3 text-[9px] font-black uppercase tracking-[0.25em] text-text-faint mb-3">
            Platform
          </p>
          <nav className="space-y-0.5">
            {NAV_PLATFORM.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    isActive
                      ? 'nav-active'
                      : 'text-text-muted hover:text-text hover:bg-white/50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={17}
                        className={cn(
                          'transition-colors shrink-0',
                          isActive ? 'text-primary' : 'group-hover:text-primary'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive
                      ? <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      : <ChevronRight
                          size={13}
                          className="opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all"
                        />
                    }
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Built-in AI note */}
        {!hasKey && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-1 p-4 rounded-2xl glass-primary"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-glow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Free AI Active
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed mb-3">
              Add your own key for unlimited usage.
            </p>
            <button
              onClick={() => navigate(ROUTES.SETTINGS)}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              Add key →
            </button>
          </motion.div>
        )}
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-white/60">
        {user ? (
          <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/50 transition-all group cursor-pointer"
               onClick={() => navigate(ROUTES.PROFILE)}>
            <div className="relative shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-sm shadow-sm">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text truncate">{displayName}</p>
              <div className="flex items-center gap-1">
                <Zap size={9} className="text-primary fill-primary" />
                <span className="text-[9px] font-black text-primary uppercase tracking-tight">
                  Level {state.user.level} · {state.user.xp} XP
                </span>
              </div>
            </div>

            <button
              onClick={e => { e.stopPropagation(); signOut(); }}
              className="p-1.5 rounded-lg text-text-faint hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-3 p-3 rounded-xl glass-primary hover:shadow-glow transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <User size={15} className="text-white" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-black text-primary">Sign In</span>
              <p className="text-[9px] text-text-muted">Sync your progress</p>
            </div>
            <ChevronRight size={13} className="text-primary group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </aside>
  );
};
