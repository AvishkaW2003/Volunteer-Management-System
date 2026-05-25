import { useState, useEffect } from 'react';
import { 
  Settings, Shield, Bell, Save, CheckCircle, AlertTriangle, 
  HelpCircle, Monitor, Laptop, Server, AppWindow, Mail, Sparkles
} from 'lucide-react';
import { getSettings, updateSettings } from '../../services/adminService';

const SystemSettings = () => {
  const [formData, setFormData] = useState({
    siteName: 'VolunteerHub',
    adminEmail: 'admin@gmail.com',
    maxEventsPerClub: 10,
    eventApprovalRequired: true,
    notificationsEnabled: true,
    darkModeEnabled: false,
    registrationOpen: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data) {
          setFormData({
            siteName: data.siteName ?? 'VolunteerHub',
            adminEmail: data.adminEmail ?? 'admin@gmail.com',
            maxEventsPerClub: data.maxEventsPerClub ?? 10,
            eventApprovalRequired: !!data.eventApprovalRequired,
            notificationsEnabled: !!data.notificationsEnabled,
            darkModeEnabled: !!data.darkModeEnabled,
            registrationOpen: !!data.registrationOpen,
            maintenanceMode: !!data.maintenanceMode,
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load system settings from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await updateSettings(formData);
      setSuccess(true);
      // Optional: Add styling flag or trigger local dark mode reload if relevant
      if (formData.darkModeEnabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Failed to save system settings.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-8 h-8 text-teal-600" /> System Settings
        </h1>
        <p className="text-slate-500 mt-1">Configure global application variables, authentication defaults, and system toggles.</p>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Help & Info Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-teal-600" /> Settings Assistance
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              These variables affect the volunteer hub's business rules and database storage globally. Keep them updated to ensure smooth club activities.
            </p>
            <div className="space-y-3.5 pt-2">
              <div className="flex gap-3 text-xs text-slate-600">
                <Shield className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-700">Approval Toggle</span>
                  If disabled, events submitted by club organizers bypass approval and go live immediately.
                </div>
              </div>
              <div className="flex gap-3 text-xs text-slate-600">
                <Bell className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-700">Notifications Toggle</span>
                  Send system alerts and email updates to students and organizers automatically.
                </div>
              </div>
              <div className="flex gap-3 text-xs text-slate-600">
                <Monitor className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-700">Dark Theme Setup</span>
                  Toggle database-supported theme mode which enables custom system colors.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600" /> Platform Configuration Form
              </h2>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 text-xs flex items-center gap-2 animate-pulse">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>System settings updated successfully! Database records synchronized.</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Site Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Platform Name
                  </label>
                  <div className="flex items-center bg-slate-50 border border-teal-100 rounded-xl focus-within:border-teal-400 transition-colors">
                    <span className="pl-4 pr-1 text-slate-400 text-sm font-semibold flex items-center">
                      <AppWindow className="w-4 h-4 text-teal-600" />
                    </span>
                    <input
                      type="text"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. VolunteerHub"
                      className="w-full bg-transparent border-none outline-none px-3 py-2.5 text-sm text-slate-700"
                    />
                  </div>
                </div>

                {/* Admin Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Admin Email Address
                  </label>
                  <div className="flex items-center bg-slate-50 border border-teal-100 rounded-xl focus-within:border-teal-400 transition-colors">
                    <span className="pl-4 pr-1 text-slate-400 text-sm font-semibold flex items-center">
                      <Mail className="w-4 h-4 text-teal-600" />
                    </span>
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      required
                      placeholder="e.g. admin@gmail.com"
                      className="w-full bg-transparent border-none outline-none px-3 py-2.5 text-sm text-slate-700"
                    />
                  </div>
                </div>

                {/* Max Events Per Club Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Max Events Per Club / Organizer
                  </label>
                  <div className="flex items-center bg-slate-50 border border-teal-100 rounded-xl focus-within:border-teal-400 transition-colors">
                    <span className="pl-4 pr-1 text-slate-400 text-sm font-semibold flex items-center">
                      <Server className="w-4 h-4 text-teal-600" />
                    </span>
                    <input
                      type="number"
                      name="maxEventsPerClub"
                      value={formData.maxEventsPerClub}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full bg-transparent border-none outline-none px-3 py-2.5 text-sm text-slate-700"
                    />
                  </div>
                </div>

                {/* Toggle Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Event Approval Toggle */}
                  <div className="flex items-center justify-between p-4 bg-teal-50/20 rounded-xl border border-teal-100">
                    <div className="space-y-0.5 pr-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Require Event Approval
                      </label>
                      <span className="text-[10px] text-slate-400 leading-tight block">
                        Organizer events must be checked by Admins before listing.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="eventApprovalRequired"
                        checked={formData.eventApprovalRequired}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  {/* Notification Toggle */}
                  <div className="flex items-center justify-between p-4 bg-teal-50/20 rounded-xl border border-teal-100">
                    <div className="space-y-0.5 pr-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Enable Notifications
                      </label>
                      <span className="text-[10px] text-slate-400 leading-tight block">
                        Allow notifications for event submissions, signups, etc.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="notificationsEnabled"
                        checked={formData.notificationsEnabled}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between p-4 bg-teal-50/20 rounded-xl border border-teal-100">
                    <div className="space-y-0.5 pr-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Dark Mode Support
                      </label>
                      <span className="text-[10px] text-slate-400 leading-tight block">
                        Enable dark mode palette across UI and dashboards.
                      </span>
                    </div>
                    <label className="relative inline-flex inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="darkModeEnabled"
                        checked={formData.darkModeEnabled}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  {/* Registration Open Toggle */}
                  <div className="flex items-center justify-between p-4 bg-teal-50/20 rounded-xl border border-teal-100">
                    <div className="space-y-0.5 pr-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Open Registrations
                      </label>
                      <span className="text-[10px] text-slate-400 leading-tight block">
                        Allow new students/organizers to create active accounts.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="registrationOpen"
                        checked={formData.registrationOpen}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  {/* Maintenance Mode Toggle */}
                  <div className="flex items-center justify-between p-4 bg-teal-50/20 rounded-xl border border-teal-100 col-span-1 md:col-span-2">
                    <div className="space-y-0.5 pr-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Enable Maintenance Mode
                      </label>
                      <span className="text-[10px] text-slate-400 leading-tight block">
                        Bypasses login for non-admins and shows a "Maintenance" notification page.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={formData.maintenanceMode}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all font-medium text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
