import { useState, useEffect } from 'react';
import { 
  BarChart2, Users, CalendarCheck, TrendingUp, Percent, FileText, 
  Download, Clock, Trophy, Target, PieChart as PieIcon, Award
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  PieChart, Pie, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Cell 
} from 'recharts';
import { getReports } from '../../services/adminService';

const CHART_COLORS = ['#14B8A6', '#06B6D4', '#3B82F6', '#6366F1', '#EC4899', '#F59E0B', '#10B981'];

const ReportsAnalytics = () => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReportsData(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load analytical reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!reportsData) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "VOLUNTEERHUB SYSTEM REPORT\n";
    csvContent += `Generated On,${new Date().toLocaleString()}\n\n`;
    
    csvContent += "SUMMARY METRICS\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Users,${reportsData.users}\n`;
    csvContent += `Total Events,${reportsData.events}\n`;
    csvContent += `Approved Events,${reportsData.approvedEvents}\n`;
    csvContent += `Pending Events,${reportsData.pendingEvents}\n`;
    csvContent += `Total Registrations,${reportsData.registrations}\n`;
    csvContent += `Approval Rate,${reportsData.approvalRate}\n`;
    csvContent += `Average Registrations Per Event,${reportsData.averageRegistrations}\n\n`;

    csvContent += "TOP VOLUNTEERS\n";
    csvContent += "Rank,Name,Hours Volunteered,Reputation Points\n";
    reportsData.topVolunteers.forEach((v, index) => {
      csvContent += `${index + 1},"${v.name}",${v.hours},${v.reputation}\n`;
    });
    csvContent += "\n";

    csvContent += "EVENT DISTRIBUTION BY CLUB\n";
    csvContent += "Club Name,Number of Events\n";
    reportsData.eventDistribution.forEach(c => {
      csvContent += `"${c.name}",${c.value}\n`;
    });
    csvContent += "\n";

    csvContent += "STUDENT PARTICIPATION BY FACULTY\n";
    csvContent += "Faculty,Number of Registered Volunteers\n";
    reportsData.participationByFaculty.forEach(f => {
      csvContent += `"${f.name}",${f.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VolunteerHub_Admin_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200">
        {error}
      </div>
    );
  }

  const summaryCards = [
    { label: 'Total Users Registered', value: reportsData?.users ?? 0, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50 border border-teal-100' },
    { label: 'Total Events Proposed', value: reportsData?.events ?? 0, icon: CalendarCheck, color: 'text-cyan-600', bg: 'bg-cyan-50 border border-cyan-100' },
    { label: 'Student Applications', value: reportsData?.registrations ?? 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-100' },
    { label: 'Proposal Approval Rate', value: reportsData?.approvalRate ?? '0%', icon: Percent, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
    { label: 'Avg Registrations/Event', value: reportsData?.averageRegistrations ?? 0, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 border border-indigo-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-8 h-8 text-teal-600" /> Reports & Analytics
          </h1>
          <p className="text-slate-500 mt-1">Real-time charts, club distribution, and participation trends.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all font-medium self-start md:self-auto"
        >
          <Download className="w-5 h-5" />
          <span>Export Full Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md hover:shadow-teal-50 transition-all duration-200">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 shadow-inner`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Platform Growth (Line Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" /> Platform Growth
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Cumulative</span>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportsData?.platformGrowth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', fontFamily: 'Inter, sans-serif' }} />
                <Legend iconType="circle" />
                <Line name="Students Registered" type="monotone" dataKey="students" stroke="#14B8A6" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line name="Organizers (Clubs)" type="monotone" dataKey="organizers" stroke="#6366F1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Volunteer Hours Trend (Area Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" /> Volunteer Hours Trend
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Monthly hours</span>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportsData?.volunteerHoursTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', fontFamily: 'Inter, sans-serif' }} />
                <Area name="Hours Contributed" type="monotone" dataKey="hours" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#hoursGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Student Participation by Faculty (Bar Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" /> Student Participation by Faculty
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Distribution</span>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportsData?.participationByFaculty || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', fontFamily: 'Inter, sans-serif' }} />
                <Bar name="Students Count" dataKey="value" radius={[6, 6, 0, 0]}>
                  {(reportsData?.participationByFaculty || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Event Distribution by Club (Pie Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-teal-600" /> Event Distribution by Club
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Proportion</span>
          </div>
          <div className="h-72 w-full text-xs flex flex-col sm:flex-row items-center justify-center">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportsData?.eventDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(reportsData?.eventDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', fontFamily: 'Inter, sans-serif' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend indicators */}
            <div className="w-full sm:w-1/2 flex flex-col gap-2 mt-4 sm:mt-0 font-sans">
              {(reportsData?.eventDistribution || []).map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
                    <span className="truncate max-w-[120px]" title={entry.name}>{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{entry.value} Events</span>
                </div>
              ))}
              {(reportsData?.eventDistribution || []).length === 0 && (
                <p className="text-slate-400 text-xs italic">No clubs recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column details: Top Volunteers & Popular Event Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Volunteers */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4 lg:col-span-2">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Top Volunteer Students
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-teal-50/20 text-slate-500 font-semibold text-xs border-b border-slate-100">
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 text-center">Estimated Hours</th>
                  <th className="px-4 py-3 text-right">Reputation Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(reportsData?.topVolunteers || []).slice(0, 5).map((vol, index) => (
                  <tr key={vol.name} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        index === 0 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        index === 1 ? 'bg-slate-100 text-slate-800 border border-slate-300' :
                        index === 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                        'bg-slate-50 text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{vol.name}</td>
                    <td className="px-4 py-3.5 text-center font-medium text-slate-500">{vol.hours} hrs</td>
                    <td className="px-4 py-3.5 text-right font-black text-teal-600 flex items-center justify-end gap-1">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span>{vol.reputation} RP</span>
                    </td>
                  </tr>
                ))}
                {(reportsData?.topVolunteers || []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400 italic">No volunteers recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Event Types */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" /> Popular Event Themes
          </h3>
          <div className="space-y-4">
            {(reportsData?.popularEventTypes || []).map((theme) => {
              const percentages = reportsData?.events > 0 ? Math.round((theme.count / reportsData.events) * 100) : 25;
              return (
                <div key={theme.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{theme.type}</span>
                    <span className="text-slate-400">{theme.count} events ({percentages}%)</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentages}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {(reportsData?.popularEventTypes || []).length === 0 && (
              <p className="text-slate-400 text-xs italic text-center py-8">No events proposed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
