import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Calendar } from 'lucide-react';

const MOCK_EVENTS = [
  { id: 1, title: 'Beach Cleanup Drive',     category: 'Environment',       date: '2025-06-10', location: 'Galle Beach',         volunteers: 25, maxVolunteers: 30, status: 'Active' },
  { id: 2, title: 'Tech Workshop for Youth', category: 'Technology',        date: '2025-06-15', location: 'Colombo City Hall',    volunteers: 18, maxVolunteers: 20, status: 'Active' },
  { id: 3, title: 'Tree Planting Campaign',  category: 'Environment',       date: '2025-06-20', location: 'Kandy Botanical',      volunteers: 12, maxVolunteers: 40, status: 'Upcoming' },
  { id: 4, title: 'Food Distribution',       category: 'Community Service', date: '2025-05-28', location: 'Jaffna Community Ctr', volunteers: 22, maxVolunteers: 25, status: 'Completed' },
  { id: 5, title: 'First Aid Training',      category: 'Health',            date: '2025-07-01', location: 'Teaching Hospital',    volunteers: 8,  maxVolunteers: 15, status: 'Upcoming' },
  { id: 6, title: 'Art for Kids Workshop',   category: 'Arts & Culture',    date: '2025-05-15', location: 'Negombo School',       volunteers: 20, maxVolunteers: 20, status: 'Completed' },
];

const statusStyle = {
  Active:    'bg-green-100 text-green-700',
  Upcoming:  'bg-blue-100 text-blue-700',
  Completed: 'bg-gray-100 text-gray-600',
};

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || e.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id) => setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
          <p className="text-gray-500 text-sm mt-0.5">{events.length} total events</p>
        </div>
        <button
          onClick={() => navigate('/organizer/create-event')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            text-white bg-gradient-to-r from-cyan-400 to-blue-500
            hover:from-cyan-500 hover:to-blue-600 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-xl px-3 py-2
            focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all bg-gray-50">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Active', 'Upcoming', 'Completed'].map((s) => (
              <button
                key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === s
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-cyan-50 hover:text-cyan-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Event', 'Category', 'Date', 'Location', 'Volunteers', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No events found
                  </td>
                </tr>
              ) : filtered.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{event.title}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{event.category}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{event.date}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[140px] truncate">{event.location}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    <span className="font-medium">{event.volunteers}</span>
                    <span className="text-gray-400">/{event.maxVolunteers}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[event.status]}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-cyan-600 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

export default ManageEvents;
