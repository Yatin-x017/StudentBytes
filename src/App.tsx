import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ROUTES } from '@/lib/constants';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';

// Pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const StudyPage = lazy(() => import('@/pages/StudyPage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ProfileOnboardingPage = lazy(() => import('@/pages/ProfileOnboardingPage'));
const CanvasPage = lazy(() => import('@/pages/CanvasPage'));
const TimetablePage = lazy(() => import('@/pages/TimetablePage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const SharedNotePage = lazy(() => import('@/pages/SharedNotePage'));

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center bg-bg"
      >
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div
        className="h-screen w-full flex items-center justify-center bg-bg"
      >
        <Spinner size={32} className="text-primary" />
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path={ROUTES.SHARED_NOTE} element={<SharedNotePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={
          user ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginPage />
        } />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.ONBOARDING} element={<ProfileOnboardingPage />} />
          <Route element={<Layout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.STUDY} element={<StudyPage />} />
            <Route path={ROUTES.QUIZ} element={<QuizPage />} />
            <Route path={ROUTES.NOTES} element={<NotesPage />} />
            <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
            <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.CANVAS} element={<CanvasPage />} />
            <Route path={ROUTES.TIMETABLE} element={<TimetablePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
