import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Users, Calendar, Award, Shield, ChevronRight, Star,
  Heart, BookOpen, CheckCircle, Menu, X, TrendingUp, Globe,
} from 'lucide-react';

const stats = [
  { value: '2,400+', label: 'Active Volunteers', icon: Users,     color: 'text-blue-400'   },
  { value: '180+',   label: 'Events Hosted',     icon: Calendar,  color: 'text-purple-400' },
  { value: '95%',    label: 'Satisfaction Rate',  icon: Star,      color: 'text-yellow-400' },
  { value: '1,200+', label: 'Certificates Issued',icon: Award,     color: 'text-cyan-400'   },
];

const features = [
  {
    icon: Calendar,
    title: 'Browse & Apply to Events',
    description: 'Discover volunteering opportunities that match your skills and interests. Apply in seconds.',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Impact',
    description: 'Monitor your volunteer hours, reputation points, and rank on the leaderboard.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Award,
    title: 'Earn Certificates',
    description: 'Get verified digital certificates for every event you complete. Share them proudly.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Globe,
    title: 'Organised Event Management',
    description: 'Organisers can create events, manage applications, track attendance, and issue certificates.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Admin Oversight',
    description: 'Full platform control — approve events, manage users, view reports and analytics.',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Heart,
    title: 'Community First',
    description: 'Built to connect passionate volunteers with meaningful causes in your community.',
    gradient: 'from-rose-500 to-orange-400',
  },
];

const steps = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up as a Student, Organizer, or Admin in under a minute.', color: 'from-blue-400 to-purple-500' },
  { step: '02', title: 'Browse Events',        desc: 'Explore events by category, skills, or date and apply instantly.', color: 'from-purple-400 to-pink-500' },
  { step: '03', title: 'Volunteer & Earn',     desc: 'Attend events, collect hours, earn points and get certified.', color: 'from-cyan-400 to-blue-500' },
];

const roles = [
  {
    label: 'Student',
    description: 'Join events, earn certificates, climb the leaderboard and build your volunteer reputation.',
    gradient: 'from-blue-500 to-purple-600',
    bg: 'from-blue-50 to-purple-50',
    border: 'border-purple-200',
    path: '/register/student',
    icon: BookOpen,
  },
  {
    label: 'Organizer',
    description: 'Create and manage events, review applications, track attendance and issue certificates.',
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'from-cyan-50 to-blue-50',
    border: 'border-cyan-200',
    path: '/register/organizer',
    icon: Users,
  },
  {
    label: 'Admin',
    description: 'Oversee the entire platform, approve events, manage users and view detailed analytics.',
    gradient: 'from-teal-500 to-cyan-500',
    bg: 'from-teal-50 to-cyan-50',
    border: 'border-teal-200',
    path: '/login/admin',
    icon: Shield,
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl
              flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">VH</span>
            </div>
            <span className="text-lg font-extrabold text-gray-800">VolunteerHub</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Join Us'].map(item => (
              <a key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigate('/get-started')}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600
                text-white text-sm font-semibold shadow-sm hover:shadow-md
                hover:from-blue-600 hover:to-purple-700 transition-all">
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-1.5 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {['Features', 'How It Works', 'Join Us'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block text-sm font-medium text-gray-700 py-1"
                onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            <button
              onClick={() => { navigate('/get-started'); setMenuOpen(false); }}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600
                text-white text-sm font-semibold">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center
          text-center px-4 pt-20 pb-16 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #1e3a8a 70%, #0e7490 100%)',
        }}
      >
        {/* Background decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        </div>

        {/* Badge */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
          <Heart className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs text-blue-100 font-semibold tracking-wide">
            Volunteer Management System
          </span>
        </div>

        {/* Headline */}
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold text-white
          leading-tight tracking-tight mb-6 max-w-4xl">
          Make a{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400
            bg-clip-text text-transparent">
            Difference
          </span>
          {' '}Today
        </h1>

        <p className="relative z-10 text-lg md:text-xl text-blue-100 max-w-2xl mb-10 leading-relaxed">
          Join VolunteerHub — where students discover opportunities, organizers manage events,
          and communities grow through the power of volunteering.
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => navigate('/get-started')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl
              bg-gradient-to-r from-blue-500 to-purple-600
              text-white font-bold text-base shadow-lg shadow-purple-900/40
              hover:from-blue-600 hover:to-purple-700 hover:shadow-xl
              transition-all duration-200">
            Get Started Free
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-2xl border border-white/30 text-white font-bold text-base
              backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
            Learn More
          </button>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
          {stats.map(({ value, label, icon: Icon, color }) => (
            <div key={label}
              className="flex flex-col items-center gap-1.5 bg-white/10 backdrop-blur-sm
                rounded-2xl px-4 py-4 border border-white/10">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-2xl font-extrabold text-white">{value}</span>
              <span className="text-xs text-blue-200 font-medium text-center">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-600
              text-sm font-semibold mb-4">Features</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Everything You Need to Volunteer
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              A complete platform for students, organisers, and admins to manage the full volunteering lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, gradient }) => (
              <div key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm
                  hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient}
                  flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section id="how-it-works"
        className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600
              text-sm font-semibold mb-4">How It Works</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Start Volunteering in 3 Steps
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Getting started is simple. Create your account, find an event, and make an impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc, color }) => (
              <div key={step} className="flex flex-col items-center text-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color}
                  flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-xl font-extrabold">{step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
                {step !== '03' && (
                  <div className="hidden md:block absolute translate-x-32 mt-6">
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join As ────────────────────────────────────── */}
      <section id="join-us" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-600
              text-sm font-semibold mb-4">Join Us</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Role</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Whether you want to volunteer, organise, or administrate — VolunteerHub has a place for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {roles.map(({ label, description, gradient, bg, border, path, icon: Icon }) => (
              <div key={label}
                className={`rounded-3xl border ${border} bg-gradient-to-br ${bg}
                  p-8 flex flex-col items-center text-center gap-5
                  hover:scale-105 hover:shadow-xl transition-all duration-250 cursor-pointer`}
                onClick={() => navigate(path)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient}
                  flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
                <button
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl
                    bg-gradient-to-r ${gradient} text-white font-semibold text-sm
                    shadow-sm hover:shadow-md transition-all`}>
                  Join as {label}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #0e7490 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center
            mx-auto mb-6 backdrop-blur-sm">
            <Heart className="w-8 h-8 text-pink-300" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Join thousands of volunteers already making a difference in their communities.
          </p>
          <button
            onClick={() => navigate('/get-started')}
            className="px-10 py-4 rounded-2xl bg-white text-blue-700 font-bold text-base
              shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
            Start Volunteering Today
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center
          justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600
              rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">VH</span>
            </div>
            <span className="text-white font-bold text-base">VolunteerHub</span>
          </div>
          <p className="text-sm text-center">
            © 2025 VolunteerHub. Built with ❤️ for the community.
          </p>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-400 font-medium">System Online</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
