import { useState, useEffect } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Calendar, Users, UserCheck, TrendingUp } from 'lucide-react';
import { getOrganizerStats, getMyEvents } from '../../services/eventService';
import { getApplicationsForOrganizer } from '../../services/applicationService';

const PIE_COLORS = ['#06B6D4', '#0284C7', '#0EA5E9', '#38BDF8', '#7DD3FC'];

const statusStyle = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

const monthKey = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
};

const buildLineData = (applications) => {
  const counts = {};
  applications.forEach((a) => {
    const key = monthKey(a.appliedDate);
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([month, applications]) => ({ month, applications }));
};

const buildPieData = (events, applications) => {
  const appCountByEvent = {};
  applications.forEach((a) => {
    appCountByEvent[a.event] = (appCountByEvent[a.event] || 0) + 1;
  });
  return events
    .filter((e) => e.volunteerRequired > 0)
    .map((e) => ({
      name: e.title,
      value: Math.min(100, Math.round(((appCountByEvent[e.title] || 0) / e.volunteerRequired) * 100)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [statsData, applications, events] = await Promise.all([
          getOrganizerStats(),
          getApplicationsForOrganizer(),
          getMyEvents(),
        ]);
        setStats(statsData);
        setRecentEvents(statsData.recentEvents || []);
        setLineData(buildLineData(applications));
        setPieData(buildPieData(events, applications));
      } catch (err) {
        setError('Could not load dashboard data from the server.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = stats ? [
    { label: 'Active Events',       value: stats.activeEvents,       icon: Calendar,   color: 'from-cyan-500 to-blue-600' },
    { label: 'Total Applications',  value: stats.totalApplications,  icon: Users,      color: 'from-blue-400 to-cyan-500' },
    { label: 'Approved Volunteers', value: stats.approvedVolunteers, icon: UserCheck,  color: 'from-cyan-400 to-blue-500' },
    { label: 'Success Rate',        value: stats.successRate,        icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
  ] : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Organizer Dashboard 🎯</h1>
        <p className="text-gray-500 text-base mt-1">
          Manage your events and track volunteer engagement
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading dashboard…</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {statCards.map(({ label, value, icon: Icon, color }) => (
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
              {lineData.length === 0 ? (
                <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">No application data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                    <YAxis tick={{ fontSize: 13 }} allowDecimals={false} />
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
              )}
            </div>

            {/* Pie chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Event Participation Rate (%)</h2>
              {pieData.length === 0 ? (
                <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">No event data yet</div>
              ) : (
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
              )}
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
                    {['Event Name', 'Date', 'Volunteers Needed', 'Status'].map((h) => (
                      <th key={h} className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentEvents.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-12 text-gray-400 text-sm">No events created yet</td></tr>
                  ) : recentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-base font-medium text-gray-800">{event.title}</td>
                      <td className="px-5 py-3 text-base text-gray-500">{event.eventDate?.slice(0, 10)}</td>
                      <td className="px-5 py-3 text-base text-gray-600">{event.volunteerRequired}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[event.status] || 'bg-gray-100 text-gray-600'}`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrganizerDashboard;
