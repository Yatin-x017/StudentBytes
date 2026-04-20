import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import LearningPath from './pages/LearningPath';
import AdaptiveQuiz from './pages/AdaptiveQuiz';
import StudentAnalytics from './pages/StudentAnalytics';
import CommunityFeed from './pages/CommunityFeed';
import StudentProfile from './pages/StudentProfile';
import AdminIntegrations from './pages/AdminIntegrations';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminAnalytics from './pages/AdminAnalytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="ai-tutor" element={<AdaptiveQuiz />} /> {/* Using Quiz as AI Tutor placeholder for this exercise */}
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
