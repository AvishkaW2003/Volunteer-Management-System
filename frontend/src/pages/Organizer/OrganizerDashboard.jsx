import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Calendar, Users, UserCheck, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Active Events',        value: 15,    icon: Calendar,   color: 'from-cyan-500 to-blue-600' },
  { label: 'Total Applications',   value: 120,   icon: Users,      color: 'from-blue-400 to-cyan-500' },
  { label: 'Approved Volunteers',  value: 98,    icon: UserCheck,  color: 'from-cyan-400 to-blue-500' },
  { label: 'Success Rate',         value: '87%', icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
];

const lineData = [
  { month: 'Jan', applications: 45 },
  { month: 'Feb', applications: 58 },
  { month: 'Mar', applications: 70 },
  { month: 'Apr', applications: 95 },
  { month: 'May', applications: 120 },
];

const pieData = [
  { name: 'Beach Cleanup',     value: 85 },
  { name: 'Tech Workshop',     value: 82 },
  { name: 'Tree Planting',     value: 78 },
  { name: 'Food Distribution', value: 95 },
];

const PIE_COLORS = ['#06B6D4', '#0284C7', '#0EA5E9', '#38BDF8'];

const recentEvents = [
  { name: 'Beach Cleanup',     date: '2025-06-10', volunteers: 25, status: 'Active' },
  { name: 'Tech Workshop',     date: '2025-06-15', volunteers: 18, status: 'Active' },
  { name: 'Tree Planting',     date: '2025-06-20', volunteers: 30, status: 'Upcoming' },
  { name: 'Food Distribution', date: '2025-05-28', volunteers: 22, status: 'Completed' },
];

const statusStyle = {
  Active:    'bg-green-100 text-green-700',
  Upcoming:  'bg-blue-100 text-blue-700',
  Completed: 'bg-gray-100 text-gray-600',
};

const OrganizerDashboard = () => (
  <div>
    {/* Header */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Organizer Dashboard 🎯</h1>
      <p className="text-gray-500 text-base mt-1">
        Manage your events and track volunteer engagement
      </p>
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white`}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-3xl font-bold">{value}</span>
          </div>
          <p className="text-white/80 text-base font-medium">{label}</p>
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* Line chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Applications Over Time</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#06B6D4"
              strokeWidth={2.5}
              dot={{ fill: '#0284C7', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Event Participation Rate (%)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={85}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={true}
              fontSize={11}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Recent events table */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Recent Events</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Event Name', 'Date', 'Volunteers', 'Status'].map((h) => (
                <th key={h} className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentEvents.map((event) => (
              <tr key={event.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-base font-medium text-gray-800">{event.name}</td>
                <td className="px-5 py-3 text-base text-gray-500">{event.date}</td>
                <td className="px-5 py-3 text-base text-gray-600">{event.volunteers}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[event.status]}`}>
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default OrganizerDashboard;
