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