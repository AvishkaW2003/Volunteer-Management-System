import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Calendar, X, ImageOff, Star } from 'lucide-react';
import { getMyEvents, updateEvent, deleteEvent } from '../../services/eventService';

const CATEGORIES = ['Community Service', 'Environment', 'Education', 'Health', 'Technology', 'Sports', 'Arts & Culture'];
const STATUSES   = ['pending', 'approved', 'rejected'];

const BACKEND_URL = 'http://localhost:5000';

const resolveImage = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${BACKEND_URL}${image}`;
};

const mapEvent = (ev) => ({
  id: ev.id,
  title: ev.title,
  category: ev.category || '',
  description: ev.description || '',
  date: ev.eventDate,
  time: ev.time || '',
  location: ev.location,
  maxVolunteers: ev.volunteerRequired,
  skills: ev.skills || '',
  reputationPoints: ev.reputationPoints ?? 10,
  status: ev.status,
  image: resolveImage(ev.image),
});

const fieldClass =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 bg-gray-50 ' +
  'outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all';

const statusStyle = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await getMyEvents();
      setEvents(data.map(mapEvent));
    } catch (err) {
      setLoadError('Could not load your events from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || e.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setLoadError(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setEditForm({ ...event });
    setSaveError('');
  };

  const closeEdit = () => {
    setEditingEvent(null);
    setEditForm({});
    setSaveError('');
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      await updateEvent(editingEvent.id, {
        title: editForm.title,
        category: editForm.category,
        description: editForm.description,
        eventDate: editForm.date,
        time: editForm.time,
        location: editForm.location,
        volunteerRequired: editForm.maxVolunteers,
        skills: editForm.skills,
        reputationPoints: editForm.reputationPoints,
        status: editForm.status,
      });
      setEvents((prev) => prev.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...editForm } : ev)));
      closeEdit();
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to update event.');
    } finally {
      setSaving(false);
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
            {['All', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
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

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          {loadError}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Event', 'Category', 'Date', 'Location', 'Max Volunteers', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                    Loading your events…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
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
                  <td className="px-5 py-3.5 text-sm text-gray-600">{event.maxVolunteers}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[event.status] || 'bg-gray-100 text-gray-600'}`}>
                      {event.status}
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

      {/* Edit Event Modal */}
      {editingEvent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeEdit()}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Event Details</h2>
              <button
                onClick={closeEdit}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image preview */}
            {editingEvent.image ? (
              <img src={editingEvent.image} alt={editingEvent.title} className="w-full h-40 object-cover rounded-xl border border-gray-200 mb-4" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-32 gap-2 bg-gray-100 rounded-xl mb-4">
                <ImageOff className="text-gray-400 w-6 h-6" />
                <p className="text-xs font-medium text-gray-400">No image uploaded</p>
              </div>
            )}

            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
                {saveError}
              </div>
            )}

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">Event Title <span className="text-red-400">*</span></label>
                <input name="title" value={editForm.title || ''} onChange={handleEditChange} required className={fieldClass} />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} required rows={3} className={`${fieldClass} resize-none`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">Category <span className="text-red-400">*</span></label>
                  <select name="category" value={editForm.category || ''} onChange={handleEditChange} required className={fieldClass}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">Status</label>
                  <select name="status" value={editForm.status || ''} onChange={handleEditChange} className={`${fieldClass} capitalize`}>
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">Date <span className="text-red-400">*</span></label>
                  <input type="date" name="date" value={editForm.date || ''} onChange={handleEditChange} required className={fieldClass} />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">Time</label>
                  <input type="text" name="time" value={editForm.time || ''} onChange={handleEditChange} placeholder="e.g. 10:00 AM" className={fieldClass} />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">Location <span className="text-red-400">*</span></label>
                <input name="location" value={editForm.location || ''} onChange={handleEditChange} required className={fieldClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">Max Volunteers <span className="text-red-400">*</span></label>
                  <input type="number" name="maxVolunteers" value={editForm.maxVolunteers || ''} onChange={handleEditChange} required min="1" className={fieldClass} />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" /> Reputation Points
                  </label>
                  <input type="number" name="reputationPoints" value={editForm.reputationPoints ?? ''} onChange={handleEditChange} min="0" className={fieldClass} />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">Required Skills</label>
                <input name="skills" value={editForm.skills || ''} onChange={handleEditChange} placeholder="e.g. Leadership, First Aid" className={fieldClass} />
                <p className="text-xs text-gray-400 mt-1">Separate multiple skills with commas</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm
                    bg-gradient-to-r from-cyan-400 to-blue-500
                    hover:from-cyan-500 hover:to-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-5 py-2.5 rounded-xl text-cyan-600 font-semibold text-sm
                    border border-cyan-200 hover:bg-cyan-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
