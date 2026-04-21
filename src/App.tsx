import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Layout } from '@/components/layout/Layout';
import { ROUTES } from '@/lib/constants';
import { Spinner } from '@/components/ui/Spinner';

// Pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const StudyPage = lazy(() => import('@/pages/StudyPage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center bg-bg">
            <Spinner size={32} className="text-primary" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.STUDY} element={<StudyPage />} />
              <Route path={ROUTES.QUIZ} element={<QuizPage />} />
              <Route path={ROUTES.NOTES} element={<NotesPage />} />
              <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
              <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
