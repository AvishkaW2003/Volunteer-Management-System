import { Settings, Shield, Database, Bell, Save } from 'lucide-react';

const sections = [
    { icon: Shield, title: 'Security', desc: 'Manage authentication and access control settings.' },
    { icon: Database, title: 'Database', desc: 'Configure database connection and backup options.' },
    { icon: Bell, title: 'Notifications', desc: 'Set up email and push notification preferences.' },
];

const SystemSettings = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                System Settings
            </h1>
            <p className="text-gray-500 mt-1">Configure platform-wide settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sections.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                        <p className="text-sm text-gray-500">{desc}</p>
                        <button className="mt-3 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                            Configure →
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">General Settings</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                    <input
                        type="text"
                        defaultValue="VolunteerHub"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input
                        type="email"
                        defaultValue="support@volunteerhub.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
        </div>
    </div>
);

export default SystemSettings;
