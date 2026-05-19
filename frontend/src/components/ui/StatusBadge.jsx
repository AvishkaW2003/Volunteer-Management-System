import { CheckCircle, XCircle, Clock, Play, Calendar, CheckSquare } from 'lucide-react';

const STATUS_MAP = {
  Active:    { bg: 'bg-green-100',  text: 'text-green-700',  icon: Play },
  Upcoming:  { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: Calendar },
  Completed: { bg: 'bg-gray-100',   text: 'text-gray-600',   icon: CheckSquare },
  Pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  Approved:  { bg: 'bg-green-100',  text: 'text-green-700',  icon: CheckCircle },
  Rejected:  { bg: 'bg-red-100',    text: 'text-red-600',    icon: XCircle },
  Present:   { bg: 'bg-green-100',  text: 'text-green-700',  icon: CheckCircle },
  Absent:    { bg: 'bg-gray-100',   text: 'text-gray-500',   icon: XCircle },
};

/**
 * StatusBadge — colored pill for any status value.
 * Props: status (string), showIcon (bool)
 */
const StatusBadge = ({ status, showIcon = false }) => {
  const config = STATUS_MAP[status] ?? { bg: 'bg-gray-100', text: 'text-gray-500', icon: Clock };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold
      px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {status}
    </span>
  );
};

export default StatusBadge;
