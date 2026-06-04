import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PlusCircle, Calendar, Users,
  ClipboardCheck, Award, Bell, Settings, LogOut, Menu, ClipboardList,
} from 'lucide-react';

const navItems = [
  { to: '/organizer/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/organizer/create-event', icon: PlusCircle,      label: 'Create Event' },
  { to: '/organizer/events',       icon: Calendar,        label: 'Manage Events' },
  { to: '/organizer/applications', icon: Users,           label: 'Applications' },
  { to: '/organizer/attendance',   icon: ClipboardCheck,  label: 'Attendance' },
  { to: '/organizer/certificates', icon: Award,           label: 'Certificates' },
  { to: '/organizer/notifications',icon: Bell,            label: 'Notifications' },
  { to: '/organizer/settings',     icon: Settings,        label: 'Settings' },
];

const OrganizerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-56 bg-white
          border-r border-gray-200 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">VH</span>
          </div>
          <span className="font-bold text-gray-800 text-base">VolunteerHub</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium
                transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl
              text-base font-medium text-gray-500 hover:bg-red-50 hover:text-red-500
              transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar — visible on all screen sizes */}
        <header className="flex items-center justify-between gap-3 px-4 lg:px-7 py-3
          bg-white border-b border-gray-200 flex-shrink-0">

          {/* Left: hamburger + logo (mobile) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 text-gray-600 hover:text-cyan-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">VH</span>
              </div>
              <span className="font-bold text-gray-800 text-sm">VolunteerHub</span>
            </div>
          </div>

          {/* Spacer for desktop (sidebar already shows logo) */}
          <div className="hidden lg:block" />

          {/* Right: Role badge */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-50 to-blue-50
            border border-cyan-200 rounded-2xl px-3 py-1.5">
            <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-500
              rounded-lg flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm text-cyan-500 font-medium">Logged in as</span>
              <span className="text-base font-bold text-blue-700">{user?.name || 'Organizer'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7 relative">
          {/* Decorative background blobs */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
              bg-gradient-to-br from-cyan-200/40 to-blue-200/30 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full
              bg-gradient-to-tr from-blue-200/35 to-cyan-200/25 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[350px] h-[350px] rounded-full
              bg-gradient-to-br from-sky-100/30 to-teal-100/20 blur-3xl" />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
