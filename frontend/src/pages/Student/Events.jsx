import { Search, Calendar, MapPin, Users, ChevronDown, ImageOff, User } from 'lucide-react';
import { useState } from 'react';

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Beach Cleanup Drive',
    organizer: 'Eco Club',
    date: '2026-06-10',
    time: '08:00 AM',
    location: 'Santa Monica Beach',
    slots: 12,
    category: 'Environment',
    skills: ['Teamwork', 'Physical'],
    image: 'https://picsum.photos/seed/beach101/600/260',
  },
  {
    id: 2,
    title: 'Food Bank Volunteering',
    organizer: 'Care Club',
    date: '2026-06-15',
    time: '09:00 AM',
    location: 'Downtown Community Center',
    slots: 8,
    category: 'Community',
    skills: ['Organisation', 'Communication'],
    // image: 'https://picsum.photos/seed/food202/600/260',
  },
  {
    id: 3,
    title: 'Youth Tutoring Program',
    organizer: 'Education First',
    date: '2026-06-20',
    time: '10:00 AM',
    location: 'City Library',
    slots: 5,
    category: 'Education',
    skills: ['Teaching', 'Patience'],
    image: 'https://picsum.photos/seed/tutor303/600/260',
  },
  {
    id: 4,
    title: 'Tree Planting Marathon',
    organizer: 'Green Team',
    date: '2026-06-22',
    time: '07:30 AM',
    location: 'Central Park',
    slots: 20,
    category: 'Environment',
    skills: ['Physical', 'Teamwork'],
    image: 'https://picsum.photos/seed/tree404/600/260',
  },
  {
    id: 5,
    title: 'Blood Donation Camp',
    organizer: 'Health Society',
    date: '2026-06-25',
    time: '09:00 AM',
    location: 'Main Hall, Block A',
    slots: 30,
    category: 'Health',
    skills: ['First Aid', 'Empathy'],
    image: 'https://picsum.photos/seed/health505/600/260',
  },
  {
    id: 6,
    title: 'Food Distribution Drive',
    organizer: 'Care Club',
    date: '2026-06-28',
    time: '10:00 AM',
    location: 'Community Centre',
    slots: 15,
    category: 'Community',
    skills: ['Organisation', 'Driving License'],
    image: 'https://picsum.photos/seed/drive606/600/260',
  },
];

const CATEGORIES = ['All Categories', 'Environment', 'Health', 'Education', 'Community'];
const SKILLS     = ['All Skills', 'Teamwork', 'Physical', 'Organisation', 'Communication', 'Teaching', 'Patience', 'First Aid', 'Empathy', 'Driving License'];

const formatDate = iso => {
  const [y, m, d] = iso.split('-');
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const selectClass =
  'appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 pr-8 text-sm ' +
  'text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer';

const Events = () => {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All Categories');
  const [skill,    setSkill]    = useState('All Skills');

  const filtered = MOCK_EVENTS.filter(ev => {
    const matchSearch   = ev.title.toLowerCase().includes(search.toLowerCase()) ||
                          ev.organizer.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All Categories' || ev.category === category;
    const matchSkill    = skill    === 'All Skills'     || ev.skills.includes(skill);
    return matchSearch && matchCategory && matchSkill;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Browse Events</h1>
        <p className="text-gray-500 mt-1">Discover volunteering opportunities near you</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2.5 bg-white border border-gray-200
          rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-purple-300 transition">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* Category filter */}
        <div className="relative flex-shrink-0">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={selectClass}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Skill filter */}
        <div className="relative flex-shrink-0">
          <select
            value={skill}
            onChange={e => setSkill(e.target.value)}
            className={selectClass}
          >
            {SKILLS.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Event Cards — 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(ev => (
          <div
            key={ev.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
          >
            {/* Event image */}
            {ev.image ? (
              <img
                src={ev.image}
                alt={ev.title}
                className="w-full h-44 object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            {/* Fallback if no image / image fails to load */}
            <div
              className="w-full h-44 bg-gray-100 items-center justify-center flex-col gap-2"
              style={{ display: ev.image ? 'none' : 'flex' }}
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <ImageOff className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400 font-medium">No image uploaded</p>
            </div>

            {/* Card body */}
            <div className="p-4 flex flex-col flex-1 gap-3">

              {/* Title + Organizer */}
              <div>
                <h3 className="text-base font-bold text-gray-800 leading-snug">{ev.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <User className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  <span className="text-xs text-purple-600 font-medium">{ev.organizer}</span>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>{formatDate(ev.date)},&nbsp;{ev.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>{ev.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>{ev.slots} spots left</span>
                </div>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-1.5">
                {ev.skills.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium
                      bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Apply button */}
              <div className="mt-auto pt-1">
                <button className="w-full py-2.5 rounded-xl font-semibold text-sm text-white
                  bg-gradient-to-r from-blue-500 to-purple-600
                  hover:from-blue-600 hover:to-purple-700
                  transition-all shadow-sm hover:shadow-md">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No events found</p>
            <p className="text-gray-300 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
