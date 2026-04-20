import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex selection:bg-primary/20 selection:text-primary">
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
