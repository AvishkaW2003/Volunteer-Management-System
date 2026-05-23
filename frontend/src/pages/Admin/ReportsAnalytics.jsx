import { BarChart2, Users, CalendarCheck, TrendingUp } from 'lucide-react';

const summaryCards = [
  { label: 'Total Registrations', value: '—', icon: Users,         color: 'text-blue-500',   bg: 'bg-blue-50' },
  { label: 'Events Completed',    value: '—', icon: CalendarCheck, color: 'text-green-500',  bg: 'bg-green-50' },
  { label: 'Avg Attendance',      value: '—', icon: TrendingUp,    color: 'text-purple-500', bg: 'bg-purple-50' },
];

const ReportsAnalytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <BarChart2 className="w-8 h-8 text-indigo-500" /> Reports & Analytics
      </h1>
      <p className="text-gray-500 mt-1">Platform-wide statistics and insights</p>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Charts placeholder */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-60">
      <BarChart2 className="w-14 h-14 text-indigo-100 mb-3" />
      <p className="text-gray-400 font-medium">Analytics charts coming soon</p>
      <p className="text-gray-300 text-sm mt-1">Connect the backend to populate reports here</p>
    </div>
  </div>
);

export default ReportsAnalytics;
