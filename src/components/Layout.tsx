import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <div className="h-24 lg:hidden"></div> {/* Spacer for mobile nav */}
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
