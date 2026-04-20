import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-background/70 backdrop-blur-3xl border-b border-white/10 sticky top-0 z-50 flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto shadow-[0_4px_20px_rgba(26,28,31,0.04)]">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary-fixed-dim lg:hidden">
          EduAdapt
        </span>
        <h1 className="hidden lg:block text-xl font-semibold text-on-surface tracking-tight">
          Student Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex bg-surface-container-low rounded-full px-4 py-2 items-center gap-3 border border-outline-variant/10">
          <span className="material-symbols-outlined text-outline text-sm">search</span>
          <input
            type="text"
            className="bg-transparent border-none focus:ring-0 text-sm w-48 font-medium placeholder:text-outline/60"
            placeholder="Search knowledge..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100/50 rounded-full transition-all text-outline">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-white shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGSA0vSNkQZo5F5JqEELJ_X4K9mOH_5R9sW-pcl8G6hySoaIgchQLRU-VN5IAvNTjTe5J0v6BEzidlDrQBj4Lynygd_N1qmffRH9Q9nOFw106pBukmUk7yHDBYZIdU-LBKdTVfMPKw8J5a0kVaVwrRLgyG6p-8rLJ3V4zfEEiWZuiO30NDADw35vKziqtm55Xvkc_DfNQrNTu5xW8UTAKFYlL5G4eHZJUK_WhvzJMSmKNKbdiYNH_HSS95_dNIXexP2pHwWxWK0OwA"
              className="h-full w-full object-cover"
              alt="Alex"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
