import React from 'react';
import { 
  Search, Bell, Moon, LayoutDashboard, Compass, 
  FileText, CalendarCheck, Award, Trophy, BellRing, 
  Settings, LogOut, ChevronRight, CheckCircle2, 
  MapPin, Clock, Plus 
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="h-20 flex flex-col justify-center px-6 border-b border-gray-100">
            <h1 className="text-blue-600 font-bold text-xl">VolunteerHub</h1>
            <p className="text-xs text-gray-500">Student Portal</p>
          </div>
          <nav className="p-4 space-y-1">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
            <NavItem icon={<Compass size={20} />} label="Browse Events" />
            <NavItem icon={<FileText size={20} />} label="My Applications" />
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
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white flex items-center justify-between px-8 border-b border-gray-200">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search opportunities, organizations..." 
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell className="text-gray-500 cursor-pointer hover:text-gray-800" size={20} />
            <Moon className="text-gray-500 cursor-pointer hover:text-gray-800" size={20} />
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Irosha Abeyrathna</p>
                <p className="text-xs text-gray-500">Senior Student</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Irosha" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* WELCOME BANNER */}
          <div className="bg-blue-600 rounded-2xl p-8 text-white flex justify-between items-center mb-8 shadow-sm relative overflow-hidden">
            <div className="z-10">
              <h2 className="text-2xl font-semibold mb-2">Welcome back, Irosha!</h2>
              <p className="text-blue-100 max-w-lg mb-6 text-sm">
                You've completed 85% of your community service goal this semester. Keep up the amazing work!
              </p>
              <button className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-50 transition">
                Find New Events
              </button>
            </div>
            {/* Background Graphic Placeholder */}
            <div className="absolute right-10 opacity-20 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard icon={<CalendarCheck className="text-blue-500" />} value="24" label="Total Events" badge="+2 this week" badgeColor="bg-blue-100 text-blue-700" />
            <StatCard icon={<Clock className="text-gray-500" />} value="128.5" label="Service Hours" badge="85% of goal" badgeColor="bg-gray-200 text-gray-700" />
            <StatCard icon={<Trophy className="text-purple-500" />} value="4,820" label="Reputation Points" badge="Gold Tier" badgeColor="bg-purple-100 text-purple-700" />
            <StatCard icon={<Award className="text-gray-500" />} value="12" label="Certificates" badge="1 pending" badgeColor="bg-blue-100 text-blue-700" />
          </div>

          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-3 gap-8">
            
            {/* LEFT COLUMN (Wider) */}
            <div className="col-span-2 space-y-8">
              
              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
                  <button className="text-blue-600 text-sm font-medium">View All</button>
                </div>
                <div className="space-y-4">
                  <EventListItem 
                    category="Environment" 
                    title="Campus Community Garden Workshop" 
                    date="Oct 12, 2023" 
                    location="Central Quad"
                    image="https://images.unsplash.com/photo-1592424001806-53805eb3a1f9?w=100&q=80"
                  />
                  <EventListItem 
                    category="Tutoring" 
                    title="Local High School Math Mentoring" 
                    date="Oct 15, 2023" 
                    location="North Library"
                    image="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=100&q=80"
                  />
                </div>
              </div>

              {/* Recommended For You */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-6">Recommended for You</h3>
                <div className="grid grid-cols-2 gap-6">
                  <RecommendedCard 
                    category="Social Impact"
                    slots="4 slots left"
                    title="Annual Food Drive Logistics"
                    desc="Help organize and distribute food packages to local families in need."
                    image="https://images.unsplash.com/photo-1593113565214-80afcb4a45d7?w=300&q=80"
                  />
                  <RecommendedCard 
                    category="Technology"
                    slots="10 slots left"
                    title="Youth Coding Workshop"
                    desc="Assist middle school students in learning the basics of Python and web development."
                    image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&q=80"
                  />
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (Narrower) */}
            <div className="space-y-8">
              
              {/* Reputation Level */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center">
                <h3 className="font-semibold text-gray-800 text-left mb-6">Reputation Level</h3>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Award className="text-blue-600" size={32} />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">Gold Member</h4>
                <p className="text-sm text-gray-500 mb-6">180 points to Platinum</p>
                
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Progress</span>
                    <span className="font-medium text-gray-800">4,820 / 5,000 XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div className="space-y-4 text-left mt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Consistency Badge</p>
                      <p className="text-xs text-gray-500">Volunteered 4 weeks in a row</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Team Lead Ready</p>
                      <p className="text-xs text-gray-500">Eligible to lead event groups</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Participation */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-6">Recent Participation</h3>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                  <TimelineItem 
                    date="Yesterday" 
                    title="Beach Cleanup Drive" 
                    hours="+4.5 Hours" 
                    active 
                  />
                  <TimelineItem 
                    date="Oct 5, 2023" 
                    title="Library Archiving" 
                    hours="+3 Hours" 
                  />
                  <TimelineItem 
                    date="Oct 1, 2023" 
                    title="Peer Support Session" 
                    hours="+2 Hours" 
                  />
                </div>
                <button className="w-full mt-8 py-2 text-sm text-gray-600 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Download Report
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button Placeholder */}
      <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition">
        <Plus size={24} />
      </button>

    </div>
  );
};

// --- Subcomponents for clean code ---

const NavItem = ({ icon, label, active, textClass = "text-gray-600" }) => (
  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-600 font-medium' : `hover:bg-gray-50 ${textClass}`}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const StatCard = ({ icon, value, label, badge, badgeColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${badgeColor}`}>{badge}</span>
    </div>
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const EventListItem = ({ category, title, date, location, image }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-100 transition cursor-pointer group">
    <div className="flex items-center gap-4">
      <img src={image} alt={title} className="w-16 h-16 rounded-lg object-cover" />
      <div>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">{category}</span>
        <h4 className="font-semibold text-sm text-gray-800 mb-1">{title}</h4>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><CalendarCheck size={12} /> {date}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {location}</span>
        </div>
      </div>
    </div>
    <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition" size={20} />
  </div>
);

const RecommendedCard = ({ category, slots, title, desc, image }) => (
  <div className="border border-gray-100 rounded-xl overflow-hidden flex flex-col group hover:shadow-md transition">
    <div className="h-32 overflow-hidden relative">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{category}</span>
        <span className="text-xs text-gray-500">{slots}</span>
      </div>
      <h4 className="font-semibold text-sm text-gray-800 mb-2">{title}</h4>
      <p className="text-xs text-gray-500 mb-5 flex-1 line-clamp-2">{desc}</p>
      <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition mt-auto">
        Apply Now
      </button>
    </div>
  </div>
);

const TimelineItem = ({ date, title, hours, active }) => (
  <div className="relative pl-6">
    <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${active ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
    <p className="text-xs text-gray-400 mb-0.5">{date}</p>
    <p className="text-sm font-semibold text-gray-800">{title}</p>
    <p className="text-xs font-medium text-blue-600">{hours}</p>
  </div>
);

export default Dashboard;