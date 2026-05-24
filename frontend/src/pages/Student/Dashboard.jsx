import { Calendar, Trophy, Award, Clock } from 'lucide-react';

const stats = [
  { label: 'Events Joined',      value: 12,  icon: Calendar, color: 'from-blue-400 to-purple-500' },
  { label: 'Reputation Points',  value: 850, icon: Trophy,   color: 'from-blue-400 to-purple-500' },
  { label: 'Certificates Earned',value: 8,   icon: Award,    color: 'from-blue-400 to-purple-500' },
  { label: 'Volunteer Hours',    value: 48,  icon: Clock,    color: 'from-blue-400 to-purple-500' },
];

const Dashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
      <p className="text-gray-500 mt-1">Here's what's happening with your volunteer journey</p>
    </div>

    {/* Stat Cards — full-gradient, icon top-left, value top-right */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]`}
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">{value}</span>
          </div>
          <p className="text-sm font-medium text-white/80 mt-4">{label}</p>
        </div>
      ))}
    </div>

    {/* Upcoming Events Placeholder */}
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
