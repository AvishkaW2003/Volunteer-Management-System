import React from 'react';
import { 
  Search, Bell, Moon, LayoutDashboard, Compass, 
  FileText, CalendarCheck, Award, Trophy, BellRing, 
  Settings, LogOut, Download, CheckCircle2, Clock, 
  GraduationCap, TreePine, HeartHandshake, ChevronDown, 
  Calendar, MoreVertical, CheckSquare, BarChart3
} from 'lucide-react';

const Attendance = () => {
  return (
    <div className="relative flex h-screen font-sans text-gray-800 bg-gray-50">
      
      {/* SIDEBAR */}
      <aside className="flex flex-col justify-between w-64 bg-white border-r border-gray-200 shrink-0">
        <div>
          <div className="flex flex-col justify-center h-20 px-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-blue-600">VolunteerHub</h1>
            <p className="mt-1 text-xs tracking-widest text-gray-500 uppercase">Student Portal</p>
          </div>
          <nav className="p-4 space-y-1">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem icon={<Compass size={20} />} label="Browse Events" />
            <NavItem icon={<FileText size={20} />} label="My Applications" />
            <NavItem icon={<CalendarCheck size={20} />} label="Attendance" active />
            <NavItem icon={<Award size={20} />} label="Certificates" />
            <NavItem icon={<Trophy size={20} />} label="Leaderboard" />
            <NavItem icon={<BellRing size={20} />} label="Notifications" />
          </nav>
        </div>
        <div className="p-4 space-y-1 border-t border-gray-100">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <NavItem icon={<LogOut size={20} className="text-red-500" />} label="Logout" textClass="text-red-500" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex flex-col flex-1 overflow-hidden">
        
        {/* HEADER */}
        <header className="flex items-center justify-between h-20 px-8 bg-white border-b border-gray-200 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search attendance records..." 
              className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell className="text-gray-500 cursor-pointer hover:text-gray-800" size={20} />
            <Moon className="text-gray-500 cursor-pointer hover:text-gray-800" size={20} />
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="w-8 h-8 overflow-hidden bg-gray-300 border border-gray-200 rounded-full shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Irosha" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* Page Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="mb-1 text-2xl font-bold text-gray-800">Attendance Overview</h2>
              <p className="text-sm text-gray-500">Track your participation across all volunteer initiatives.</p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center gap-2">
              <Download size={18} />
              Export Record
            </button>
          </div>

          {/* Top Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            
            {/* Overall Attendance */}
            <div className="flex flex-col justify-between p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">Overall Attendance</span>
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><CheckCircle2 size={18} /></div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <h3 className="text-4xl font-bold text-gray-800">94%</h3>
                  <span className="text-sm font-medium text-green-500">↑ 2%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <p className="text-xs text-gray-500">42 of 45 events attended this semester</p>
              </div>
            </div>

            {/* Volunteer Hours */}
            <div className="flex flex-col justify-between p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">Volunteer Hours</span>
                <div className="p-1.5 bg-gray-50 text-gray-500 rounded-md"><Clock size={18} /></div>
              </div>
              <div>
                <div className="flex items-baseline gap-1 mb-4">
                  <h3 className="text-4xl font-bold text-gray-800">128.5</h3>
                  <span className="text-sm font-medium text-gray-500">hours</span>
                </div>
                {/* Mini Bar Chart */}
                <div className="flex items-end w-full h-8 gap-1 mb-3 opacity-80">
                  <div className="bg-blue-200 w-full rounded-t-sm h-[40%]"></div>
                  <div className="bg-blue-300 w-full rounded-t-sm h-[60%]"></div>
                  <div className="bg-blue-400 w-full rounded-t-sm h-[85%]"></div>
                  <div className="bg-blue-600 w-full rounded-t-sm h-[100%]"></div>
                  <div className="bg-blue-400 w-full rounded-t-sm h-[70%]"></div>
                  <div className="bg-blue-200 w-full rounded-t-sm h-[30%]"></div>
                </div>
                <p className="text-xs text-gray-500">Top 5% of student volunteers</p>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="flex flex-col justify-between p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <span className="block mb-4 text-sm font-semibold text-gray-600">Focus Areas</span>
              <div className="flex-1 space-y-3">
                <FocusAreaRow color="bg-blue-600" label="Tutoring" percentage="45%" />
                <FocusAreaRow color="bg-blue-500" label="Environment" percentage="30%" />
                <FocusAreaRow color="bg-gray-500" label="Community" percentage="25%" />
              </div>
              {/* Segmented Progress Bar */}
              <div className="flex w-full h-2 mt-4 overflow-hidden rounded-full">
                <div className="h-full bg-blue-600" style={{ width: '45%' }}></div>
                <div className="h-full bg-blue-500" style={{ width: '30%' }}></div>
                <div className="h-full bg-gray-500" style={{ width: '25%' }}></div>
              </div>
            </div>

          </div>

          {/* Middle Layout */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            
            {/* Timeline Section */}
            <div className="col-span-2 p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity Timeline</h3>
                <div className="flex p-1 bg-gray-100 rounded-lg">
                  <button className="px-4 py-1 text-xs font-medium bg-white rounded-md shadow-sm">Week</button>
                  <button className="px-4 py-1 text-xs font-medium text-gray-500 rounded-md hover:text-gray-700">Month</button>
                </div>
              </div>
              
              <div className="relative pt-2 ml-4 space-y-6 border-l-2 border-gray-100">
                <TimelineCard 
                  date="Today, 2:30 PM"
                  icon={<GraduationCap size={20} className="text-blue-600" />}
                  title="Math Peer Tutoring"
                  location="Central Library • Room 402"
                  status="PRESENT"
                  statusColor="text-green-600 bg-green-50"
                  dotColor="bg-blue-600"
                />
                <TimelineCard 
                  date="Oct 24, 10:00 AM"
                  icon={<TreePine size={20} className="text-blue-600" />}
                  title="Campus Green Clean-up"
                  location="North Quad Gardens"
                  status="PRESENT"
                  statusColor="text-green-600 bg-green-50"
                  dotColor="bg-blue-200"
                />
                <TimelineCard 
                  date="Oct 22, 4:00 PM"
                  icon={<HeartHandshake size={20} className="text-red-500" />}
                  title="Food Drive Organization"
                  location="Student Union Hub"
                  status="ABSENT"
                  statusColor="text-red-600 bg-red-50"
                  dotColor="bg-red-500"
                />
              </div>
            </div>

            {/* Right Column Cards */}
            <div className="space-y-6">
              
              {/* Keep it up Card */}
              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden h-[200px] flex flex-col justify-between">
                <div className="relative z-10">
                  <h3 className="mb-2 text-lg font-bold">Keep it up!</h3>
                  <p className="mb-4 text-sm leading-relaxed text-blue-100">
                    You're only 12 hours away from achieving the Gold Volunteer Badge this semester.
                  </p>
                  <button className="inline-block px-4 py-2 text-sm font-medium text-blue-600 transition bg-white rounded-lg hover:bg-blue-50">
                    View Rewards
                  </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute w-32 h-32 bg-blue-500 rounded-full opacity-50 -bottom-8 -right-8"></div>
                <div className="absolute w-32 h-32 bg-blue-400 rounded-full -bottom-12 -right-2 opacity-30"></div>
              </div>

              {/* Statistics Card */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
                <h3 className="mb-5 font-semibold text-gray-800">Statistics</h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-xs text-gray-500">Avg. Sessions/Month</p>
                      <p className="text-xl font-bold text-gray-800">12.4</p>
                    </div>
                    <div className="p-2 text-blue-600 rounded-lg bg-blue-50"><BarChart3 size={20}/></div>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-xs text-gray-500">Punctuality Score</p>
                      <p className="text-xl font-bold text-gray-800">98.2%</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold text-green-600 rounded-md bg-green-50">Excellent</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-xs text-gray-500">Total Credits Earned</p>
                      <p className="text-xl font-bold text-gray-800">15.0</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold text-blue-600 rounded-md bg-blue-50">Academic</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Detailed Logs Table */}
          <div className="p-6 mb-12 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Detailed Logs</h3>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  All Events <ChevronDown size={14} />
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Last 30 Days <Calendar size={14} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-xs font-semibold text-gray-500">Event Name</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500">Date</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500">Duration</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500">Category</th>
                    <th className="pb-3 text-xs font-semibold text-gray-500">Status</th>
                    <th className="pb-3 pr-4 text-xs font-semibold text-right text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <TableRow 
                    name="Senior Home Visit" 
                    date="Oct 20, 2023" 
                    duration="4.5 hrs" 
                    category="Community" 
                    status="Verified" 
                  />
                  <TableRow 
                    name="Coastal Cleanup Drive" 
                    date="Oct 18, 2023" 
                    duration="6.0 hrs" 
                    category="Environment" 
                    status="Verified" 
                  />
                  <TableRow 
                    name="SAT Prep Workshop" 
                    date="Oct 15, 2023" 
                    duration="3.0 hrs" 
                    category="Tutoring" 
                    status="Processing" 
                  />
                  <TableRow 
                    name="Career Fair Setup" 
                    date="Oct 12, 2023" 
                    duration="5.5 hrs" 
                    category="Community" 
                    status="Verified" 
                  />
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
              <p>Showing 1-10 of 42 records</p>
              <div className="flex gap-1">
                <button className="flex items-center justify-center w-8 h-8 border border-transparent rounded hover:bg-gray-50 hover:border-gray-200">&lt;</button>
                <button className="flex items-center justify-center w-8 h-8 font-medium text-blue-600 border border-blue-100 rounded bg-blue-50">1</button>
                <button className="flex items-center justify-center w-8 h-8 border border-transparent rounded hover:bg-gray-50 hover:border-gray-200">2</button>
                <button className="flex items-center justify-center w-8 h-8 border border-transparent rounded hover:bg-gray-50 hover:border-gray-200">3</button>
                <button className="flex items-center justify-center w-8 h-8 border border-transparent rounded hover:bg-gray-50 hover:border-gray-200">...</button>
                <button className="flex items-center justify-center w-8 h-8 border border-transparent rounded hover:bg-gray-50 hover:border-gray-200">&gt;</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Floating Action Button */}
      <button className="absolute flex items-center gap-2 px-5 py-3 font-medium text-white transition bg-blue-600 shadow-lg bottom-8 right-8 rounded-xl hover:bg-blue-700">
        <CheckSquare size={20} />
        Log Attendance
      </button>

    </div>
  );
};

// --- Subcomponents ---

const NavItem = ({ icon, label, active, textClass = "text-gray-600" }) => (
  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' : `hover:bg-gray-50 ${textClass}`}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const FocusAreaRow = ({ color, label, percentage }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">{percentage}</span>
  </div>
);

const TimelineCard = ({ date, icon, title, location, status, statusColor, dotColor }) => (
  <div className="relative pl-8">
    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${dotColor}`}></div>
    <p className="mb-2 text-xs font-medium text-gray-400">{date}</p>
    <div className="flex items-center justify-between p-4 transition bg-white border border-gray-100 rounded-xl hover:border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{location}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider ${statusColor}`}>
        {status}
      </span>
    </div>
  </div>
);

const TableRow = ({ name, date, duration, category, status }) => (
  <tr className="transition border-b border-gray-50 hover:bg-gray-50/50">
    <td className="py-4 font-medium text-gray-800">{name}</td>
    <td className="py-4 text-gray-500">
      {date.split(',')[0]}<br/>
      <span className="text-xs">{date.split(',')[1]}</span>
    </td>
    <td className="py-4 text-gray-500">{duration}</td>
    <td className="py-4">
      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
        {category}
      </span>
    </td>
    <td className="py-4">
      {status === 'Verified' ? (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
          <CheckCircle2 size={14} /> Verified
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
          <Clock size={14} /> Processing
        </span>
      )}
    </td>
    <td className="py-4 pr-4 text-right">
      <button className="text-gray-400 transition hover:text-gray-800">
        <MoreVertical size={18} />
      </button>
    </td>
  </tr>
);

export default Attendance;