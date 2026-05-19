import { useState } from 'react';
import { Save, Building, Mail, Phone, Globe } from 'lucide-react';

const OrganizerSettings = () => {
  const [form, setForm] = useState({
    orgName:  'IEEE Student Branch',
    email:    'ieee@university.edu',
    phone:    '+94 11 2345678',
    website:  'https://ieee.university.edu',
    bio:      'The IEEE Student Branch organizes technical workshops, community outreach programs, and volunteer events for students.',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    'flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent w-full';

  const iconInput = (Icon, name, type = 'text', placeholder = '') => (
    <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2
      bg-gray-50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <input
        type={type} name={name} value={form[name]}
        onChange={handleChange} placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-base mt-0.5">Manage your organization profile and preferences</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          Settings saved successfully!
        </div>
      )}

      <div className="max-w-2xl space-y-5">

        {/* Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Organization Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">VH</span>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-700">{form.orgName}</p>
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">Organization Name</label>
              {iconInput(Building, 'orgName', 'text', 'Organization name')}
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">Email Address</label>
              {iconInput(Mail, 'email', 'email', 'contact@org.edu')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">Phone</label>
                {iconInput(Phone, 'phone', 'tel', '+94 ...')}
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-cyan-400 to-blue-500
                hover:from-cyan-500 hover:to-blue-600 transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </form>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            {[
              'Email me when a new application is submitted',
              'Email me when an event is approved by admin',
              'Email me attendance reminders',
            ].map((label) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500 cursor-pointer" />
                <span className="text-base text-gray-600 group-hover:text-gray-800 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerSettings;
