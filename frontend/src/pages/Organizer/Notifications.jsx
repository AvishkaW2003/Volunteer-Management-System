import { Bell, CheckCheck } from 'lucide-react';
import { useState } from 'react';

const MOCK = [
  { id: 1, title: 'New Application',        message: 'Kasun Mendis applied for Art for Kids Workshop.',   time: '5 min ago',  read: false, color: 'bg-blue-100 text-blue-600' },
  { id: 2, title: 'Event Approved',         message: 'First Aid Training has been approved by admin.',     time: '1 hr ago',   read: false, color: 'bg-green-100 text-green-600' },
  { id: 3, title: 'Volunteer Withdrew',     message: 'Lahiru Fernando withdrew from First Aid Training.',  time: '3 hrs ago',  read: true,  color: 'bg-yellow-100 text-yellow-600' },
  { id: 4, title: 'Attendance Reminder',    message: 'Mark attendance for Beach Cleanup Drive.',           time: '1 day ago',  read: true,  color: 'bg-cyan-100 text-cyan-600' },
  { id: 5, title: 'New Application',        message: 'Tharushi Jayawardena applied for Food Distribution.','time': '2 days ago', read: true, color: 'bg-blue-100 text-blue-600' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK);
  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

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
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              text-purple-600 border border-cyan-200 hover:bg-purple-50 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-4 cursor-pointer
              transition-all hover:shadow-md ${n.read ? 'border-gray-100' : 'border-cyan-200'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-base font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>
                  {n.title}
                </p>
                <span className="text-sm text-gray-400 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-base text-gray-500 mt-0.5">{n.message}</p>
            </div>
            {!n.read && (
              <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
