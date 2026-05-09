import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { ApiKeyBanner } from './ApiKeyBanner';
import { ROUTES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { CommandPalette } from '../ui/CommandPalette';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === ROUTES.LANDING;
  useKeyboardShortcuts();

  if (isLanding) {
    return (
      <div className="min-h-screen bg-bg text-text font-sans selection:bg-primary/30 transition-colors duration-300">
        <Navbar />
        <main className="pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg text-text font-sans selection:bg-primary/30">
      <CommandPalette />
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
        {/* Animated background element */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        {/* Mobile Navbar */}
        <div className="lg:hidden">
            <Navbar />
        </div>

        <main className="flex-1 p-4 md:p-8 lg:p-12 pb-24 lg:pb-12">
          {location.pathname !== ROUTES.SETTINGS && <ApiKeyBanner />}

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <MobileNav />
      </div>
    </div>
  );
};
