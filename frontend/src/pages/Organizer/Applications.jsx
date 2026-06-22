import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getOrganizerAllApplications, approveApplication, rejectApplication } from '../../services/applicationService';

const statusStyle = {
  Pending:  'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-600',
};

const StatusIcon = ({ status }) => {
  if (status === 'Approved') return <CheckCircle className="w-3.5 h-3.5" />;
  if (status === 'Rejected') return <XCircle className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = await getOrganizerAllApplications();
        const normalized = data.map(app => ({
          id: app.id,
          name: app.volunteer?.name || 'Volunteer',
          email: app.volunteer?.email || '',
          event: app.event?.title || 'Unknown Event',
          appliedDate: new Date(app.createdAt).toISOString().split('T')[0],
          status: app.status || 'Pending',
        }));
        setApplications(normalized);
      } catch (err) {
        console.error("Error fetching organizer applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      if (status === 'Approved') {
        await approveApplication(id);
      } else if (status === 'Rejected') {
        await rejectApplication(id);
      }
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error("Error updating application status:", err);
      alert(err.response?.data?.message || err.message || "Failed to update application status");
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.event || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    All:      applications.length,
    Pending:  applications.filter((a) => a.status === 'Pending').length,
    Approved: applications.filter((a) => a.status === 'Approved').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
        <p className="text-gray-500 text-md mt-0.5">Review and manage volunteer applications</p>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {Object.entries(counts).map(([key, val]) => (
          <button
            key={key} onClick={() => setFilter(key)}
            className={`rounded-xl px-4 py-3 text-left transition-all border ${
              filter === key
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-cyan-500 shadow-sm'
                : 'bg-white text-gray-700 border-gray-100 hover:border-purple-200'
            }`}
          >
            <div className="text-2xl font-bold">{val}</div>
            <div className="text-s mt-0.5 opacity-80">{key}</div>
          </button>
        ))}
      </div>