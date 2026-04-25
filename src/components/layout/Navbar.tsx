import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Menu, X, Zap, ChevronRight, LayoutDashboard, MessageSquare } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav className={cn(
      "border-b border-white/5 sticky top-0 z-50 transition-all duration-300",
      isLanding ? "bg-black/50 backdrop-blur-xl" : "bg-bg/80 backdrop-blur-md"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-2">
            <Link to={ROUTES.LANDING} className="flex items-center gap-3 group">
              <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Terminal size={22} className="text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter">Student Bytes</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 mr-4">
              <NavLink to={ROUTES.COMMUNITY} label="Community" />
              <NavLink to={ROUTES.QUIZ} label="Quizzes" />
            </nav>
            <div className="h-6 w-px bg-white/10" />
            <Button variant="ghost" className="font-bold gap-2" onClick={() => navigate(ROUTES.DASHBOARD)}>
              <LayoutDashboard size={18} /> Dashboard
            </Button>
            {user ? (
              <div
                onClick={() => navigate(ROUTES.PROFILE)}
                className="flex items-center gap-3 pl-2 cursor-pointer group"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-text-muted">Signed In</p>
                  <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                    {profile?.full_name || user.email}
                  </p>
                </div>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:border-primary/50 transition-all"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black shadow-lg shadow-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                    {(profile?.full_name || user.email)?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <Button className="font-black px-6 rounded-xl shadow-lg shadow-primary/20" onClick={() => navigate(ROUTES.SETTINGS)}>
                Get Started
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-muted hover:text-text p-2 rounded-xl bg-white/5 border border-white/5"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl p-6 space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 gap-2">
             <MobileNavLink to={ROUTES.DASHBOARD} icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
             <MobileNavLink to={ROUTES.STUDY} icon={<MessageSquare size={18} />} label="Study AI" onClick={() => setIsOpen(false)} />
             <MobileNavLink to={ROUTES.COMMUNITY} icon={<Zap size={18} />} label="Community" onClick={() => setIsOpen(false)} />
          </div>
          <div className="h-px bg-white/10 my-4" />
          <Button className="w-full py-6 text-base font-black rounded-2xl" onClick={() => { navigate(ROUTES.SETTINGS); setIsOpen(false); }}>
            Get Started
          </Button>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label }: { to: string, label: string }) => (
  <Link
    to={to}
    className="text-sm font-bold text-text-muted hover:text-white transition-colors"
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, icon, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 font-bold"
  >
    <div className="text-primary">{icon}</div>
    {label}
    <ChevronRight size={16} className="ml-auto opacity-30" />
  </Link>
);
