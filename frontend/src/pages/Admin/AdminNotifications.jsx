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
      <button className="flex items-center gap-2 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
        <CheckCheck className="w-4 h-4" /> Mark all as read
      </button>
    </div>

    <div className="space-y-3">
      {NOTIFICATIONS.map(n => (
        <div
          key={n.id}
          className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer ${n.read ? 'border-gray-100' : 'border-indigo-200'}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.read ? 'bg-gray-100' : 'bg-indigo-100'}`}>
            <Bell className={`w-5 h-5 ${n.read ? 'text-gray-400' : 'text-indigo-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className={`text-sm font-semibold ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</p>
              <span className="text-xs text-gray-400 flex-shrink-0">{n.time}</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
          </div>
          {!n.read && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />}
        </div>
      ))}
    </div>
  </div>
);

export default AdminNotifications;
