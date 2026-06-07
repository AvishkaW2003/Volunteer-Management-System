import { Bell, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { myNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';

const timeAgo = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await myNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Could not load notifications from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const unread = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError('Failed to mark all as read.');
    }
  };

  const handleMarkRead = async (n) => {
    if (n.isRead) return;
    try {
      await markNotificationRead(n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
    } catch (err) {
      setError('Failed to mark notification as read.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 text-base mt-0.5">
            {unread > 0 ? `${unread} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              text-purple-600 border border-cyan-200 hover:bg-purple-50 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell className="w-10 h-10 mb-3 text-gray-200" />
          <p className="font-medium text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n)}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-4 cursor-pointer
                transition-all hover:shadow-md ${n.isRead ? 'border-gray-100' : 'border-cyan-200'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? 'bg-gray-100 text-gray-500' : 'bg-cyan-100 text-cyan-600'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-base font-semibold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                    {n.title}
                  </p>
                  <span className="text-sm text-gray-400 flex-shrink-0">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="text-base text-gray-500 mt-0.5">{n.message}</p>
              </div>
              {!n.isRead && (
                <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
