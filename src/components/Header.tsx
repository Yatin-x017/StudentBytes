import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'AI Assistant';
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
        <button className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
          <span className="material-symbols-outlined">search</span>
        </button>
        <div className="w-px h-6 bg-outline-variant/20 mx-2"></div>
        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-black tracking-tight">Alex Rivera</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Pro Student</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center font-black text-primary border border-outline-variant/20">
                AR
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
