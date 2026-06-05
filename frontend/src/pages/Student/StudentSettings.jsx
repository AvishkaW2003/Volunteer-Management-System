import { useState } from 'react';
import { User, BookOpen, Star, Bell, Lock, Check } from 'lucide-react';

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 ' +
  'focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 ' +
  'placeholder-gray-400 transition bg-white';

const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="h-1.5 bg-gradient-to-r from-blue-400 to-purple-500" />
    <div className="p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500
          flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  </div>
);

const GradientCheckbox = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className="relative flex-shrink-0" onClick={onChange}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
        ${checked
          ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-transparent'
          : 'border-gray-300 bg-white group-hover:border-purple-300'}`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
    <span className="text-sm text-gray-600">{label}</span>
  </label>
);

const StudentSettings = () => {
  const [saved, setSaved] = useState(false);

  const [account, setAccount] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    bio: '',
  });

  const [academic, setAcademic] = useState({
    studentId: 'STU-2024-001',
    department: 'Computer Science',
    year: '3rd Year',
    university: 'State University',
  });

  const [skills, setSkills] = useState({
    teamwork: true, communication: true, teaching: false,
    firstAid: false, physical: true, organisation: false,
  });

  const [notifications, setNotifications] = useState({
    newEvents: true, applicationUpdates: true,
    certificates: true, leaderboard: false, newsletter: false,
  });

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleSkill = key => setSkills(p => ({ ...p, [key]: !p[key] }));
  const toggleNotif = key => setNotifications(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="mt-1 text-gray-500">Manage your profile and preferences</p>
      </div>

      {/* Account Settings */}
      <SectionCard icon={User} title="Account Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Full Name</label>
            <input type="text" className={inputCls} value={account.name}
              onChange={e => setAccount(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Email Address</label>
            <input type="email" className={inputCls} value={account.email}
              onChange={e => setAccount(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Bio <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea rows={3} className={`${inputCls} resize-none`}
              placeholder="Tell others a little about yourself..."
              value={account.bio}
              onChange={e => setAccount(p => ({ ...p, bio: e.target.value }))} />
          </div>
        </div>
      </SectionCard>

      {/* Academic Information */}
      <SectionCard icon={BookOpen} title="Academic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Student ID</label>
            <input type="text" className={inputCls} value={academic.studentId}
              onChange={e => setAcademic(p => ({ ...p, studentId: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Year of Study</label>
            <select className={inputCls} value={academic.year}
              onChange={e => setAcademic(p => ({ ...p, year: e.target.value }))}>
              {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'].map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Department</label>
            <input type="text" className={inputCls} value={academic.department}
              onChange={e => setAcademic(p => ({ ...p, department: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>University / Institution</label>
            <input type="text" className={inputCls} value={academic.university}
              onChange={e => setAcademic(p => ({ ...p, university: e.target.value }))} />
          </div>
        </div>
      </SectionCard>

      {/* Skills & Interests */}
      <SectionCard icon={Star} title="Skills & Interests">
        <p className="text-sm text-gray-500 mb-4">Select skills that match your capabilities</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries({
            teamwork:      'Teamwork',
            communication: 'Communication',
            teaching:      'Teaching',
            firstAid:      'First Aid',
            physical:      'Physical Work',
            organisation:  'Organisation',
          }).map(([key, label]) => (
            <GradientCheckbox
              key={key}
              checked={skills[key]}
              onChange={() => toggleSkill(key)}
              label={label}
            />
          ))}
        </div>
      </SectionCard>

      {/* Notification Preferences */}
      <SectionCard icon={Bell} title="Notification Preferences">
        <div className="space-y-3">
          {Object.entries({
            newEvents:          'Notify me about new events',
            applicationUpdates: 'Application status updates',
            certificates:       'Certificate issued notifications',
            leaderboard:        'Leaderboard rank changes',
            newsletter:         'Monthly volunteer newsletter',
          }).map(([key, label]) => (
            <GradientCheckbox
              key={key}
              checked={notifications[key]}
              onChange={() => toggleNotif(key)}
              label={label}
            />
          ))}
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard icon={Lock} title="Change Password">
        <div className="space-y-4 max-w-md">
          <div>
            <label className={labelCls}>Current Password</label>
            <input type="password" className={inputCls} placeholder="Enter current password"
              value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input type="password" className={inputCls} placeholder="Enter new password"
              value={passwords.newPass}
              onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input type="password" className={inputCls} placeholder="Re-enter new password"
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
          </div>
        </div>
      </SectionCard>

      {/* Save Button */}
      <div className="flex items-center gap-4 pb-4">
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-xl font-semibold text-sm text-white
            bg-gradient-to-r from-blue-400 to-purple-500
            hover:from-blue-500 hover:to-purple-600
            transition-all shadow-sm hover:shadow-md"
        >
          Save Changes
        </button>

        {saved && (
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <Check className="w-4 h-4" />
            Changes saved!
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentSettings;
