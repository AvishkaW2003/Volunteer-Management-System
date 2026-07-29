import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, FileText, History as HistoryIcon,
  Trophy, Award, Bell, Settings,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const navItems = [
  { to: '/student/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/events',        icon: CalendarDays,    label: 'Browse Events' },
  { to: '/student/applications',  icon: FileText,        label: 'Applications' },
  { to: '/student/history',       icon: HistoryIcon,     label: 'History' },
  { to: '/student/leaderboard',   icon: Trophy,           label: 'Leaderboard' },
  { to: '/student/certificates',  icon: Award,            label: 'Certificates' },
  { to: '/student/notifications', icon: Bell,             label: 'Notifications' },
  { to: '/student/settings',      icon: Settings,         label: 'Settings' },
];

/**
 * StudentLayout Component
 *
 * Renders a persistent sidebar alongside the student dashboard pages,
 * so navigation stays visible at all times instead of only appearing
 * inside the avatar dropdown menu.
 */
const StudentLayout = () => {
  return (
    <div className="h-full flex overflow-hidden">

      {/* Persistent Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 h-full bg-white border-r border-gray-100">
        <Sidebar showBrand={false} navItems={navItems} />
      </aside>

      {/* Page Content */}
      <div className="flex-1 h-full overflow-y-auto p-5 lg:p-7 relative bg-gradient-to-br from-blue-50 via-white to-purple-50">

        {/* Decorative background blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
            bg-gradient-to-br from-purple-200/40 to-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full
            bg-gradient-to-tr from-blue-200/35 to-purple-200/25 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[350px] h-[350px] rounded-full
            bg-gradient-to-br from-indigo-100/30 to-pink-100/20 blur-3xl" />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
