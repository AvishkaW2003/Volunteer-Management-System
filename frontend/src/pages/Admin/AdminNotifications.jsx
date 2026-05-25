import { useState, useEffect } from 'react';
import { 
  Bell, CheckCheck, Trash2, RefreshCw, AlertTriangle, 
  Info, Calendar, UserPlus, CheckCircle, Star, FolderOpen, 
  X, Check
} from 'lucide-react';
import { 
  getNotifications, 
  markNotificationRead, 
  deleteNotification 
} from '../../services/notificationService';

// Helper to determine icon and color based on notification title/message
const getNotificationMetadata = (title = '', message = '') => {
  const t = title.toLowerCase();
  const m = message.toLowerCase();

  if (t.includes('event') || m.includes('event') || t.includes('approval') || m.includes('approval')) {
    return {
      icon: Calendar,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 border-cyan-100',
      category: 'Events'
    };
  }
  if (t.includes('student') || t.includes('user') || m.includes('student') || m.includes('signup') || t.includes('register')) {
    return {
      icon: UserPlus,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      category: 'Users'
    };
  }
  if (t.includes('alert') || t.includes('warn') || m.includes('error') || m.includes('fail') || t.includes('security')) {
    return {
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-100',
      category: 'Security Alerts'
    };
  }
  
  // Default system notification
  return {
    icon: Info,
    color: 'text-teal-600',
    bg: 'bg-teal-50 border-teal-100',
    category: 'System'
  };
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read

  const fetchNotifications = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      alert('Failed to mark notification as read.');
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map(n => markNotificationRead(n.id)));
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      showToast('All notifications marked as read.');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      alert('Failed to mark all as read.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      showToast('Notification deleted.');
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert('Failed to delete notification.');
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm('Are you sure you want to delete ALL notifications? This action cannot be undone.')) {
      return;
    }
    try {
      await Promise.all(notifications.map(n => deleteNotification(n.id)));
      setNotifications([]);
      showToast('All notifications cleared.');
    } catch (err) {
      console.error('Error clearing notifications:', err);
      alert('Failed to clear notifications.');
    }
  };

  // Filter logic
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true; // all
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
import { Bell, CheckCheck } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, title: 'New event submitted', message: 'Beach Cleanup Drive is awaiting approval.', time: '2 min ago', read: false },
  { id: 2, title: 'User registered', message: 'A new organizer has joined the platform.', time: '1 hr ago', read: false },
  { id: 3, title: 'Event approved', message: 'Tree Planting Marathon has been approved.', time: '3 hrs ago', read: true },
  { id: 4, title: 'Report generated', message: 'Monthly analytics report is ready.', time: 'Yesterday', read: true },
];

const AdminNotifications = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          Notifications
        </h1>
        <p className="text-gray-500 mt-1">Admin alerts and platform updates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-8 h-8 text-teal-600" /> Notifications Center
          </h1>
          <p className="text-slate-500 mt-1">Review system alerts, event submissions, and user activity.</p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchNotifications(true)}
            className="flex items-center gap-1.5 bg-white border border-teal-100 text-teal-600 hover:bg-teal-50 px-3.5 py-2 rounded-2xl text-xs font-semibold shadow-sm transition-all"
            title="Force Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 bg-white border border-teal-100 text-teal-600 hover:bg-teal-50 px-3.5 py-2 rounded-2xl text-xs font-semibold shadow-sm transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100/70 px-3.5 py-2 rounded-2xl text-xs font-semibold shadow-sm transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 self-stretch sm:self-auto">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'read', label: 'Read History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-white text-teal-600 shadow-sm border border-teal-50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Summary text */}
        <span className="text-xs font-bold text-slate-500 bg-teal-50/50 px-3 py-1.5 border border-teal-100/50 rounded-xl">
          Total Notifications: <span className="text-teal-600">{notifications.length}</span>
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {filteredNotifications.map(notification => {
          const meta = getNotificationMetadata(notification.title, notification.message);
          const MetaIcon = meta.icon;
          const isUnread = !notification.isRead;

          return (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl border p-4.5 flex gap-4 transition-all duration-200 hover:shadow-sm ${
                isUnread 
                  ? 'border-teal-300 shadow-sm bg-teal-50/5' 
                  : 'border-slate-100 opacity-80'
              }`}
            >
              {/* Category Icon */}
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-inner ${meta.bg}`}>
                <MetaIcon className={`w-5.5 h-5.5 ${meta.color}`} />
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {meta.category}
                    </span>
                    <h3 className={`text-sm font-bold mt-0.5 ${isUnread ? 'text-slate-800' : 'text-slate-600'}`}>
                      {notification.title}
                    </h3>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(notification.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed mt-2 pr-4 font-medium">
                  {notification.message}
                </p>

                {/* Inline Actions */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50 text-[11px] font-bold">
                  {isUnread && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="text-teal-600 hover:text-teal-800 flex items-center gap-1 bg-teal-50/50 hover:bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors ml-auto sm:ml-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Alert</span>
                  </button>
                </div>
              </div>

              {/* Unread dot indicator */}
              {isUnread && (
                <span className="w-2.5 h-2.5 bg-teal-600 rounded-full flex-shrink-0 mt-2 self-start animate-ping" />
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-2xl border border-teal-100 p-20 text-center">
            <FolderOpen className="w-14 h-14 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">No notifications found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are currently no alerts inside the "{filter === 'all' ? 'Inbox' : filter}" view.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
