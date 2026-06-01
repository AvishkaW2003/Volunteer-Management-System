import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import RoleSelectPage    from '../pages/Auth/RoleSelectPage';
import StudentRegister   from '../pages/Auth/StudentRegister';
import OrganizerRegister from '../pages/Auth/OrganizerRegister';
import StudentLogin      from '../pages/Auth/StudentLogin';
import OrganizerLogin    from '../pages/Auth/OrganizerLogin';
import AdminLogin        from '../pages/Auth/AdminLogin';

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

    </Routes>
  );
};

export default AppRouter;
