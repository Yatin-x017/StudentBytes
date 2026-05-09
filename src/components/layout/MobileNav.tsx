import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  CalendarDays
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export const MobileNav: React.FC = () => {
  const navItems = [
    { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Home' },
    { to: ROUTES.STUDY, icon: BookOpen, label: 'Study' },
    { to: ROUTES.CANVAS, icon: GraduationCap, label: 'Canvas' },
    { to: ROUTES.TIMETABLE, icon: CalendarDays, label: 'Timetable' },
    { to: ROUTES.NOTES, icon: FileText, label: 'Notes' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-xl border-t border-border flex items-center justify-around px-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `
            flex flex-col items-center justify-center gap-1 w-full h-full transition-all
            ${isActive ? 'text-primary' : 'text-text-muted'}
          `}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
