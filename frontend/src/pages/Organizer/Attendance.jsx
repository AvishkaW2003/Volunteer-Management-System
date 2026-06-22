import { useState, useEffect } from 'react';
import { CheckSquare, Users, CheckCircle } from 'lucide-react';
import { getMyEvents } from '../../services/eventService';
import { getAttendeesForEvent, bulkMarkAttendance } from '../../services/attendanceService';

const Attendance = () => {
  const [eventsList, setEventsList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Load active/approved events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getMyEvents();
        const approved = eventsData.filter(e => e.approvalStatus === 'Approved');
        setEventsList(approved);
        if (approved.length > 0) {
          setSelectedEvent(approved[0].id);
        }
      } catch (err) {
        console.error("Error loading events for attendance:", err);
      }
    };
    fetchEvents();
  }, []);

  // 2. Load approved volunteers for selected event
  useEffect(() => {
    if (!selectedEvent) return;
    
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const data = await getAttendeesForEvent(selectedEvent);
        setVolunteers(data);
        
        const attendeeRecords = {};
        data.forEach(v => {
          attendeeRecords[v.userId] = v.status === 'Present';
        });
        setAttendance(attendeeRecords);
      } catch (err) {
        console.error("Error loading event attendees:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendees();
  }, [selectedEvent]);

  const presentCount = volunteers.filter((v) => attendance[v.userId]).length;

  const toggle = (userId) => {
    setAttendance((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const markAll = (value) => {
    const updates = {};
    volunteers.forEach((v) => { updates[v.userId] = value; });
    setAttendance((prev) => ({ ...prev, ...updates }));
  };

  const handleSaveAttendance = async () => {
    try {
      const records = volunteers.map(v => ({
        userId: v.userId,
        status: attendance[v.userId] ? 'Present' : 'Absent'
      }));
      await bulkMarkAttendance(selectedEvent, records);
      setToastMessage('Attendance saved successfully!');
      setTimeout(() => setToastMessage(''), 2500);
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert(err.response?.data?.message || err.message || "Failed to save attendance");
    }
  };

  return (
    <div>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
        <p className="text-gray-500 text-md mt-0.5">Mark volunteer attendance for each event</p>
      </div>

     {/* Event selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <label className="block text-md font-semibold text-gray-700 mb-2">Select Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full sm:w-80 border border-gray-200 rounded-xl px-3 py-2.5 text-md
            text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100
            transition-all bg-gray-50"
        >
          {eventsList.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      {/* Stats + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-xl text-sm font-semibold">
            <Users className="w-4 h-4" />
            {presentCount} / {volunteers.length} Present
          </div>
          {volunteers.length > 0 && (
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${(presentCount / volunteers.length) * 100}%` }}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => markAll(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-green-50 text-green-600
              hover:bg-green-100 transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => markAll(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600
              hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>