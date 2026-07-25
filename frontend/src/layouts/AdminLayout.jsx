import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CheckSquare, Calendar, Users, Building2, 
  Award, BarChart3, Bell, Settings, LogOut, ChevronLeft, 
  ChevronRight, Menu, X, Search, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboard } from '../services/adminService';

/**
 * Enterprise Standalone AdminLayout Component
 * 
 * Provides an isolated, professional workspace for Administrators
 * completely separate from the public student/organizer website layout.
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  // Fetch live pending event approvals count for sidebar badge
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboard();
        if (res && res.pendingEvents !== undefined) {
          setPendingApprovalsCount(res.pendingEvents);
        }
      } catch (err) {
        console.error("Failed to load admin counts:", err);
      }
    };
    fetchStats();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Event Approvals',
      path: '/admin/event-approval',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-extrabold',
    },
    {
      label: 'Manage Events',
      path: '/admin/manage-events',
      icon: Calendar,
    },
    {
      label: 'Manage Users',
      path: '/admin/users',
      icon: Users,
    },
    {
      label: 'Organizations',
      path: '/admin/organizations',
      icon: Building2,
    },
    {
      label: 'Certificates',
      path: '/admin/certificates',
      icon: Award,
    },
    {
      label: 'Reports & Analytics',
      path: '/admin/reports',
      icon: BarChart3,
    },
    {
      label: 'Notifications',
      path: '/admin/notifications',
      icon: Bell,
    },
    {
      label: 'System Settings',
      path: '/admin/settings',
      icon: Settings,
    },
  ];

  // Determine current page section title for breadcrumbs
  const currentNavItem = navItems.find(item => location.pathname.startsWith(item.path)) || { label: 'Admin Portal' };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-900 font-sans text-slate-100 antialiased">
      
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR NAVIGATION (FIXED 100% HEIGHT) ─────────── */}
      <aside 
        className={`h-full flex-shrink-0 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-50 fixed lg:static top-0 bottom-0 left-0 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Sidebar Header / Logo */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 flex-shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-tight text-white leading-tight">VolunteerHub</span>
                  <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">Admin Portal</span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Internal Scroll if needed) */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? '•••' : 'Management Menu'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all relative group
                    ${isActive 
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm font-semibold' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }
                    ${collapsed ? 'justify-center px-0' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}

                      {/* Badge */}
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-teal-500 text-slate-950'} ${collapsed ? 'absolute top-1 right-1 px-1.5 py-0 text-[9px]' : ''}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Fixed at bottom of sidebar) */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex-shrink-0">
          {/* Quick View Public Website */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-2 mb-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-teal-300 hover:bg-slate-900 transition-colors ${collapsed ? 'justify-center px-0' : ''}`}
            title="Open Public Website"
          >
            <ExternalLink className="w-4 h-4 text-teal-400 flex-shrink-0" />
            {!collapsed && <span>View Public Site</span>}
          </a>

          {/* Admin Profile & Logout Card */}
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800/60 ${collapsed ? 'justify-center p-1.5' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-teal-500/30">
              AD
            </div>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Super Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@volunteerhub.com'}</p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Logout from Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>


      {/* ── MAIN WORKSPACE CONTENT CONTAINER (INDEPENDENT SCROLL) ───── */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-slate-900">
        
        {/* Top Admin Header Bar (Fixed Top) */}
        <header className="h-16 flex-shrink-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between z-30">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <span className="text-slate-400">Admin Portal</span>
              <span className="text-slate-600">/</span>
              <span className="text-teal-400 font-bold">{currentNavItem.label}</span>
            </div>
          </div>

          {/* Right: Search, Notifications & User Badge */}
          <div className="flex items-center gap-3">
            {/* Quick Admin Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus-within:border-teal-500/50 transition-colors w-64">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Quick admin search..." 
                className="bg-transparent outline-none w-full placeholder-slate-500 text-xs text-slate-200"
              />
            </div>

            {/* Notification Shortcut */}
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
              title="Admin Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              )}
            </button>

            {/* Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              System Active
            </div>
          </div>
        </header>

        {/* Dynamic Page Content View (Only This View Scrolls) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900 text-slate-100">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
