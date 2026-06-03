import { Trophy, Medal, Award } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Alice Johnson', score: 98, events: 24, hours: 156 },
  { rank: 2, name: 'Dave Brown', score: 95, events: 22, hours: 142 },
  { rank: 3, name: 'Carol Lee', score: 92, events: 20, hours: 130 },
  { rank: 4, name: 'John Student', score: 85, events: 12, hours: 96 },
  { rank: 5, name: 'Eve Wilson', score: 78, events: 10, hours: 72 },
  { rank: 6, name: 'Frank Garcia', score: 72, events: 8, hours: 60 },
  { rank: 7, name: 'Grace Kim', score: 68, events: 7, hours: 52 },
  { rank: 8, name: 'Henry Liu', score: 65, events: 6, hours: 44 },
];

const initials = name =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const RankIcon = ({ rank }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-orange-400" />;
  return (
    <span className="w-7 h-7 inline-flex items-center justify-center rounded-full
      bg-gray-100 text-gray-500 text-sm font-semibold">
      {rank}
    </span>
  );
};

const top3 = MOCK_LEADERBOARD.slice(0, 3);

const Leaderboard = () => (
  <div className="space-y-6">

    {/* Header */}
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        Leaderboard
      </h1>
      <p className="text-gray-500 mt-1">Top volunteers by reputation score</p>
    </div>

    {/* ── Top 3 Cards ─────────────────────────────── */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {top3.map(v => {
        const isFirst = v.rank === 1;
        return (
          <div
            key={v.rank}
            className={`rounded-2xl p-5 flex flex-col items-center gap-3 text-center
              ${isFirst
                ? 'bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg shadow-purple-200'
                : 'bg-white border border-gray-100 shadow-sm'}`}
          >
            {/* Rank icon — top-left */}
            <div className="self-start">
              {v.rank === 1 && <Trophy className="w-7 h-7 text-amber-300" />}
              {v.rank === 2 && <Medal className="w-7 h-7 text-gray-400" />}
              {v.rank === 3 && <Award className="w-7 h-7 text-orange-400" />}
            </div>

            {/* Avatar */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold
                ${isFirst ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}
            >
              {initials(v.name)}
            </div>

            {/* Name */}
            <p className={`font-bold text-base leading-tight ${isFirst ? 'text-white' : 'text-gray-800'}`}>
              {v.name}
            </p>

            {/* Score */}
            <p className={`text-4xl font-extrabold ${isFirst ? 'text-white' : 'text-gray-800'}`}>
              {v.score}
            </p>

            {/* Sub-stats */}
            <p className={`text-sm ${isFirst ? 'text-white/70' : 'text-gray-400'}`}>
              {v.events} events · {v.hours} hrs
            </p>
          </div>
        );
      })}
    </div>

    {/* ── Full Table ──────────────────────────────── */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Rank', 'Volunteer', 'Score', 'Events', 'Hours'].map(h => (
              <th
                key={h}
                className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_LEADERBOARD.map(v => (
            <tr key={v.rank} className="hover:bg-purple-50/40 transition-colors">

              {/* Rank */}
              <td className="px-5 py-4">
                <RankIcon rank={v.rank} />
              </td>

              {/* Volunteer */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600
                    flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {initials(v.name)}
                  </div>
                  <span className="font-medium text-gray-800">{v.name}</span>
                </div>
              </td>

              {/* Score */}
              <td className="px-5 py-4">
                <span className="font-bold text-purple-600 text-base">{v.score}</span>
              </td>

              {/* Events */}
              <td className="px-5 py-4 text-gray-500">{v.events}</td>

              {/* Hours */}
              <td className="px-5 py-4 text-gray-500">{v.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
);

export default Leaderboard;
