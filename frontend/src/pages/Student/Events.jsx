import { Search, Calendar, MapPin, Users } from 'lucide-react';
import { useState } from 'react';

const MOCK_EVENTS = [
  { id: 1, title: 'Beach Cleanup Drive',     organizer: 'Eco Club',      date: '2026-06-10', location: 'City Beach',     slots: 20 },
  { id: 2, title: 'Blood Donation Camp',      organizer: 'Health Society', date: '2026-06-15', location: 'Main Hall',      slots: 50 },
  { id: 3, title: 'Tree Planting Marathon',   organizer: 'Green Team',    date: '2026-06-20', location: 'Central Park',   slots: 30 },
  { id: 4, title: 'Food Distribution Drive', organizer: 'Care Club',     date: '2026-06-25', location: 'Community Ctr',  slots: 15 },
];

const Events = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_EVENTS.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.organizer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-8 h-8 text-purple-500" /> Browse Events
        </h1>
        <p className="text-gray-500 mt-1">Find and apply for volunteer opportunities</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search events…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(ev => (
          <div key={ev.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-800 text-lg mb-1">{ev.title}</h3>
            <p className="text-sm text-purple-600 font-medium mb-3">{ev.organizer}</p>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 flex-shrink-0" /> {ev.date}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 flex-shrink-0" /> {ev.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4 flex-shrink-0" /> {ev.slots} slots available
              </div>
            </div>
            <button className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white text-sm font-semibold transition-all">
              Apply Now
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">No events found.</div>
        )}
      </div>
    </div>
  );
};

export default Events;
