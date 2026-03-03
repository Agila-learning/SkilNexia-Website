import React from 'react'; // HMR Trigger
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import StudentPayments from './pages/StudentPayments';
import AdminPayments from './pages/AdminPayments';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Placements from './pages/Placements';
import Programs from './pages/Programs';
import Courses from './pages/Courses';
import AboutUs from './pages/AboutUs';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import PublicLayout from './layouts/PublicLayout';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Compliance from './pages/Compliance';

import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

import HRDashboard from './pages/HRDashboard';

// Placeholders for Pages
const DashboardPlaceholder = ({ title }) => (
  <div className="p-8 animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-4">{title}</h1>
    <p className="text-slate-500 max-w-lg mb-8">This module is currently being provisioned. End-to-end data pipelines for this section will be available in the next release cycle.</p>
    <div className="w-24 h-1 bg-accent-500 rounded-full animate-pulse"></div>
  </div>
);

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Wait for auth init
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Global Page Animation Wrapper
const PageWrapper = ({ children }) => {
  const location = useLocation();
  const pageRef = React.useRef(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (pageRef.current) {
      gsap.fromTo(pageRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [location.pathname]);

  return <div ref={pageRef} className="w-full h-full">{children}</div>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col">
        {/* Main Content Area */}
        <main className="flex-grow">
          <PageWrapper>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/placements" element={<Placements />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/courses/:courseId/player" element={<CoursePlayer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/compliance" element={<Compliance />} />
              </Route>

              {/* Dashboard Routed Wrapped inside DashboardLayout */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<DashboardPlaceholder title="Admin Courses" />} />
                <Route path="users" element={<DashboardPlaceholder title="User Management" />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="settings" element={<DashboardPlaceholder title="System Settings" />} />
              </Route>

              <Route path="/trainer" element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<TrainerDashboard />} />
                <Route path="batches" element={<DashboardPlaceholder title="My Batches" />} />
                <Route path="lectures" element={<DashboardPlaceholder title="Lecture Recordings" />} />
              </Route>

              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<StudentDashboard />} />
                <Route path="payments" element={<StudentPayments />} />
              </Route>

              <Route path="/hr" element={
                <ProtectedRoute allowedRoles={['hr', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<HRDashboard />} />
                <Route path="referrals" element={<DashboardPlaceholder title="Candidate Referrals" />} />
                <Route path="pipeline" element={<DashboardPlaceholder title="Hiring Pipeline" />} />
              </Route>

            </Routes>
          </PageWrapper>
        </main>
      </div>
    </Router>
  );
}

export default App;
