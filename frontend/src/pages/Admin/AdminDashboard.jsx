import { Users, CalendarCheck, ShieldCheck, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const stats = [
  { label: 'Total Users',      value: '—', icon: Users,        gradient: 'from-blue-500 to-indigo-600' },
  { label: 'Pending Events',   value: '—', icon: CalendarCheck, gradient: 'from-amber-400 to-orange-500' },
  { label: 'Active Admins',    value: '—', icon: ShieldCheck,   gradient: 'from-emerald-400 to-teal-500' },
  { label: 'Approvals Today',  value: '—', icon: TrendingUp,    gradient: 'from-purple-500 to-pink-500' },
];

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-500 mt-1">Platform overview and management</p>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map(({ label, value, icon: Icon, gradient }) => (
        <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Recent Activity Placeholder */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-500" /> Recent Activity
      </h2>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-12 h-12 text-indigo-100 mb-3" />
        <p className="text-gray-400 font-medium">No recent activity yet</p>
        <p className="text-gray-300 text-sm mt-1">Activity will appear here as actions are performed</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
