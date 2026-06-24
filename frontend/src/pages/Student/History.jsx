import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle } from 'lucide-react';
import { getMyAttendance } from '../../services/attendanceService';

const History = () => {
  const { user } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        // API call here
      } catch (err) {
        console.error("Error loading volunteer history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);
  const data = await getMyAttendance();
        const presentRecords = data.filter(rec => rec.status === 'Present');
        const normalized = presentRecords.map(rec => ({
          id: rec.id,
          event: rec.event?.title || 'Unknown Event',
          organizer: rec.event?.User?.name || 'Organizer',
          completedOn: new Date(rec.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          hours: rec.event?.volunteerHours || 4,
          reputationPoints: rec.event?.reputationPoints || 10,
          status: 'Issued'
        }));
        setHistoryList(normalized);
        const totalHours = historyList.reduce((sum, h) => sum + (h.hours || 0), 0);
  const totalPoints = historyList.reduce((sum, h) => sum + (h.reputationPoints || 0), 0);
  const totalEvents = historyList.length;

  const stats = [
    { value: totalEvents, suffix: '', label: 'Events Completed' },
    { value: totalHours, suffix: 'h', label: 'Total Hours' },
    { value: totalPoints, suffix: '', label: 'Points Earned' },
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
          Volunteer History
        </h1>
        <p className="mt-1 text-gray-500">Your completed volunteer activities</p>
      </div>
      {/* 3 Dynamic Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ value, suffix, label }) => (
          <div key={label}
            className="p-6 shadow-sm bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-purple-200">
            <p className="text-3xl font-extrabold text-white">
              {value}{suffix}
            </p>
            <p className="mt-1 text-sm font-medium text-white/70">{label}</p>
          </div>
        ))}
      </div>
      {/* History Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                {['Event Name', 'Club', 'Participation Date', 'Volunteer Hours', 'Reputation Points', 'Certificate Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-sm text-center text-gray-400">
                    Loading history...
                  </td>
                </tr>
              ) : historyList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-sm text-center text-gray-400">
                    No completed volunteer activities found.
                  </td>
                </tr>
              ) : (