import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Calendar, X } from 'lucide-react';
import { getMyEvents, updateEvent, deleteEvent } from '../../services/eventService';

const CATEGORIES = ['Community Service', 'Environment', 'Education', 'Health', 'Technology', 'Sports', 'Arts & Culture'];
const STATUSES   = ['Draft', 'Upcoming', 'Active', 'Completed', 'Archived'];

const fieldClass =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 bg-gray-50 ' +
  'outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all';

const statusStyle = {
  Draft:     'bg-slate-100 text-slate-700',
  Active:    'bg-green-100 text-green-700',
  Upcoming:  'bg-blue-100 text-blue-700',
  Completed: 'bg-purple-100 text-purple-700',
  Archived:  'bg-gray-100 text-gray-600',
};

const approvalStatusStyle = {
  'Pending Approval': 'bg-amber-100 text-amber-700',
  Approved:           'bg-emerald-100 text-emerald-700',
  Rejected:           'bg-rose-100 text-rose-700',
};

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getMyEvents();
        const normalized = data.map(ev => ({
          ...ev,
          date: ev.eventDate || ev.date || '',
          volunteers: ev.acceptedCount !== undefined ? ev.acceptedCount : (ev.volunteers || 0),
          maxVolunteers: ev.volunteerRequired !== undefined ? ev.volunteerRequired : (ev.maxVolunteers || 30),
          approvalStatus: ev.approvalStatus === 'Pending' ? 'Pending Approval' : ev.approvalStatus
        }));
        setEvents(normalized);
      } catch (err) {
        console.error("Error fetching organizer events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = events.filter((e) => {
    const matchSearch =
      (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.category || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || e.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete event");
    }
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setEditForm({ ...event });
  };

  const closeEdit = () => {
    setEditingEvent(null);
    setEditForm({});
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        title: editForm.title,
        category: editForm.category,
        status: editForm.status,
        eventDate: editForm.date,
        volunteerRequired: parseInt(editForm.maxVolunteers),
        location: editForm.location,
        description: editForm.description || '',
        skills: editForm.skills ? (Array.isArray(editForm.skills) ? editForm.skills.join(', ') : editForm.skills) : '',
        time: editForm.time || '10:00 AM',
        image: editForm.image || ''
      };
      
      await updateEvent(editingEvent.id, updateData);
      
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...editForm } : ev))
      );
      closeEdit();
    } catch (err) {
      console.error("Error updating event:", err);
      alert(err.response?.data?.message || err.message || "Failed to update event");
    }
  };

    return (
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
            <p className="text-gray-500 text-md mt-0.5">{events.length} total events</p>
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
              {['All', 'Draft', 'Upcoming', 'Active', 'Completed', 'Archived'].map((s) => (
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
                  {['Event', 'Category', 'Date', 'Location', 'Volunteers', 'Event Status', 'Approval Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                      Loading events...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      No events found
                    </td>
                  </tr>
                ) : filtered.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">
                      <div className="flex items-center gap-3">
                        <img 
                          src={event.image || `https://picsum.photos/seed/${encodeURIComponent(event.title)}/300/200`} 
                          alt="" 
                          className="w-12 h-8 rounded-lg object-cover bg-gray-50 flex-shrink-0"
                          onError={e => {
                            e.currentTarget.src = 'https://picsum.photos/seed/placeholder/300/200';
                          }}
                        />
                        <span>{event.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{event.category}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{event.date}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[140px] truncate">{event.location}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      <span className="font-medium">{event.volunteers}</span>
                      <span className="text-gray-400">/{event.maxVolunteers}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[event.status] || statusStyle.Upcoming}`}>
                        {event.status || 'Upcoming'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${approvalStatusStyle[event.approvalStatus] || approvalStatusStyle.Approved}`}>
                        {event.approvalStatus || 'Approved'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(event)}
                          className="p-1.5 rounded-lg hover:bg-cyan-50 text-gray-400 hover:text-cyan-600 transition-colors"
                        >
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