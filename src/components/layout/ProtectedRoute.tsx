import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/lib/constants';

export const ProtectedRoute: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center bg-bg"
      >
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  // If Supabase not configured, allow access without auth
  if (!isSupabaseConfigured) return <Outlet />;

  if (!user) return <Navigate to="/login" replace />;

  // Check for profile completeness (onboarding)
  // We only require display_name for the profile to be considered complete
  // This allows users to skip onboarding and fill in academic details later
  const isProfileIncomplete = !profile?.display_name;
  const isOnOnboardingPage = location.pathname === ROUTES.ONBOARDING;

  if (isProfileIncomplete && !isOnOnboardingPage) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  // If profile is complete and user is on onboarding, send them to dashboard
  if (!isProfileIncomplete && isOnOnboardingPage) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
