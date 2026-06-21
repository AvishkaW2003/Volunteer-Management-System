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
        <div className="p-6 space-y-6">
          {/* Event info row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl">
              <Building2 className="flex-shrink-0 w-4 h-4 text-blue-500" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">Club / Organizer</p>
                <p className="text-sm font-semibold text-blue-700">{app.club}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-xl">
              <Calendar className="flex-shrink-0 w-4 h-4 text-purple-500" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">Event Date</p>
                <p className="text-sm font-semibold text-purple-700">{formatDateString(app.eventDate)}</p>
              </div>
            </div>
          </div>
          {/* Divider + section label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Your Application</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Application form fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField icon={User} label="Full Name" value={app.form?.name} />
              <DetailField icon={Mail} label="Email" value={app.form?.email} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField icon={Phone} label="Phone Number" value={app.form?.phone} />
              <DetailField icon={Tag} label="Relevant Skills" value={app.form?.skills} />
            </div>
            <DetailField icon={MessageSquare} label="Why I Want to Join" value={app.form?.motivation} />
            <DetailField icon={BookOpen} label="Previous Volunteer Experience" value={app.form?.experience} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};