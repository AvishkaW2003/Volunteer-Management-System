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