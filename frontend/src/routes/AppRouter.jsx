import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import RoleSelectPage    from '../pages/Auth/RoleSelectPage';
import StudentRegister   from '../pages/Auth/StudentRegister';
import OrganizerRegister from '../pages/Auth/OrganizerRegister';
import StudentLogin      from '../pages/Auth/StudentLogin';
import OrganizerLogin    from '../pages/Auth/OrganizerLogin';
import AdminLogin        from '../pages/Auth/AdminLogin';

// Student Layout + Pages
import StudentLayout  from '../layouts/StudentLayout';
import Dashboard      from '../pages/Student/Dashboard';
import Events         from '../pages/Student/Events';
import ApplyEvent     from '../pages/Student/ApplyEvent';
import History        from '../pages/Student/History';
import Leaderboard    from '../pages/Student/Leaderboard';
import StudentSettings      from '../pages/Student/StudentSettings';
import StudentCertificates  from '../pages/Student/StudentCertificates';

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

const AppRouter = () => {
  return (
    <Routes>

      {/* ── Auth ─────────────────────────────────────── */}
      <Route path="/" element={<RoleSelectPage />} />

      <Route path="/register/student"   element={<StudentRegister />} />
      <Route path="/register/organizer" element={<OrganizerRegister />} />

      <Route path="/login/student"   element={<StudentLogin />} />
      <Route path="/login/organizer" element={<OrganizerLogin />} />
      <Route path="/login/admin"     element={<AdminLogin />} />

      {/* ── Student Panel (nested layout) ────────────── */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="events"       element={<Events />} />
        <Route path="applications" element={<ApplyEvent />} />
        <Route path="history"      element={<History />} />
        <Route path="leaderboard"  element={<Leaderboard />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="settings"     element={<StudentSettings />} />
      </Route>

      {/* ── Organizer Panel (nested layout) ──────────── */}
      <Route path="/organizer" element={<OrganizerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<OrganizerDashboard />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="events"       element={<ManageEvents />} />
        <Route path="applications" element={<Applications />} />
        <Route path="attendance"   element={<Attendance />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="notifications"element={<Notifications />} />
        <Route path="settings"     element={<OrganizerSettings />} />
      </Route>

      {/* ── Admin Panel (nested layout) ──────────── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"      element={<AdminDashboard />} />
        <Route path="users"          element={<ManageUsers />} />
        <Route path="event-approval" element={<ApproveEvents />} />
        <Route path="reports"        element={<ReportsAnalytics />} />
        <Route path="settings"       element={<SystemSettings />} />
        <Route path="notifications"  element={<AdminNotifications />} />
      </Route>

    </Routes>
  );
};

export default AppRouter;
