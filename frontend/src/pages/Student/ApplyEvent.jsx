import React from 'react';
import { 
  Search, Bell, Moon, LayoutDashboard, Compass, 
  FileText, CalendarCheck, Award, Trophy, BellRing, 
  Settings, LogOut, Plus, Calendar, MapPin, 
  MoreVertical, CheckCircle2, Clock, Download 
} from 'lucide-react';

const MyApplications = () => {
  return (
    <div className="flex h-screen font-sans text-gray-800 bg-gray-50">
      
      {/* SIDEBAR */}
      <aside className="flex flex-col justify-between w-64 bg-white border-r border-gray-200 shrink-0">
        <div>
          <div className="flex flex-col justify-center h-20 px-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-blue-600">VolunteerHub</h1>
            <p className="text-xs text-gray-500">Student Portal</p>
          </div>
          <nav className="p-4 space-y-1">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem icon={<Compass size={20} />} label="Browse Events" />
            <NavItem icon={<FileText size={20} />} label="My Applications" active />
            <NavItem icon={<CalendarCheck size={20} />} label="Attendance" />
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
              placeholder="Search my applications..." 
              className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="text-gray-500 cursor-pointer hover:text-gray-800" size={20} />
              <span className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1"></span>
            </div>
            <Moon className="text-gray-500 cursor-pointer hover:text-gray-800" size={20} />
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="w-8 h-8 overflow-hidden bg-gray-300 rounded-full shadow-sm">
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
              <h2 className="mb-1 text-2xl font-bold text-gray-800">Application Tracking</h2>
              <p className="text-sm text-gray-500">Monitor your status for upcoming community and academic events.</p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center gap-2">
              <Plus size={18} />
              Apply for New Event
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard title="TOTAL APPLIED" value="12" />
            <StatCard title="PENDING APPROVAL" value="3" valueColor="text-blue-600" />
            <StatCard title="APPROVED EVENTS" value="8" />
            <StatCard title="COMPLETED HOURS" value="45.5" />
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            
            {/* Card 1: Pending (Urban Sustainability Workshop) */}
            <ApplicationCard>
              <div className="flex-1 pr-8">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1592424001806-53805eb3a1f9?w=100&q=80" alt="Thumbnail" className="object-cover w-12 h-12 rounded-lg" />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">Urban Sustainability Workshop</h3>
                        <Badge text="Pending" colorClass="bg-blue-50 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> Oct 24, 2023</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> Main Campus Library</span>
                      </div>
                    </div>
                  </div>
                  <MoreVertical size={20} className="text-gray-400 cursor-pointer" />
                </div>

                {/* Progress Tracker */}
                <div className="mt-8 mb-2">
                  <div className="flex justify-between mb-2 text-xs font-medium text-gray-500">
                    <span>Approval Progress</span>
                    <span className="text-blue-600">65%</span>
                  </div>
                  <div className="relative">
                    <div className="absolute top-1.5 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                    <div className="absolute top-1.5 left-0 w-[65%] h-1 bg-blue-600 rounded-full"></div>
                    <div className="relative flex justify-between">
                      <ProgressStep label="Applied" active />
                      <ProgressStep label="Review" active />
                      <ProgressStep label="Interview" active current />
                      <ProgressStep label="Decision" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-between pl-8 border-l border-gray-100 w-72">
                <div>
                  <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400">ORGANIZER</p>
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/100?img=5" alt="Organizer" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Dr. Elena Rodriguez</p>
                      <p className="text-xs text-gray-500">Eco-Awareness Club</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 py-2 text-sm font-medium text-blue-600 transition border border-blue-600 rounded-lg hover:bg-blue-50">Message</button>
                  <button className="flex-1 py-2 text-sm font-medium text-blue-600 transition rounded-lg bg-blue-50 hover:bg-blue-100">Details</button>
                </div>
              </div>
            </ApplicationCard>

            {/* Card 2: Approved (After-School Math Tutoring) */}
            <ApplicationCard>
              <div className="flex-1 pr-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-50">
                      <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=100&q=80" alt="Thumbnail" className="object-cover w-full h-full rounded-lg" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">After-School Math Tutoring</h3>
                        <Badge text="Approved" colorClass="bg-gray-100 text-gray-600" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> Recurring: Tue/Thu</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> Community Education Center</span>
                      </div>
                    </div>
                  </div>
                  <MoreVertical size={20} className="text-gray-400 cursor-pointer" />
                </div>
                
                <div className="flex items-start gap-3 p-4 mt-4 border border-blue-100 rounded-lg bg-blue-50/50">
                  <CheckCircle2 className="text-gray-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-gray-600">Congratulations! You've been approved. Please complete the orientation module before Nov 1st.</p>
                </div>
              </div>

              <div className="flex flex-col justify-between pl-8 border-l border-gray-100 w-72">
                <div>
                  <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400">ORGANIZER</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-blue-600 rounded-full">SM</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Sarah Miller</p>
                      <p className="text-xs text-gray-500">Dept. of Education</p>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 mt-6 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">Start Orientation</button>
              </div>
            </ApplicationCard>

            {/* Card 3: Not Selected (Annual Tech Innovation Fair) */}
            <ApplicationCard>
              <div className="flex-1 pr-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&q=80" alt="Thumbnail" className="object-cover w-12 h-12 rounded-lg" />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">Annual Tech Innovation Fair</h3>
                        <Badge text="Not Selected" colorClass="bg-red-50 text-red-500" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> Oct 12, 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                  Thank you for your interest. We received an overwhelming number of applications this year and are unable to offer you a position at this time.
                </p>
              </div>

              <div className="flex flex-col justify-end pl-8 border-l border-gray-100 w-72">
                <button className="w-full py-2 text-sm font-medium text-blue-600 transition rounded-lg bg-blue-50 hover:bg-blue-100">Feedback</button>
              </div>
            </ApplicationCard>

            {/* Card 4: Completed (City Food Bank Drive) */}
            <ApplicationCard>
              <div className="flex-1 pr-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1593113565214-80afcb4a45d7?w=100&q=80" alt="Thumbnail" className="object-cover w-12 h-12 rounded-lg" />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">City Food Bank Drive</h3>
                        <Badge text="Completed" colorClass="bg-indigo-50 text-indigo-600" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> Sep 30, 2023</span>
                        <span className="flex items-center gap-1 font-medium text-blue-600"><Plus size={12}/> 50 Reputation Points</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 mt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Clock size={16} className="text-gray-400" />
                    8 Hours Logged
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CheckCircle2 size={16} className="text-gray-400" />
                    Certificate Issued
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end pl-8 border-l border-gray-100 w-72">
                <button className="flex items-center justify-center w-full gap-2 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                  <Download size={16} /> Download Certificate
                </button>
              </div>
            </ApplicationCard>

          </div>
        </div>
      </main>
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

const StatCard = ({ title, value, valueColor = "text-gray-800" }) => (
  <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
    <p className="mb-2 text-xs font-bold tracking-wider text-gray-400">{title}</p>
    <h3 className={`text-3xl font-bold ${valueColor}`}>{value}</h3>
  </div>
);

const ApplicationCard = ({ children }) => (
  <div className="flex flex-col p-6 bg-white border border-gray-200 shadow-sm rounded-xl md:flex-row">
    {children}
  </div>
);

const Badge = ({ text, colorClass }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colorClass}`}>
    {text}
  </span>
);

const ProgressStep = ({ label, active, current }) => (
  <div className="flex flex-col items-center">
    <div className={`w-4 h-4 rounded-full border-4 bg-white z-10 ${active ? 'border-blue-600' : 'border-gray-200'} ${current ? 'shadow-[0_0_0_4px_rgba(37,99,235,0.1)]' : ''}`}></div>
    <span className={`text-xs mt-2 font-medium ${active ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
  </div>
);

export default MyApplications;