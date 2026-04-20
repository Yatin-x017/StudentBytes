import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../hooks/useUserStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { store } = useUserStore();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'AI Assistant';
    if (path === '/dashboard/practice') return 'Practice Lab';
    if (path === '/dashboard/learning-path') return 'Learning Path';
    if (path === '/dashboard/ai-tutor') return 'AI Tutor';
    if (path === '/dashboard/analytics') return 'Analytics';
    if (path === '/dashboard/community') return 'Community';
    if (path === '/dashboard/profile') return 'Profile';
    return 'Student Bytes';
  };

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 sticky top-0 z-40 flex justify-between items-center w-full px-6 py-4">
      <div className="flex items-center gap-4">
        <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 lg:hidden cursor-pointer"
        >
            <div className="w-8 h-8 ai-pulse-gradient rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">terminal</span>
            </div>
            <span className="text-xl font-black tracking-tighter">SB</span>
        </div>

        <h1 className="text-lg font-black tracking-tight text-on-surface flex items-center gap-2">
           <span className="w-1.5 h-6 bg-primary rounded-full"></span>
           {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/10">
            <span className="material-symbols-outlined text-primary text-sm">bolt</span>
            <span className="text-sm font-black">{store.xp} XP</span>
        </div>

        <div className="w-px h-6 bg-outline-variant/20 mx-2"></div>

        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-black tracking-tight">Alex Rivera</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">{store.level} Lv.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center font-black text-primary border border-outline-variant/20 relative group">
                AR
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
