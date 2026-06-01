import { Bell } from 'lucide-react';

/**
 * Notification — single notification item card.
 * Props: title, message, time, read, iconBg (Tailwind bg+text class), onClick
 */
const Notification = ({
  title,
  message,
  time,
  read     = false,
  iconBg   = 'bg-cyan-100 text-cyan-600',
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-4
      cursor-pointer transition-all hover:shadow-md
      ${read ? 'border-gray-100' : 'border-cyan-200'}`}
  >
    {/* Icon */}
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Bell className="w-5 h-5" />
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm font-semibold ${read ? 'text-gray-700' : 'text-gray-900'}`}>
          {title}
        </p>
        <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
      </div>
      <p className="text-sm text-gray-500 mt-0.5">{message}</p>
    </div>

    {/* Unread dot */}
    {!read && (
      <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full flex-shrink-0 mt-1" />
    )}
  </div>
);

export default Notification;
