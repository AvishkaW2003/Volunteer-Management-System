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