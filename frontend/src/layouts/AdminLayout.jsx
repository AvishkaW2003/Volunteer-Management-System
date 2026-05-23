import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck, BarChart2,
  Settings, Bell, LogOut, Menu, ShieldCheck,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',          icon: Users,           label: 'User Management' },
  { to: '/admin/event-approval', icon: CalendarCheck,   label: 'Event Approval' },
  { to: '/admin/reports',        icon: BarChart2,       label: 'Reports & Analytics' },
  { to: '/admin/settings',       icon: Settings,        label: 'System Settings' },
  { to: '/admin/notifications',  icon: Bell,            label: 'Notifications' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

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
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
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
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
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
            onClick={() => navigate('/')}
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

        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 px-4 lg:px-7 py-3
          bg-white border-b border-gray-200 flex-shrink-0">

          {/* Left: hamburger + logo (mobile) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 text-gray-600 hover:text-indigo-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">VH</span>
              </div>
              <span className="font-bold text-gray-800 text-sm">VolunteerHub</span>
            </div>
          </div>

          <div className="hidden lg:block" />

          {/* Right: Role badge */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-blue-50 to-indigo-50
            border border-indigo-200 rounded-2xl px-3 py-1.5">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600
              rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm text-indigo-500 font-medium">Logged in as</span>
              <span className="text-base font-bold text-indigo-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
