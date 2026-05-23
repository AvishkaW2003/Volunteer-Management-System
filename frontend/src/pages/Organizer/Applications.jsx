import { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

const MOCK_APPLICATIONS = [
  { id: 1, name: 'Ashan Perera',         email: 'ashan@uni.lk',     event: 'Beach Cleanup Drive',     appliedDate: '2025-05-20', status: 'Pending' },
  { id: 2, name: 'Nimasha Silva',        email: 'nimasha@uni.lk',   event: 'Tech Workshop for Youth', appliedDate: '2025-05-21', status: 'Approved' },
  { id: 3, name: 'Dilshan Wickramasinghe', email: 'dilshan@uni.lk', event: 'Tree Planting Campaign',  appliedDate: '2025-05-22', status: 'Pending' },
  { id: 4, name: 'Kavya Raj',            email: 'kavya@uni.lk',     event: 'Beach Cleanup Drive',     appliedDate: '2025-05-23', status: 'Approved' },
  { id: 5, name: 'Tharushi Jayawardena', email: 'tharushi@uni.lk',  event: 'Food Distribution',       appliedDate: '2025-05-24', status: 'Rejected' },
  { id: 6, name: 'Lahiru Fernando',      email: 'lahiru@uni.lk',    event: 'First Aid Training',      appliedDate: '2025-05-25', status: 'Pending' },
  { id: 7, name: 'Sanduni Herath',       email: 'sanduni@uni.lk',   event: 'Tech Workshop for Youth', appliedDate: '2025-05-26', status: 'Approved' },
  { id: 8, name: 'Kasun Mendis',         email: 'kasun@uni.lk',     event: 'Art for Kids Workshop',   appliedDate: '2025-05-27', status: 'Pending' },
];

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
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const updateStatus = (id, status) =>
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.event.toLowerCase().includes(search.toLowerCase());
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
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-cyan-600 text-xs font-bold">{app.name.charAt(0)}</span>
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
                          onClick={() => updateStatus(app.id, 'Approved')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                            bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'Rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                            bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
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
