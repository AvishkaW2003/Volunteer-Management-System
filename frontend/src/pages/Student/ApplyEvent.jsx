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
/* ── View Details Modal ─────────────────────────────────── */
const DetailField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-purple-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-700 break-words whitespace-pre-wrap">
        {value || <span className="italic text-gray-300">Not provided</span>}
      </p>
    </div>
  </div>
);