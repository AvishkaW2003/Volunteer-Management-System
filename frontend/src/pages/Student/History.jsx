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
  const data = await getMyAttendance();
        const presentRecords = data.filter(rec => rec.status === 'Present');
        const normalized = presentRecords.map(rec => ({
          id: rec.id,
          event: rec.event?.title || 'Unknown Event',
          organizer: rec.event?.User?.name || 'Organizer',
          completedOn: new Date(rec.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          hours: rec.event?.volunteerHours || 4,
          reputationPoints: rec.event?.reputationPoints || 10,
          status: 'Issued'
        }));
        setHistoryList(normalized);