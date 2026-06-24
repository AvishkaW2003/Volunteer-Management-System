import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle } from 'lucide-react';
import { getMyAttendance } from '../../services/attendanceService';

const History = () => {
  const { user } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        // API call here
      } catch (err) {
        console.error("Error loading volunteer history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);