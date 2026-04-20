import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex selection:bg-primary/20 selection:text-primary">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-0">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
        <div className="h-24 lg:hidden"></div> {/* Spacer for mobile nav */}
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
