import { useState } from 'react';
import { CheckCircle, Clock, XCircle, ClipboardList, X, User, Mail, Phone, Tag, MessageSquare, BookOpen, Calendar, Building2 } from 'lucide-react';

const MOCK_APPLICATIONS = [
  {
    id: 1,
    event: 'University cleaning project',
    club: 'IEEE',
    eventDate: 'May 15, 2026',
    appliedOn: 'May 1, 2026',
    status: 'approved',
    form: {
      name: 'Alex Johnson',
      email: 'alex.j@university.edu',
      phone: '+1 (555) 123-4567',
      skills: 'Teamwork, Physical Fitness, Environmental Awareness',
      motivation: 'I am passionate about protecting our coastlines and marine ecosystems. This event aligns perfectly with my values and I want to contribute meaningfully to the community.',
      experience: 'Participated in two previous city cleanup drives in 2025. Also volunteered at a local river restoration project for 3 months.',
    },
  },
  {
    id: 2,
    event: 'Food Distribution Program',
    club: 'Rotaract',
    eventDate: 'May 20, 2026',
    appliedOn: 'May 3, 2026',
    status: 'pending',
    form: {
      name: 'Alex Johnson',
      email: 'alex.j@university.edu',
      phone: '+1 (555) 123-4567',
      skills: 'Organisation, Communication, Driving License',
      motivation: 'Food insecurity is a serious issue in our community and I want to be part of the solution. I have strong organisational skills and can help coordinate distribution efficiently.',
      experience: '',
    },
  },
  {
    id: 3,
    event: 'Tree Planting Campaign',
    club: 'Leo Club',
    eventDate: 'May 25, 2026',
    appliedOn: 'May 5, 2026',
    status: 'approved',
    form: {
      name: 'Alex Johnson',
      email: 'alex.j@university.edu',
      phone: '+1 (555) 123-4567',
      skills: 'Gardening, Physical Fitness, Teamwork',
      motivation: 'I strongly believe in combating climate change at a grassroots level. Planting trees is one of the most direct ways to make an environmental impact.',
      experience: 'Volunteered at the Central Park greening initiative last year where we planted over 200 saplings.',
    },
  },
  {
    id: 4,
    event: 'Tech Workshop for Kids',
    club: 'Sipmansala',
    eventDate: 'May 28, 2026',
    appliedOn: 'May 6, 2026',
    status: 'pending',
    form: {
      name: 'Alex Johnson',
      email: 'alex.j@university.edu',
      phone: '+1 (555) 123-4567',
      skills: 'Teaching, Communication, Patience',
      motivation: 'I am a Computer Science student and I want to inspire younger kids to explore technology. Teaching is something I genuinely enjoy.',
      experience: '',
    },
  },
  {
    id: 5,
    event: 'Blood Donation Camp',
    club: 'Abises',
    eventDate: 'Jun 2, 2026',
    appliedOn: 'May 10, 2026',
    status: 'approved',
    form: {
      name: 'Alex Johnson',
      email: 'alex.j@university.edu',
      phone: '+1 (555) 123-4567',
      skills: 'First Aid, Empathy, Communication',
      motivation: 'Donating blood is a simple act that saves lives. I want to assist the medical team and also encourage more students to donate.',
      experience: 'First Aid certified (2024). Helped organise a health awareness booth at the campus fair.',
    },
  },
  {
    id: 6,
    event: 'Community Garden Project',
    club: 'IEEE',
    eventDate: 'Apr 20, 2026',
    appliedOn: 'Apr 5, 2026',
    status: 'rejected',
    form: {
      name: 'Alex Johnson',
      email: 'alex.j@university.edu',
      phone: '+1 (555) 123-4567',
      skills: 'Gardening, Teamwork',
      motivation: 'I enjoy working with plants and want to help build a sustainable community garden that everyone can benefit from.',
      experience: '',
    },
  },
];

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
  const s = STATUS[app.status];
  const Icon = s.icon;

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
                <p className="text-sm font-semibold text-purple-700">{app.eventDate}</p>
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
              <DetailField icon={User} label="Full Name" value={app.form.name} />
              <DetailField icon={Mail} label="Email" value={app.form.email} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField icon={Phone} label="Phone Number" value={app.form.phone} />
              <DetailField icon={Tag} label="Relevant Skills" value={app.form.skills} />
            </div>
            <DetailField icon={MessageSquare} label="Why I Want to Join" value={app.form.motivation} />
            <DetailField icon={BookOpen} label="Previous Volunteer Experience" value={app.form.experience} />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500
              hover:from-blue-500 hover:to-purple-600 text-white text-sm font-semibold
              transition-all shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────────── */
const ApplyEvent = () => {
  const [viewingApp, setViewingApp] = useState(null);

  const counts = {
    approved: MOCK_APPLICATIONS.filter(a => a.status === 'approved').length,
    pending: MOCK_APPLICATIONS.filter(a => a.status === 'pending').length,
    rejected: MOCK_APPLICATIONS.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
          My Applications
        </h1>
        <p className="mt-1 text-gray-500">Track the status of your event applications</p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ key, label }) => {
          const s = STATUS[key];
          const Icon = s.icon;
          return (
            <div key={key} className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <div className={`w-12 h-12 rounded-2xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${s.iconCls}`} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-800">{counts[key]}</p>
                <p className="text-sm font-medium text-gray-500">{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applications table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Event Name', 'Club', 'Event Date', 'Applied On', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_APPLICATIONS.map(app => {
              const s = STATUS[app.status];
              const Icon = s.icon;
              return (
                <tr key={app.id} className="transition-colors hover:bg-purple-50/30">
                  <td className="px-5 py-4 font-semibold text-gray-800">{app.event}</td>
                  <td className="px-5 py-4 text-gray-500">{app.club}</td>
                  <td className="px-5 py-4 text-gray-500">{app.eventDate}</td>
                  <td className="px-5 py-4 text-gray-500">{app.appliedOn}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
                      <Icon className="w-3.5 h-3.5" /> {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {app.status === 'approved' && (
                      <button
                        onClick={() => setViewingApp(app)}
                        className="text-sm font-semibold text-purple-600 transition-colors hover:text-purple-800"
                      >
                        View Details
                      </button>
                    )}
                    {app.status === 'pending' && (
                      <button className="text-sm font-semibold text-red-500 transition-colors hover:text-red-700">
                        Withdraw
                      </button>
                    )}
                    {app.status === 'rejected' && (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {viewingApp && (
        <ViewDetailsModal app={viewingApp} onClose={() => setViewingApp(null)} />
      )}
    </div>
  );
};

export default ApplyEvent;
