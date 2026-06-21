import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getApplicationsForOrganizer, updateApplicationStatus } from '../../services/applicationService';

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
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getApplicationsForOrganizer();
      setApplications(data);
    } catch (err) {
      setError('Could not load applications from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.event?.toLowerCase().includes(search.toLowerCase());
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

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2
          focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all bg-gray-50">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by volunteer name or event…"
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Volunteer', 'Email', 'Event', 'Applied', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Loading applications…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No applications found</td>
                </tr>
              ) : filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-cyan-600 text-xs font-bold">{app.name?.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{app.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{app.email}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{app.event}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{app.appliedDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[app.status]}`}>
                      <StatusIcon status={app.status} />
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {app.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={updatingId === app.id}
                          onClick={() => updateStatus(app.id, 'Approved')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                            bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          disabled={updatingId === app.id}
                          onClick={() => updateStatus(app.id, 'Rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                            bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;
