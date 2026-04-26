import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Spinner } from '@/components/ui/Spinner';

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{ backgroundColor: '#0f0f13' }}
        className="h-screen w-full flex items-center justify-center"
      >
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  // If Supabase not configured, allow access without auth
  if (!isSupabaseConfigured) return <Outlet />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
