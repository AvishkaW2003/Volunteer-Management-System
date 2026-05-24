import { Search, Calendar, MapPin, Users, User, Tag, Clock } from 'lucide-react';
import { useState } from 'react';

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Beach Cleanup Drive',
    organizer: 'Eco Club',
    date: '2026-06-10',
    time: '08:00 AM',
    location: 'City Beach',
    slots: 20,
    skills: ['Environmental Awareness', 'Physical Fitness', 'Teamwork'],
  },
  {
    id: 2,
    title: 'Blood Donation Camp',
    organizer: 'Health Society',
    date: '2026-06-15',
    time: '09:00 AM',
    location: 'Main Hall',
    slots: 50,
    skills: ['First Aid', 'Communication', 'Empathy'],
  },
  {
    id: 3,
    title: 'Tree Planting Marathon',
    organizer: 'Green Team',
    date: '2026-06-20',
    time: '07:30 AM',
    location: 'Central Park',
    slots: 30,
    skills: ['Gardening', 'Physical Fitness', 'Environmental Awareness'],
  },
  {
    id: 4,
    title: 'Food Distribution Drive',
    organizer: 'Care Club',
    date: '2026-06-25',
    time: '10:00 AM',
    location: 'Community Centre',
    slots: 15,
    skills: ['Organisation', 'Communication', 'Driving License'],
  },
];

const formatDate = iso => {
  const [y, m, d] = iso.split('-');
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const Events = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_EVENTS.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.organizer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          Browse Events
        </h1>
        <p className="text-gray-500 mt-1">Find and apply for volunteer opportunities</p>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by event name or organizer…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Results count */}
      {filtered.length > 0 && (
        <p className="text-sm text-gray-400 -mt-2">
          Showing <span className="font-semibold text-gray-600">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(ev => (
          <div
            key={ev.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
              hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Gradient accent strip */}
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-purple-500" />

            <div className="p-5 flex flex-col flex-1 gap-4">
              {/* Title + Organizer */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 leading-snug">{ev.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span className="text-sm text-purple-600 font-medium">{ev.organizer}</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Date</p>
                    <p className="font-medium text-gray-700">{formatDate(ev.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Time</p>
                    <p className="font-medium text-gray-700">{ev.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Location</p>
                    <p className="font-medium text-gray-700">{ev.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Users className="w-3.5 h-3.5 text-green-500" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Volunteers Needed</p>
                    <p className="font-medium text-gray-700">{ev.slots} volunteers</p>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Required Skills</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ev.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium
                        bg-purple-50 text-purple-700 border border-purple-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply button — pushed to bottom */}
              <div className="mt-auto pt-1">
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500
                  hover:from-blue-500 hover:to-purple-600 text-white text-sm font-semibold
                  transition-all shadow-sm hover:shadow-md">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No events found</p>
            <p className="text-gray-300 text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
