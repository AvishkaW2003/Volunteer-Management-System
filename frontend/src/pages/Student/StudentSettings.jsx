import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Star, Award, UserCheck, Clock, CheckCircle2, XCircle, ClipboardList } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
const getIconAndStyle = (type) => {
  switch (type) {
    case 'Points':
      return { Icon: Star, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' };
    case 'Certificate':
      return { Icon: Award, color: 'bg-purple-100 text-purple-600 border-purple-200' };
    case 'Attendance':
      return { Icon: UserCheck, color: 'bg-teal-100 text-teal-600 border-teal-200' };
      case 'Reminder':
      return { Icon: Clock, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' };
    case 'Approved':
      return { Icon: CheckCircle2, color: 'bg-green-100 text-green-600 border-green-200' };
    case 'Rejected':
      return { Icon: XCircle, color: 'bg-red-100 text-red-600 border-red-200' };
    case 'Submitted':
      return { Icon: ClipboardList, color: 'bg-blue-100 text-blue-600 border-blue-200' };
    default:
      return { Icon: Bell, color: 'bg-blue-100 text-blue-600 border-blue-200' };
  }
};
const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} ${diffHrs === 1 ? 'hr' : 'hrs'} ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString();
};
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      const normalized = data.map((n) => {
        let type = 'Reminder';
        if (n.title.toLowerCase().includes('points')) type = 'Points';
        else if (n.title.toLowerCase().includes('certificate')) type = 'Certificate';
        else if (n.title.toLowerCase().includes('attendance')) type = 'Attendance';
        else if (n.title.toLowerCase().includes('approved') || n.message.toLowerCase().includes('approved')) type = 'Approved';
        else if (n.title.toLowerCase().includes('rejected') || n.message.toLowerCase().includes('rejected')) type = 'Rejected';
        else if (n.title.toLowerCase().includes('submitted') || n.message.toLowerCase().includes('submitted')) type = 'Submitted';

        return {
          id: n.id,
          title: n.title,
          message: n.message,
          read: n.isRead,
          time: formatTime(n.createdAt),
          type
        };
      });
      setNotifications(normalized);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNotifications();
  }, []);

  const unread = notifications.filter((n) => !n.read).length;
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      window.dispatchEvent(new Event('voms_notifications_updated'));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };
  const handleMarkRead = async (id) => {
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      try {
        await markAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        window.dispatchEvent(new Event('voms_notifications_updated'));
      } catch (err) {
        console.error("Failed to mark read:", err);
      }
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-purple-600 border border-cyan-200 hover:bg-purple-50 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>