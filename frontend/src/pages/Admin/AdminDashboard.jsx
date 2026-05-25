import { useState, useEffect } from 'react';
import { Users, CalendarCheck, ShieldCheck, Clock, CheckCircle, XCircle, Award, Compass } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getAdminDashboard, approveEvent, rejectEvent } from '../../services/adminService';
import { formatDate } from '../../utils/formatDate';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      const data = await getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this event?')) {
      return;
    }
    try {
      await approveEvent(id);
      alert('Event approved successfully.');
      fetchDashboard(); // reload metrics and lists
    } catch (err) {
      console.error('Error approving event:', err);
      alert('Failed to approve event.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this event?')) {
      return;
    }
    try {
      await rejectEvent(id);
      alert('Event rejected successfully.');
      fetchDashboard(); // reload metrics and lists
    } catch (err) {
      console.error('Error rejecting event:', err);
      alert('Failed to reject event.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#14B8A6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200 shadow-sm">
        {error}
      </div>
    );
  }

  // Stats cards definitions
  const stats = [
    { label: 'Total Students', value: dashboardData?.totalStudents ?? 0, icon: Users, gradient: 'from-[#14B8A6] to-[#6EE7D8]' },
    { label: 'Total Events', value: dashboardData?.totalEvents ?? 0, icon: CalendarCheck, gradient: 'from-sky-400 to-sky-300' },
    { label: 'Partner Clubs', value: dashboardData?.partnerClubs ?? 0, icon: Compass, gradient: 'from-indigo-400 to-indigo-300' },
    { label: 'Volunteer Hours', value: `${dashboardData?.volunteerHours ?? 0} hrs`, icon: Award, gradient: 'from-amber-400 to-amber-300' },
  ];

  return (
    <div className="space-y-6 text-[#1E293B]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1E293B]">VolunteerHub Admin Dashboard</h1>
        <p className="text-[#64748B] mt-1 font-medium">Platform overview and activity summary</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, gradient }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-md">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#1E293B]">{value}</p>
              <p className="text-sm font-semibold text-[#64748B]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#1E293B] mb-4">User Growth (Students & Organizers)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData?.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="students" stroke="#14B8A6" strokeWidth={3} activeDot={{ r: 8 }} name="Students" />
                <Line type="monotone" dataKey="organizers" stroke="#6366F1" strokeWidth={3} name="Organizers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Trends Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#1E293B] mb-4">Event & Participation Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData?.eventTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="events" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Events Created" />
                <Bar dataKey="participation" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Registrations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Event Approvals */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#14B8A6]" /> Pending Event Approvals
            </h3>
            {(!dashboardData?.pendingEvents || dashboardData.pendingEvents.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#64748B]">
                <CheckCircle className="w-12 h-12 text-teal-100 mb-2" />
                <p className="font-semibold">All clear!</p>
                <p className="text-sm">No events are waiting for approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.pendingEvents.map((ev) => (
                  <div key={ev.id} className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-bold text-sm text-[#1E293B]">{ev.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">Organizer: {ev.User?.name || 'Club'}</p>
                      <p className="text-xs text-indigo-500 font-medium mt-0.5">Date: {ev.eventDate} | Time: {ev.time || '10:00 AM'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(ev.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#22C55E] hover:bg-green-600 text-white text-xs font-bold transition-all shadow-sm shadow-green-500/10"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(ev.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#EF4444] hover:bg-red-600 text-white text-xs font-bold transition-all shadow-sm shadow-red-500/10"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent System Activity Logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" /> Recent System Activity
          </h3>
          {(!dashboardData?.recentActivity || dashboardData.recentActivity.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[#64748B]">
              <Clock className="w-12 h-12 text-indigo-100 mb-2" />
              <p className="font-semibold">No recent logs</p>
              <p className="text-sm">Activity will appear as actions are performed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentActivity.map((log) => (
                <div key={log.id} className="flex gap-3.5 items-start">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] flex-shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#1E293B]">{log.action}</p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatDate(log.createdAt)}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
