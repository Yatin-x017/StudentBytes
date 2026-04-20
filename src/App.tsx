import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import PracticePage from './pages/PracticePage';
import LearningPath from './pages/LearningPath';
import AdaptiveQuiz from './pages/AdaptiveQuiz';
import StudentAnalytics from './pages/StudentAnalytics';
import CommunityFeed from './pages/CommunityFeed';
import StudentProfile from './pages/StudentProfile';
import AdminIntegrations from './pages/AdminIntegrations';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminAnalytics from './pages/AdminAnalytics';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Mock Login/Signup Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="ai-tutor" element={<AdaptiveQuiz />} />
          <Route path="analytics" element={<StudentAnalytics />} />
          <Route path="community" element={<CommunityFeed />} />
          <Route path="profile" element={<StudentProfile />} />

          <Route path="admin" element={<AdminAnalytics />} />
          <Route path="admin/integrations" element={<AdminIntegrations />} />
          <Route path="admin/users" element={<AdminUserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
