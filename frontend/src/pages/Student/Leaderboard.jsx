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