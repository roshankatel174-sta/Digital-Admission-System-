import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Colleges from './pages/public/Colleges';
import CollegeDetail from './pages/public/CollegeDetail';
import Courses from './pages/public/Courses';
import CourseDetail from './pages/public/CourseDetail';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import MyApplications from './pages/student/MyApplications';
import AdmissionForm from './pages/student/AdmissionForm';
import UploadDocuments from './pages/student/UploadDocuments';
import StudentPayments from './pages/student/Payments';
import ApplicationStatus from './pages/student/ApplicationStatus';
import StudentMessages from './pages/student/Messages';
import StudentProfile from './pages/student/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Applicants from './pages/admin/Applicants';
import ManageColleges from './pages/admin/ManageColleges';
import ManageCourses from './pages/admin/ManageCourses';
import AdminApplications from './pages/admin/Applications';
import AdminDocuments from './pages/admin/Documents';
import AdminPayments from './pages/admin/Payments';
import Reports from './pages/admin/Reports';
import Users from './pages/admin/Users';
import AdminMessages from './pages/admin/Messages';
import Settings from './pages/admin/Settings';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/colleges/:id" element={<CollegeDetail />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/applications" element={<MyApplications />} />
            <Route path="/student/apply" element={<AdmissionForm />} />
            <Route path="/student/documents" element={<UploadDocuments />} />
            <Route path="/student/payments" element={<StudentPayments />} />
            <Route path="/student/status" element={<ApplicationStatus />} />
            <Route path="/student/messages" element={<StudentMessages />} />
            <Route path="/student/profile" element={<StudentProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/applicants" element={<Applicants />} />
            <Route path="/admin/colleges" element={<ManageColleges />} />
            <Route path="/admin/courses" element={<ManageCourses />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
