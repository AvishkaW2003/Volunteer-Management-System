import { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  HandHelping, Menu, X, Mail, Phone, MapPin,
  Facebook, Twitter, Linkedin, Bell
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getNotifications, markAsRead, markAllAsRead, getAdminNotifications } from "../services/notificationService";
import "../pages/HomePage.css";

/**
 * MainLayout Component
 * 
 * Provides the shared layout for all public pages (Home, Events, About, Contact).
 * Includes the navigation header (with responsive mobile menu and auth states)
 * and the main footer.
 */
const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for mobile drawer menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for profile dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // State for notifications dropdown
  const [notifications, setNotifications] = useState([]);
  const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchNavbarNotifications = async () => {
        try {
          const data = user.role === 'admin' ? await getAdminNotifications() : await getNotifications();
          const mappedData = (data || []).map(n => ({
            id: n.id,
            title: n.title || 'Notification',
            message: n.message || '',
            time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recent',
            isRead: n.isRead
          }));
          setNotifications(mappedData);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setNotifications([]);
        }
      };

      fetchNavbarNotifications();

      const handleSync = () => {
        fetchNavbarNotifications();
      };
      window.addEventListener('voms_notifications_updated', handleSync);

      const interval = setInterval(fetchNavbarNotifications, 15000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('voms_notifications_updated', handleSync);
      };
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      window.dispatchEvent(new Event('voms_notifications_updated'));
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event('voms_notifications_updated'));
    } catch (e) {
      console.error("Failed to mark all notifications as read", e);
    }
  };

  /**
   * Redirects user to dashboard if logged in, or register page if guest.
   */
  const handleDashboardRedirect = () => {
    if (isAuthenticated) {
      if (user?.role === "student") navigate("/student/dashboard");
      else if (user?.role === "organizer") navigate("/organizer/dashboard");
      else navigate("/admin/dashboard");
    } else {
      navigate("/register");
    }
  };

  /**
   * Helper to check if a navigation link is active
   */
  const isActive = (path) => location.pathname === path;
  const isDashboardRoute = location.pathname.startsWith('/student') || location.pathname.startsWith('/organizer');

  return (
    <div className="vh-wrapper">
      
      {/* ── HEADER & NAVIGATION ─────────────────────────── */}
      <header className="vh-navbar">
        <div className="vh-nav-container">
          
          {/* Main Logo & Branding */}
          <Link to="/" className="vh-logo">
            <div className="vh-logo-icon">
              <HandHelping className="w-5 h-5" />
            </div>
            <span>VolunteerHub</span>
          </Link>

          {/* Center Navigation Links (Visible on Desktop) */}
          <nav className="vh-nav-links">
            <Link to="/" className={`vh-nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
            <Link to="/events" className={`vh-nav-link ${isActive("/events") ? "active" : ""}`}>Events</Link>
            <Link to="/about" className={`vh-nav-link ${isActive("/about") ? "active" : ""}`}>About</Link>
            <Link to="/contact" className={`vh-nav-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>
          </nav>

          {/* Right Action Buttons (Desktop) */}
          <div className="vh-nav-auth">
            {isAuthenticated ? (
              <div className="vh-nav-user-info relative" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="vh-user-greeting">Hi, {user?.role === 'admin' ? 'Admin' : (user?.name?.split(' ')[0] || "Volunteer")}</span>
                
                {/* Notifications Bell Button */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setNotiDropdownOpen(!notiDropdownOpen);
                      setDropdownOpen(false); // Close profile dropdown if open
                    }}
                    className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 focus:outline-none"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notiDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                      style={{ right: '-40px', top: '100%', minWidth: '280px' }}
                      onMouseLeave={() => setNotiDropdownOpen(false)}
                    >
                      {/* Dropdown Header */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">Notifications</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllRead}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold bg-transparent border-none cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Dropdown List */}
                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-400 text-sm flex flex-col items-center justify-center">
                            <Bell className="w-8 h-8 mb-2 text-gray-300" />
                            <span>No notifications yet</span>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => handleMarkAsRead(n.id)}
                              className={`px-4 py-3 text-left transition-colors cursor-pointer hover:bg-gray-50 flex gap-2.5 items-start ${!n.isRead ? 'bg-blue-50/40' : ''}`}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-500'}`}>{n.title}</p>
                                  <span className="text-[9px] text-gray-400 flex-shrink-0">{n.time || 'recent'}</span>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug break-words">{n.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Dropdown Footer */}
                      {user?.role === 'organizer' ? (
                        <Link 
                          to="/organizer/notifications" 
                          onClick={() => setNotiDropdownOpen(false)}
                          className="block text-center py-2 bg-gray-50 border-t border-gray-100 text-xs font-bold text-blue-600 hover:bg-gray-100 transition-colors"
                        >
                          View all notifications
                        </Link>
                      ) : user?.role === 'student' ? (
                        <Link 
                          to="/student/notifications" 
                          onClick={() => setNotiDropdownOpen(false)}
                          className="block text-center py-2 bg-gray-50 border-t border-gray-100 text-xs font-bold text-blue-600 hover:bg-gray-100 transition-colors"
                        >
                          View all notifications
                        </Link>
                      ) : user?.role === 'admin' ? (
                        <Link 
                          to="/admin/notifications" 
                          onClick={() => setNotiDropdownOpen(false)}
                          className="block text-center py-2 bg-gray-50 border-t border-gray-100 text-xs font-bold text-blue-600 hover:bg-gray-100 transition-colors"
                        >
                          View all notifications
                        </Link>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <img
                    src={
                      user?.avatar ||
                      user?.studentProfile?.avatar ||
                      user?.organizerProfile?.logo ||
                      (user?.role === "organizer" 
                        ? `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.name || 'Club')}`
                        : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'User')}`)
                    }
                    alt="profile"
                    className={`w-10 h-10 rounded-full border-2 cursor-pointer object-cover hover:scale-105 transition-transform ${
                      user?.role === 'admin' ? 'border-[#14B8A6]' : 'border-blue-500'
                    }`}
                    onClick={() => { setDropdownOpen(!dropdownOpen); setNotiDropdownOpen(false); }}
                  />

                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                      style={{ right: 0 }}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
                      </div>
                      
                      {user?.role === "student" ? (
                        <div className="py-1">
                          <Link to="/student/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
                          <Link to="/events" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Browse Events</Link>
                          <Link to="/student/applications" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Applications</Link>
                          <Link to="/student/history" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">History</Link>
                          <Link to="/student/leaderboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Leaderboard</Link>
                          <Link to="/student/certificates" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Certificates</Link>
                          <Link to="/student/notifications" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Notifications</Link>
                          <Link to="/student/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Settings</Link>
                        </div>
                      ) : user?.role === "organizer" ? (
                        <div className="py-1">
                          <Link to="/organizer/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
                          <Link to="/organizer/create-event" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Create Event</Link>
                          <Link to="/organizer/events" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Manage Events</Link>
                          <Link to="/organizer/applications" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Applications</Link>
                          <Link to="/organizer/attendance" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Attendance</Link>
                          <Link to="/organizer/certificates" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Certificates</Link>
                          <Link to="/organizer/notifications" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Notifications</Link>
                          <Link to="/organizer/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Settings</Link>
                        </div>
                      ) : user?.role === "admin" ? (
                        <div className="py-1">
                          <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">Dashboard</Link>
                          <Link to="/admin/users" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">User Management</Link>
                          <Link to="/admin/event-approval" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">Event Approvals</Link>
                          <Link to="/admin/manage-events" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">Manage Events</Link>
                          <Link to="/admin/organizations" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">Organizations</Link>
                          <Link to="/admin/certificates" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">Certificate Management</Link>
                          <Link to="/admin/reports" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">Reports & Analytics</Link>
                          <Link to="/admin/notifications" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">Notifications</Link>
                          <Link to="/admin/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#14B8A6] transition-colors font-medium">System Settings</Link>
                        </div>
                      ) : null}
                      
                      <hr className="border-gray-100" />
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/signin" className="vh-btn-signin">
                  Sign In
                </Link>
                <Link to="/register" className="vh-btn-create">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            className="vh-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <nav className={`vh-mobile-nav ${mobileMenuOpen ? "vh-show" : ""}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`vh-nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className={`vh-nav-link ${isActive("/events") ? "active" : ""}`}>Events</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={`vh-nav-link ${isActive("/about") ? "active" : ""}`}>About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={`vh-nav-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>
          
          <div className="vh-mobile-auth-stack" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={
                    user?.avatar ||
                    user?.studentProfile?.avatar ||
                    user?.organizerProfile?.logo ||
                    (user?.role === "organizer" 
                      ? `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.name || 'Club')}`
                      : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'User')}`)
                  }
                  alt="profile"
                  className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                />
                <span className="vh-user-greeting" style={{ textAlign: "center", fontWeight: 'bold' }}>
                  Hi, {user?.role === 'admin' ? 'Admin' : (user?.name?.split(' ')[0] || "Volunteer")}
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDashboardRedirect();
                  }}
                  className="vh-btn-create"
                  style={{ width: "100%", marginTop: '0.25rem' }}
                >
                  Go to Profile
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (user?.role === 'organizer') navigate('/organizer/notifications');
                    else if (user?.role === 'student') navigate('/student/notifications');
                    else navigate('/admin/notifications');
                  }}
                  className="vh-btn-create flex items-center justify-center gap-2"
                  style={{ width: "100%", background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  <Bell className="w-4 h-4" /> Notifications {unreadCount > 0 && `(${unreadCount})`}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="vh-btn-logout"
                  style={{ width: "100%" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="vh-btn-signin" style={{ width: "100%", textAlign: "center" }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="vh-btn-create" style={{ width: "100%", textAlign: "center" }}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ── ACTIVE PAGE CONTENT ────────────────────────── */}
      <main style={isDashboardRoute ? { height: "100vh", overflow: "hidden", paddingTop: "var(--navbar-height)", boxSizing: "border-box" } : { minHeight: "calc(100vh - var(--navbar-height) - 300px)" }}>
        <Outlet />
      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      {!isDashboardRoute && (
        <footer className="vh-footer">
          <div className="vh-footer-container">
            <div className="vh-footer-grid">
              {/* Column 1: Brand Info */}
              <div className="vh-footer-col">
                <Link to="/" className="vh-footer-logo">
                  <div className="vh-footer-logo-icon">
                    <HandHelping className="w-4 h-4" />
                  </div>
                  <span>VolunteerHub</span>
                </Link>
                <p className="vh-footer-tagline">
                  Empowering students through meaningful volunteer opportunities.
                </p>
              </div>
  
              {/* Column 2: Quick Links */}
              <div className="vh-footer-col">
                <h4>Quick Links</h4>
                <ul className="vh-footer-links">
                  <li><Link to="/about" className="vh-footer-link">About Us</Link></li>
                  <li><Link to="/events" className="vh-footer-link">Events</Link></li>
                  <li><Link to="/about" className="vh-footer-link">Partner Clubs</Link></li>
                  <li><Link to="/contact" className="vh-footer-link">Contact</Link></li>
                </ul>
              </div>
  
              {/* Column 3: Contact Details */}
              <div className="vh-footer-col">
                <h4>Contact</h4>
                <ul className="vh-footer-contact">
                  <li>
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>info@volunteerhub.edu</span>
                  </li>
                  <li>
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>(555) 123-4567</span>
                  </li>
                  <li>
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>University Campus</span>
                  </li>
                </ul>
              </div>
  
              {/* Column 4: Socials */}
              <div className="vh-footer-col">
                <h4>Follow Us</h4>
                <div className="vh-social-links">
                  <a href="#" className="vh-social-btn" aria-label="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="vh-social-btn" aria-label="Twitter">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="vh-social-btn" aria-label="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
  
            <div className="vh-footer-bottom">
              &copy; {new Date().getFullYear()} VolunteerHub. All rights reserved.
            </div>
          </div>
        </footer>
      )}

    </div>
  );
};

export default MainLayout;
