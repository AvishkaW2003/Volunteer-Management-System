import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Calendar, Users, UserCheck, TrendingUp,
  CheckCircle, XCircle, Clock, Eye, Edit,
  Activity, MapPin, User, ChevronRight, X, Sparkles
} from 'lucide-react';
import { getOrganizerDashboardStats } from '../../services/eventService';
import { approveApplication, rejectApplication } from '../../services/applicationService';
import { bulkMarkAttendance } from '../../services/attendanceService';

const PIE_COLORS = ['#06B6D4', '#0284C7', '#0EA5E9', '#38BDF8'];

const statusStyle = {
  Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200 border-solid border',
  Approved: 'bg-emerald-100 text-emerald-800 border border-emerald-200 border-solid border',
  Completed: 'bg-indigo-100 text-indigo-800 border border-indigo-200 border-solid border',
  Rejected: 'bg-rose-100 text-rose-800 border border-rose-200 border-solid border',
};

const appStatusStyle = {
  Pending: 'bg-yellow-100 text-yellow-700 font-semibold',
  Approved: 'bg-green-100 text-green-700 font-semibold',
  Rejected: 'bg-red-100 text-red-600 font-semibold',
};

const StatusIcon = ({ status }) => {
  if (status === 'Approved') return <CheckCircle className="w-3.5 h-3.5" />;
  if (status === 'Rejected') return <XCircle className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
};

const OrganizerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Lists populated either from database or fall back to mock data
  const [eventsList, setEventsList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [volunteersList, setVolunteersList] = useState([]);
  const [performanceList, setPerformanceList] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getOrganizerDashboardStats();
      setDashboardData(res);
      setEventsList(res.myCreatedEvents || []);
      setApplicationsList(res.recentApplications || []);
      setVolunteersList(res.approvedVolunteers || []);
      setPerformanceList(res.eventPerformanceSummary || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load organizer dashboard data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveApplication = async (appId) => {
    try {
      setActionLoading(true);
      await approveApplication(appId);
      await fetchDashboardData();
    } catch (err) {
      alert("Failed to approve application: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectApplication = async (appId) => {
    try {
      setActionLoading(true);
      await rejectApplication(appId);
      await fetchDashboardData();
    } catch (err) {
      alert("Failed to reject application: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAttendance = async (volunteer) => {
    try {
      setActionLoading(true);
      const newStatus = volunteer.attendanceStatus === "Present" ? "Absent" : "Present";
      await bulkMarkAttendance(volunteer.eventId, [
        { userId: volunteer.studentId, status: newStatus }
      ]);
      await fetchDashboardData();
    } catch (err) {
      alert("Failed to update volunteer attendance: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading organizer dashboard...</p>
      </div>
    );
  }

  const lineChartData = dashboardData?.lineData || [];
  const pieChartData = dashboardData?.pieData || [];

  const stats = [
    { label: 'Active Events', value: dashboardData?.activeEvents || 0, icon: Calendar, color: 'from-cyan-500 to-blue-600' },
    { label: 'Total Applications', value: dashboardData?.totalApplications || 0, icon: Users, color: 'from-blue-400 to-cyan-500' },
    { label: 'Approved Volunteers', value: dashboardData?.approvedVolunteersCount || (Array.isArray(dashboardData?.approvedVolunteers) ? dashboardData.approvedVolunteers.length : 0), icon: UserCheck, color: 'from-cyan-400 to-blue-500' },
    { label: 'Success Rate', value: dashboardData?.successRate || '0%', icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
  ];

  return (
    <div className={`space-y-8 pb-12 relative ${actionLoading ? 'opacity-80 pointer-events-none transition-opacity duration-200' : ''}`}>

      {/* Action Overlay Loader */}
      {actionLoading && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}