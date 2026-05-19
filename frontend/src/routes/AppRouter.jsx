import { Routes, Route } from 'react-router-dom';

// Auth Pages
import RoleSelectPage from '../pages/Auth/RoleSelectPage';
import StudentRegister from '../pages/Auth/StudentRegister';
import OrganizerRegister from '../pages/Auth/OrganizerRegister';
import StudentLogin from '../pages/Auth/StudentLogin';
import OrganizerLogin from '../pages/Auth/OrganizerLogin';
import AdminLogin from '../pages/Auth/AdminLogin';

const AppRouter = () => {
  return (
    <Routes>
      {/* Role Selection — Landing Page */}
      <Route path="/" element={<RoleSelectPage />} />

      {/* Registration Routes */}
      <Route path="/register/student" element={<StudentRegister />} />
      <Route path="/register/organizer" element={<OrganizerRegister />} />

      {/* Login Routes */}
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/organizer" element={<OrganizerLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />
    </Routes>
  );
};

export default AppRouter;
