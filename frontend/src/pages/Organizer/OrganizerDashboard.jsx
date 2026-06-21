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
  Pending:   'bg-yellow-100 text-yellow-800 border border-yellow-200 border-solid border',
  Approved:  'bg-emerald-100 text-emerald-800 border border-emerald-200 border-solid border',
  Completed: 'bg-indigo-100 text-indigo-800 border border-indigo-200 border-solid border',
  Rejected:  'bg-rose-100 text-rose-800 border border-rose-200 border-solid border',
};

const appStatusStyle = {
  Pending:  'bg-yellow-100 text-yellow-700 font-semibold',
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
