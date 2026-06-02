import { Clock, Calendar, CheckCircle } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 1, event: 'Beach Cleanup Drive', date: '2026-04-10', hours: 4, points: 80, status: 'Completed' },
  { id: 2, event: 'Food Distribution Drive', date: '2026-03-22', hours: 3, points: 60, status: 'Completed' },
  { id: 3, event: 'Blood Donation Camp', date: '2026-02-14', hours: 2, points: 120, status: 'Completed' },
  { id: 4, event: 'Tree Planting Marathon', date: '2026-01-30', hours: 4, points: 90, status: 'Completed' },
  { id: 5, event: 'Youth Tutoring Program', date: '2025-12-10', hours: 6, points: 100, status: 'Completed' },
  { id: 6, event: 'Tech Workshop for Kids', date: '2025-11-05', hours: 5, points: 70, status: 'Completed' },
];

const totalHours = MOCK_HISTORY.reduce((s, h) => s + h.hours, 0);
const totalPoints = MOCK_HISTORY.reduce((s, h) => s + h.points, 0);
const totalEvents = MOCK_HISTORY.length;

const STATS = [
  { value: totalEvents, suffix: '', label: 'Events Completed' },
  { value: totalHours, suffix: 'h', label: 'Total Hours' },
  { value: totalPoints, suffix: '', label: 'Points Earned' },
];

const History = () => (
  <div className="space-y-6">

    {/* Header */}
    <div>
      <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
        Volunteer History
      </h1>
      <p className="mt-1 text-gray-500">Your completed volunteer activities</p>
    </div>

    {/* ── 3 Summary Cards ─────────────────────────── */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STATS.map(({ value, suffix, label }) => (
        <div key={label}
          className="p-6 shadow-sm bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-purple-200">
          <p className="text-3xl font-extrabold text-white">
            {value}{suffix}
          </p>
          <p className="mt-1 text-sm font-medium text-white/70">{label}</p>
        </div>
      ))}
    </div>

    {/* ── History Table ────────────────────────────── */}
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            {['Event', 'Date', 'Hours', 'Points', 'Status'].map(h => (
              <th key={h} className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-400 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_HISTORY.map(h => (
            <tr key={h.id} className="transition-colors hover:bg-purple-50/30">
              <td className="px-5 py-3.5 font-semibold text-gray-800">{h.event}</td>
              <td className="px-5 py-3.5 text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> {h.date}
                </div>
              </td>
              <td className="px-5 py-3.5 font-semibold text-gray-700">{h.hours} hrs</td>
              <td className="px-5 py-3.5">
                <span className="font-bold text-purple-600">{h.points}</span>
              </td>
              <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                  text-xs font-semibold bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" /> {h.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
);

export default History;
