import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Public Pages
import HomePage    from '../pages/HomePage';
import EventsPage  from '../pages/EventsPage';
import AboutPage   from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import EventDetailsPage from '../pages/EventDetailsPage';

// Auth Pages
import RoleSelectPage    from '../pages/Auth/RoleSelectPage';
import StudentRegister   from '../pages/Auth/StudentRegister';
import OrganizerRegister from '../pages/Auth/OrganizerRegister';
import StudentLogin      from '../pages/Auth/StudentLogin';
import OrganizerLogin    from '../pages/Auth/OrganizerLogin';
import ForgotPassword     from '../pages/Auth/ForgotPassword';
import ResetPassword      from '../pages/Auth/ResetPassword';

// Student Layout + Pages
import StudentLayout         from '../layouts/StudentLayout';
import Dashboard             from '../pages/Student/Dashboard';
import ApplyEvent            from '../pages/Student/ApplyEvent';
import History               from '../pages/Student/History';
import Leaderboard           from '../pages/Student/Leaderboard';
import StudentSettings       from '../pages/Student/StudentSettings';
import StudentCertificates   from '../pages/Student/StudentCertificates';
import StudentNotifications  from '../pages/Student/Notifications';

// Organizer Layout + Pages
import OrganizerLayout      from '../layouts/OrganizerLayout';
import OrganizerDashboard   from '../pages/Organizer/OrganizerDashboard';
import CreateEvent          from '../pages/Organizer/CreateEvent';
import ManageEvents         from '../pages/Organizer/ManageEvents';
import Applications         from '../pages/Organizer/Applications';
import Attendance           from '../pages/Organizer/Attendance';
import Certificates         from '../pages/Organizer/Certificates';
import Notifications        from '../pages/Organizer/Notifications';
import OrganizerSettings    from '../pages/Organizer/OrganizerSettings';

// Admin Layout + Pages
import AdminLayout           from '../layouts/AdminLayout';
import AdminDashboard        from '../pages/Admin/AdminDashboard';
import ManageUsers           from '../pages/Admin/ManageUsers';
import ApproveEvents         from '../pages/Admin/ApproveEvents';
import ReportsAnalytics      from '../pages/Admin/ReportsAnalytics';
import SystemSettings        from '../pages/Admin/SystemSettings';
import AdminNotifications    from '../pages/Admin/AdminNotifications';
import AdminManageEvents     from '../pages/Admin/ManageEvents';
import AdminOrganizations    from '../pages/Admin/Organizations';
import AdminLogin            from '../pages/Auth/AdminLogin';
import AdminCertificates     from '../pages/Admin/Certificates';

const AppRouter = () => {
  return (
    <Routes>

      {/* Standalone Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Public Site (nested inside MainLayout) ───── */}
      <Route element={<MainLayout />}>
        <Route path="/"             element={<HomePage />} />
        <Route path="/events"       element={<EventsPage />} />
        <Route path="/events/:id"   element={<EventDetailsPage />} />
        <Route path="/about"        element={<AboutPage />} />
        <Route path="/contact"      element={<ContactPage />} />

        <Route path="/get-started"  element={<RoleSelectPage mode="register" />} />
        <Route path="/register"     element={<RoleSelectPage mode="register" />} />
        <Route path="/signin"       element={<StudentLogin />} />
        <Route path="/login"        element={<StudentLogin />} />

        {/* ── Auth ─────────────────────────────────────── */}
        <Route path="/register/student"   element={<StudentRegister />} />
        <Route path="/register/organizer" element={<OrganizerRegister />} />

        <Route path="/login/student"   element={<StudentLogin />} />
        <Route path="/login/organizer" element={<OrganizerLogin />} />

        <Route path="/forgot-password"    element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ── Student Panel (nested layout) ────────────── */}
        <Route path="/student" element={<ProtectedRoute><RoleRoute allowedRoles={['student']}><StudentLayout /></RoleRoute></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="events"       element={<Navigate to="/events" replace />} />
          <Route path="applications" element={<ApplyEvent />} />
          <Route path="history"      element={<History />} />
          <Route path="leaderboard"  element={<Leaderboard />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="settings"     element={<StudentSettings />} />
          <Route path="notifications" element={<StudentNotifications />} />
        </Route>

        {/* ── Organizer Panel (nested layout) ──────────── */}
        <Route path="/organizer" element={<ProtectedRoute><RoleRoute allowedRoles={['organizer']}><OrganizerLayout /></RoleRoute></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<OrganizerDashboard />} />
          <Route path="create-event"  element={<CreateEvent />} />
          <Route path="events"        element={<ManageEvents />} />
          <Route path="applications"  element={<Applications />} />
          <Route path="attendance"    element={<Attendance />} />
          <Route path="certificates"  element={<Certificates />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings"      element={<OrganizerSettings />} />
        </Route>
      </Route>

      {/* ── Admin Panel (nested layout) ───────────────── */}
      <Route path="/admin" element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminLayout /></RoleRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"      element={<AdminDashboard />} />
        <Route path="users"          element={<ManageUsers />} />
        <Route path="event-approval" element={<ApproveEvents />} />
        <Route path="manage-events"  element={<AdminManageEvents />} />
        <Route path="organizations"  element={<AdminOrganizations />} />
        <Route path="certificates"   element={<AdminCertificates />} />
        <Route path="reports"        element={<ReportsAnalytics />} />
        <Route path="settings"       element={<SystemSettings />} />
        <Route path="notifications"  element={<AdminNotifications />} />
      </Route>

    </Routes>
  );
};

export default AppRouter;
