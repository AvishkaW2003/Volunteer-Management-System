import { Clock, Calendar, CheckCircle } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 1, event: 'Beach Cleanup Drive',    date: '2026-04-10', hours: 4, status: 'Completed' },
  { id: 2, event: 'Food Distribution Drive',date: '2026-03-22', hours: 3, status: 'Completed' },
  { id: 3, event: 'Blood Donation Camp',    date: '2026-02-14', hours: 2, status: 'Completed' },
];

const History = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <Clock className="w-8 h-8 text-purple-500" /> Volunteer History
      </h1>
      <p className="text-gray-500 mt-1">Your completed volunteer activities</p>
    </div>

    {/* Summary Banner */}
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-5 text-white flex items-center gap-5">
      <div className="flex-1">
        <p className="text-blue-100 text-sm font-medium">Total Hours Volunteered</p>
        <p className="text-4xl font-bold mt-1">{MOCK_HISTORY.reduce((s, h) => s + h.hours, 0)}</p>
      </div>
      <Clock className="w-14 h-14 text-white/30" />
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Event', 'Date', 'Hours', 'Status'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_HISTORY.map(h => (
            <tr key={h.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5 font-medium text-gray-800">{h.event}</td>
              <td className="px-5 py-3.5 text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {h.date}
              </td>
              <td className="px-5 py-3.5 text-gray-700 font-semibold">{h.hours} hrs</td>
              <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
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
