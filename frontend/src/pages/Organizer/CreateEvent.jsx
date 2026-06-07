import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag, AlignLeft, Clock, ChevronLeft } from 'lucide-react';

const CATEGORIES = ['Community Service', 'Environment', 'Education', 'Health', 'Technology', 'Sports', 'Arts & Culture'];

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-base font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '',
    date: '', time: '', location: '',
    maxVolunteers: '', skills: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate('/organizer/events');
    }, 1500);
  };

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all bg-gray-50';

  const iconInput = (icon, input) => (
    <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2 bg-gray-50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      {input}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/organizer/dashboard')}
          className="p-2 rounded-xl hover:bg-purple-50 text-gray-500 hover:text-cyan-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create New Event</h1>
          <p className="text-gray-500 text-base mt-0.5">Fill in the details to publish a volunteer event</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          Event created successfully! Redirecting…
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Event Title" required>
              {iconInput(
                <Tag className="w-4 h-4" />,
                <input
                  name="title" value={form.title} onChange={handleChange} required
                  placeholder="Beach Cleanup Drive"
                  className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent w-full"
                />
              )}
            </Field>

            <Field label="Category" required>
              <select
                name="category" value={form.category} onChange={handleChange} required
                className={inputClass}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Description */}
          <Field label="Description" required>
            <div className="flex items-start border border-gray-200 rounded-xl px-3 py-2.5 gap-2 bg-gray-50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
              <AlignLeft className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <textarea
                name="description" value={form.description} onChange={handleChange} required
                rows={3} placeholder="Describe what volunteers will be doing…"
                className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent w-full resize-none"
              />
            </div>
          </Field>

          {/* Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Date" required>
              {iconInput(
                <Calendar className="w-4 h-4" />,
                <input
                  type="date" name="date" value={form.date} onChange={handleChange} required
                  className="flex-1 outline-none text-base text-gray-700 bg-transparent w-full"
                />
              )}
            </Field>

            <Field label="Time" required>
              {iconInput(
                <Clock className="w-4 h-4" />,
                <input
                  type="time" name="time" value={form.time} onChange={handleChange} required
                  className="flex-1 outline-none text-base text-gray-700 bg-transparent w-full"
                />
              )}
            </Field>
          </div>

          {/* Location + Max Volunteers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Location" required>
              {iconInput(
                <MapPin className="w-4 h-4" />,
                <input
                  name="location" value={form.location} onChange={handleChange} required
                  placeholder="Colombo, Sri Lanka"
                  className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent w-full"
                />
              )}
            </Field>

            <Field label="Max Volunteers" required>
              {iconInput(
                <Users className="w-4 h-4" />,
                <input
                  type="number" name="maxVolunteers" value={form.maxVolunteers} onChange={handleChange} required min="1"
                  placeholder="30"
                  className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent w-full"
                />
              )}
            </Field>
          </div>

          {/* Skills */}
          <Field label="Required Skills">
            <input
              name="skills" value={form.skills} onChange={handleChange}
              placeholder="e.g. Leadership, First Aid, Communication"
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">Separate multiple skills with commas</p>
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm
                bg-gradient-to-r from-cyan-400 to-blue-500
                hover:from-cyan-500 hover:to-blue-600
                transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing…' : 'Publish Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/organizer/events')}
              className="px-6 py-3 rounded-xl text-cyan-600 font-semibold text-sm
                border border-cyan-200 hover:bg-cyan-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
