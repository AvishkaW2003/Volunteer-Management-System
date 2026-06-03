import { useState } from 'react';
import { Settings, User, Mail, Phone, GraduationCap, Tag, Bell, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 ' +
  'focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 ' +
  'placeholder-gray-400 transition';

const StudentSettings = () => {
  const { user } = useAuth();

  const [account, setAccount] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [academic, setAcademic] = useState({
    faculty: user?.studentProfile?.faculty || '',
    studentId: user?.studentProfile?.studentId || '',
  });

  const [skills, setSkills] = useState(
    user?.studentProfile?.skills || ''
  );

  const [notifications, setNotifications] = useState({
    eventUpdates: true,
    newOpportunities: true,
    certificates: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = e => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-6">

      {/* Page header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
          Settings
        </h1>
        <p className="mt-1 text-gray-500">Manage your account preferences</p>
      </div>

      {/* ── Account Settings ───────────────────────────── */}
      <section className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500" />
        <div className="p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <User className="w-5 h-5 text-purple-500" /> Account Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
              <input
                type="text"
                value={account.name}
                onChange={e => setAccount(p => ({ ...p, name: e.target.value }))}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address</span>
              </label>
              <input
                type="email"
                value={account.email}
                onChange={e => setAccount(p => ({ ...p, email: e.target.value }))}
                placeholder="Enter your email"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Academic Information ───────────────────────── */}
      <section className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500" />
        <div className="p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <GraduationCap className="w-5 h-5 text-purple-500" /> Academic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Faculty / Department</label>
              <input
                type="text"
                value={academic.faculty}
                onChange={e => setAcademic(p => ({ ...p, faculty: e.target.value }))}
                placeholder="e.g. Faculty of Computer Science"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Student ID</label>
              <input
                type="text"
                value={academic.studentId}
                onChange={e => setAcademic(p => ({ ...p, studentId: e.target.value }))}
                placeholder="e.g. S12345678"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills & Interests ────────────────────────── */}
      <section className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500" />
        <div className="p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Tag className="w-5 h-5 text-purple-500" /> Skills & Interests
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Your Skills
            </label>
            <textarea
              rows={3}
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. First Aid, Communication, Gardening, Driving…"
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1 text-xs text-gray-400">Separate skills with commas</p>
          </div>
        </div>
      </section>

      {/* ── Notification Preferences ──────────────────── */}
      <section className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500" />
        <div className="p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Bell className="w-5 h-5 text-purple-500" /> Notification Preferences
          </h2>

          <div className="space-y-3">
            {[
              { key: 'eventUpdates', label: 'Event Updates', desc: 'Get notified about changes to events you joined' },
              { key: 'newOpportunities', label: 'New Opportunities', desc: 'Receive alerts when new volunteer events are posted' },
              { key: 'certificates', label: 'Certificates Issued', desc: 'Be notified when a new certificate is issued to you' },
            ].map(({ key, label, desc }) => (
              <label
                key={key}
                className="flex items-start gap-3 p-3 transition-colors cursor-pointer rounded-xl hover:bg-purple-50"
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={e => setNotifications(p => ({ ...p, [key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                      ${notifications[key]
                        ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-transparent'
                        : 'border-gray-300 bg-white'}`}
                  >
                    {notifications[key] && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* ── Password ──────────────────────────────────── */}
      <section className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500" />
        <div className="p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Lock className="w-5 h-5 text-purple-500" /> Change Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Current Password</label>
              <input type="password" placeholder="Enter current password" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">New Password</label>
              <input type="password" placeholder="Enter new password" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm New Password</label>
              <input type="password" placeholder="Re-enter new password" className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      {/* Save button */}
      <div className="flex items-center gap-4 pb-4">
        <button
          onClick={handleSave}
          className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500
            hover:from-blue-500 hover:to-purple-600 text-white font-semibold text-sm
            shadow-sm hover:shadow-md transition-all"
        >
          Save Changes
        </button>

        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-pulse">
            <CheckCircle className="w-4 h-4" /> Changes saved!
          </span>
        )}
      </div>

    </div>
  );
};

export default StudentSettings;
