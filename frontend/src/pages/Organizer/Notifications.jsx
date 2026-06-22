import { useState, useEffect } from 'react';
import { 
  Bell, CheckCheck, UserPlus, CheckCircle2, XCircle, ClipboardCheck, Award, Clock 
} from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';

const getIconAndStyle = (type) => {
  switch (type) {
    case 'Application':
      return { Icon: UserPlus, color: 'bg-blue-100 text-blue-600 border-blue-200' };
    case 'Attendance':
      return { Icon: ClipboardCheck, color: 'bg-cyan-100 text-cyan-600 border-cyan-200' };
    case 'Approved':
      return { Icon: CheckCircle2, color: 'bg-green-100 text-green-600 border-green-200' };
    case 'Rejected':
      return { Icon: XCircle, color: 'bg-red-100 text-red-600 border-red-200' };
    case 'Pending':
      return { Icon: Award, color: 'bg-amber-100 text-amber-600 border-amber-200' };
    case 'Reminder':
      return { Icon: Clock, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' };
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
