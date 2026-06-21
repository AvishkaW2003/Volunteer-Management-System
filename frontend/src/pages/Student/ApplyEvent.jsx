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
const ViewDetailsModal = ({ app, onClose }) => {
  const s = STATUS[app.status?.toLowerCase()] || STATUS.pending;
  const Icon = s.icon;

  const formatDateString = iso => {
    if (!iso) return '';
    const parts = iso.split('T')[0].split('-');
    if (parts.length < 3) return iso;
    const [y, m, d] = parts;
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 overflow-y-auto bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-2xl">
        {/* Modal header */}
        <div className="h-1.5 bg-gradient-to-r from-blue-400 to-purple-500" />
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 truncate">{app.event}</h2>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${s.badge}`}>
                <Icon className="w-3.5 h-3.5" /> {s.label}
              </span>
              <span className="text-xs text-gray-400">Applied on {app.appliedOn}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>