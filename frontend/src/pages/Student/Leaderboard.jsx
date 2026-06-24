import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Medal, Award } from 'lucide-react';
import axios from 'axios';
const initials = name => {
  if (!name) return 'V';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return 'V';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
};
const RankIcon = ({ rank }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-orange-400" />;
  return (
    <span className="inline-flex items-center justify-center text-sm font-semibold text-gray-500 bg-gray-100 rounded-full w-7 h-7">
      {rank}
    </span>
  );
};
const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get('http://localhost:5000/api/leaderboard', { headers });
        const mapped = response.data.map((item, idx) => ({
          rank: idx + 1,
          name: item.name || 'Volunteer',
          score: item.reputationPoints || 0,
          events: item.totalCertificates || 0,
          hours: item.totalHours || 0
        }));
        setLeaderboardList(mapped);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboardData();
  }, [user]);