import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="bg-white/40 backdrop-blur-xl border-b border-neutral-100 sticky top-0 z-30 flex justify-between items-center w-full px-8 py-5">
      <div className="flex items-center gap-4">
        <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 lg:hidden cursor-pointer"
        >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">terminal</span>
            </div>
        </div>

        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-3">
           <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
           {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-neutral-900">Alex Rivera</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em] leading-none">Beginner Lv.</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center font-black text-primary border border-neutral-100 relative group overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
