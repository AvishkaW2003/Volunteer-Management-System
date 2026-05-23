import { Trophy, Medal, Star } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Alice Johnson',  hours: 48, points: 960, badge: '🥇' },
  { rank: 2, name: 'Marcus Lee',     hours: 42, points: 840, badge: '🥈' },
  { rank: 3, name: 'Sofia Rahman',   hours: 39, points: 780, badge: '🥉' },
  { rank: 4, name: 'David Kim',      hours: 35, points: 700, badge: '⭐' },
  { rank: 5, name: 'Priya Nair',     hours: 30, points: 600, badge: '⭐' },
  { rank: 6, name: 'You',            hours: 9,  points: 180, badge: '—', highlight: true },
];

const rankColor = {
  1: 'from-amber-400 to-yellow-500',
  2: 'from-gray-300 to-gray-400',
  3: 'from-orange-400 to-amber-500',
};

const Leaderboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <Trophy className="w-8 h-8 text-amber-500" /> Leaderboard
      </h1>
      <p className="text-gray-500 mt-1">Top volunteers ranked by hours and points</p>
    </div>

    {/* Top 3 Podium */}
    <div className="grid grid-cols-3 gap-4">
      {[1, 0, 2].map(idx => {
        const v = MOCK_LEADERBOARD[idx];
        const heights = ['h-28', 'h-36', 'h-24'];
        const gradients = [rankColor[2], rankColor[1], rankColor[3]];
        return (
          <div key={v.rank} className="flex flex-col items-center gap-2">
            <div className="text-2xl">{v.badge}</div>
            <p className="text-sm font-semibold text-gray-700 text-center">{v.name}</p>
            <p className="text-xs text-gray-400">{v.hours} hrs</p>
            <div className={`w-full rounded-t-2xl bg-gradient-to-b ${gradients[idx]} ${heights[idx]} flex items-end justify-center pb-3`}>
              <span className="text-white font-bold text-lg">#{v.rank}</span>
            </div>
          </div>
        );
      })}
    </div>

    {/* Full Table */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Rank', 'Volunteer', 'Hours', 'Points', 'Badge'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_LEADERBOARD.map(v => (
            <tr
              key={v.rank}
              className={`transition-colors ${v.highlight ? 'bg-purple-50 font-semibold' : 'hover:bg-gray-50'}`}
            >
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold
                  ${v.rank === 1 ? 'bg-amber-100 text-amber-700' : v.rank === 2 ? 'bg-gray-100 text-gray-700' : v.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
                  {v.rank}
                </span>
              </td>
              <td className="px-5 py-3.5 text-gray-800">{v.name}</td>
              <td className="px-5 py-3.5 text-gray-600">{v.hours} hrs</td>
              <td className="px-5 py-3.5 text-gray-600">{v.points}</td>
              <td className="px-5 py-3.5 text-lg">{v.badge}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Leaderboard;
