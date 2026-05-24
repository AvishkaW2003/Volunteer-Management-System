import { Calendar, Trophy, Award, Clock } from 'lucide-react';

const stats = [
  { label: 'Events Joined',    value: '—', icon: Calendar,       gradient: 'from-blue-400 to-purple-500' },
  { label: 'Hours Volunteered',value: '—', icon: Clock,          gradient: 'from-purple-400 to-pink-500' },
  { label: 'Points Earned',    value: '—', icon: Star,           gradient: 'from-amber-400 to-orange-500' },
];

const Dashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <LayoutDashboard className="w-8 h-8 text-purple-500" /> Student Dashboard
      </h1>
      <p className="text-gray-500 mt-1">Welcome back! Here's your volunteer summary.</p>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {stats.map(({ label, value, icon: Icon, gradient }) => (
        <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
          <p className="text-sm font-medium text-white/80 mt-4">{label}</p>
        </div>
      ))}
    </div>

    {/* Upcoming Events */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h2>
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Calendar className="w-12 h-12 text-purple-100 mb-3" />
        <p className="text-gray-400 font-medium">No upcoming events</p>
        <p className="text-gray-300 text-sm mt-1">Browse events to find volunteer opportunities</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
