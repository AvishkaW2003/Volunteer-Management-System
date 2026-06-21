import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, XCircle, ClipboardList, X, User, Mail, Phone, Tag, MessageSquare, BookOpen, Calendar, Building2 } from 'lucide-react';
import { getMyApplications } from '../../services/applicationService';
const STATUS = {
  approved: { badge: 'bg-green-100 text-green-700', icon: CheckCircle, iconCls: 'text-green-500', iconBg: 'bg-green-100', label: 'Approved' },
  pending: { badge: 'bg-amber-100 text-amber-700', icon: Clock, iconCls: 'text-amber-500', iconBg: 'bg-amber-100', label: 'Pending' },
  rejected: { badge: 'bg-red-100   text-red-500', icon: XCircle, iconCls: 'text-red-500', iconBg: 'bg-red-100', label: 'Rejected' },
};
const STATS = [
  { key: 'approved', label: 'Approved' },
  { key: 'pending', label: 'Pending' },
  { key: 'rejected', label: 'Rejected' },
];