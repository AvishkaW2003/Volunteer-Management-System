import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag, AlignLeft, Clock, ChevronLeft } from 'lucide-react';
import { getOrganizerSettings } from '../../services/userService';
import { createEvent } from '../../services/eventService';

const CATEGORIES = ['Community Service', 'Environment', 'Education', 'Health', 'Technology', 'Sports', 'Arts & Culture'];

const PRESET_BANNERS = [
  { title: 'IEEE WIE Day', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
  { title: 'IEEE Path Forward 3.0', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' },
  { title: 'PearlHack 4.0', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800' },
  { title: 'First Aid Training', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800' },
  { title: 'Tree Plantation Drive', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800' },
  { title: 'Blood Donation Camp', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800' },
];

const getFallbackImage = (title, category) => {
  const t = (title || '').toLowerCase();
  if (t.includes('wie') || t.includes('women in engineering')) return PRESET_BANNERS[0].url;
  if (t.includes('path forward')) return PRESET_BANNERS[1].url;
  if (t.includes('pearlhack') || t.includes('hackathon')) return PRESET_BANNERS[2].url;
  if (t.includes('first aid') || t.includes('training') || t.includes('cpr')) return PRESET_BANNERS[3].url;
  if (t.includes('tree') || t.includes('plantation') || t.includes('plant')) return PRESET_BANNERS[4].url;
  if (t.includes('blood') || t.includes('donation')) return PRESET_BANNERS[5].url;

  const cat = (category || '').toLowerCase();
  if (cat.includes('environment')) {
    return 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800';
  }
  if (cat.includes('technology') || cat.includes('education')) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';
  }
  if (cat.includes('health') || cat.includes('healthcare')) {
    return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800';
  }
  return 'https://images.unsplash.com/photo-1559027615-cd44874e90e5?w=800';
};
const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-base font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all bg-gray-50';

const iconInput = (icon, input) => (
  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2 bg-gray-50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
    <span className="text-gray-400 flex-shrink-0">{icon}</span>
    {input}
  </div>
);

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '',
    date: '', time: '', location: '',
    maxVolunteers: '', skills: '', image: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetImage = (url) => {
    setForm(prev => ({ ...prev, image: url }));
  };

  useEffect(() => {
    const fetchDefaultPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        let settingsData;
        if (token && token.startsWith('dummy')) {
          const stored = localStorage.getItem('mock_org_settings');
          if (stored) {
            settingsData = JSON.parse(stored);
          } else {
            settingsData = {
              eventPreferences: { defaultCategory: 'Technology', defaultVolunteerLimit: 40, defaultEventLocation: 'Main Auditorium' }
            };
          }
        } else {
          settingsData = await getOrganizerSettings();
        }

        if (settingsData && settingsData.eventPreferences) {
          const { defaultCategory, defaultVolunteerLimit, defaultEventLocation } = settingsData.eventPreferences;
          setForm(prev => ({
            ...prev,
            category: prev.category || defaultCategory || '',
            maxVolunteers: prev.maxVolunteers || (defaultVolunteerLimit ? String(defaultVolunteerLimit) : ''),
            location: prev.location || defaultEventLocation || ''
          }));
        }
      } catch (err) {
        console.error('Failed to load organizer default preferences for event creation:', err);
      }
    };
    fetchDefaultPreferences();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        title: form.title,
        category: form.category,
        description: form.description,
        eventDate: form.date,
        time: form.time || '10:00 AM',
        location: form.location,
        volunteerRequired: parseInt(form.maxVolunteers) || 0,
        skills: form.skills || '',
        image: form.image || getFallbackImage(form.title, form.category),
        reputationPoints: 100, // standard points
        volunteerHours: 4 // standard hours
      };

      await createEvent(eventData);

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/organizer/events');
      }, 1500);
    } catch (err) {
      console.error("Error creating event:", err);
      alert(err.response?.data?.message || err.message || "Failed to create event");
      setLoading(false);
    }
  };


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

          {/* Event Banner Image */}
          <Field label="Event Banner Image">
            <div className="space-y-4">
              {/* Custom Upload Box */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-1/2 h-36 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-3 text-center bg-gray-50 hover:border-cyan-400 transition-colors relative overflow-hidden group">
                  {form.image ? (
                    <>
                      <img src={form.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                        Change Image
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium">Click to upload custom banner</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <div className="w-full sm:w-1/2 text-left">
                  <p className="text-sm font-semibold text-gray-700">Custom Banner Upload</p>
                  <p className="text-xs text-gray-400 mt-1">Upload a JPG, PNG or WEBP image. High resolution landscape aspect ratios (e.g. 16:9) work best.</p>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                      className="mt-3 text-xs font-bold text-red-500 hover:text-red-600 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>

              {/* Preset Selector Grid */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or Select From Preset Banners</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESET_BANNERS.map((preset) => {
                    const isSelected = form.image === preset.url;
                    return (
                      <button
                        key={preset.title}
                        type="button"
                        onClick={() => selectPresetImage(preset.url)}
                        className={`group relative h-20 rounded-xl overflow-hidden text-left border transition-all ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-100 shadow-sm' : 'border-gray-100 hover:border-cyan-300'
                          }`}
                      >
                        <img src={preset.url} alt={preset.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                        <div className={`absolute inset-0 transition-opacity flex flex-col justify-end p-2 ${isSelected ? 'bg-gradient-to-t from-cyan-900/90 via-cyan-900/50 to-transparent' : 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
                          }`}>
                          <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">{preset.title}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
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
