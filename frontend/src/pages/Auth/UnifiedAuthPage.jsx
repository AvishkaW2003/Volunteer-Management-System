import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Building, Eye, EyeOff, HandHelping, ArrowLeft, CheckCircle2, Phone } from 'lucide-react';
import { loginUser, registerStudent, registerOrganizer, googleLogin, googleRegisterOrganizer } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const UnifiedAuthPage = ({ initialTab = 'login', initialRole = 'student' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [activeRole, setActiveRole] = useState(initialRole);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync state if initial props or route changes
  useEffect(() => {
    setActiveTab(initialTab);
    setActiveRole(initialRole);
  }, [initialTab, initialRole, location.pathname]);

  // Form states
  const [studentLoginData, setStudentLoginData] = useState({ email: '', password: '' });
  const [organizerLoginData, setOrganizerLoginData] = useState({ email: '', password: '' });

  const [studentRegisterData, setStudentRegisterData] = useState({
    fullName: '',
    studentId: '',
    faculty: '',
    skills: '',
    email: '',
    password: '',
  });

  const [organizerRegisterData, setOrganizerRegisterData] = useState({
    clubName: '',
    contactNumber: '',
    email: '',
    password: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Onboarding State for Organizers
  const [onboardingData, setOnboardingData] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({ clubName: '', contactNumber: '' });

  // Reset errors when switching tab or role
  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setError('');
    setShowPassword(false);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setShowPassword(false);
  };

  // Google Credential Callback
  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      const res = await googleLogin(response.credential, activeRole);
      if (res.status === "needs_onboarding") {
        setOnboardingData({ email: res.email, name: res.name, idToken: res.idToken });
        setOnboardingForm({ clubName: res.name || '', contactNumber: '' });
        setShowOnboarding(true);
      } else {
        login(res.user, res.token);
        navigate(res.user.role === 'student' ? '/student/dashboard' : '/organizer/dashboard');
      }
    } catch (err) {
      if (!err.response) {
        setError('Could not connect to backend server. Please check backend execution on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth button renderer
  useEffect(() => {
    if (showOnboarding) return;
    const timer = setTimeout(() => {
      const btn = document.getElementById("google-signin-btn-page");
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
      if (btn && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
          });
          window.google.accounts.id.renderButton(
            btn,
            { theme: "outline", size: "large", width: 400 }
          );
        } catch (err) {
          console.error("Google Sign-In initialization failed:", err);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [activeTab, activeRole, showOnboarding]);

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const credentials = activeRole === 'student' ? studentLoginData : organizerLoginData;

    try {
      const data = await loginUser(credentials);
      if (data.user.role !== activeRole) {
        setError(`Access denied. Please switch to the ${data.user.role} portal tab.`);
        setLoading(false);
        return;
      }
      login(data.user, data.token);
      setStudentLoginData({ email: '', password: '' });
      setOrganizerLoginData({ email: '', password: '' });
      navigate(activeRole === 'student' ? '/student/dashboard' : '/organizer/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Could not connect to backend server. Please ensure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (activeRole === 'student') {
      if (studentRegisterData.studentId && !/^STU\d{6}$/.test(studentRegisterData.studentId)) {
        setError('Student ID must be in the format STU followed by 6 digits (e.g., STU123456).');
        setLoading(false);
        return;
      }

      try {
        const payload = {
          name: studentRegisterData.fullName,
          studentId: studentRegisterData.studentId,
          faculty: studentRegisterData.faculty,
          skills: studentRegisterData.skills,
          email: studentRegisterData.email,
          password: studentRegisterData.password,
        };
        await registerStudent(payload);
        setError('');
        setActiveTab('login');
        setStudentLoginData({ email: studentRegisterData.email, password: '' });
      } catch (err) {
        if (!err.response) {
          setError('Could not connect to backend server. Please check your network connection.');
        } else {
          const data = err.response?.data;
          if (data && data.errors && Array.isArray(data.errors)) {
            setError(data.errors.map(e => `${e.field}: ${e.message}`).join(', '));
          } else {
            setError(data?.message || 'Registration failed. Please try again.');
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
      if (organizerRegisterData.contactNumber && !phoneRegex.test(organizerRegisterData.contactNumber)) {
        setError('Contact number must be a valid phone number (7 to 20 characters).');
        setLoading(false);
        return;
      }

      try {
        const payload = {
          organizationName: organizerRegisterData.clubName,
          phone: organizerRegisterData.contactNumber,
          email: organizerRegisterData.email,
          password: organizerRegisterData.password,
        };
        await registerOrganizer(payload);
        setError('');
        setActiveTab('login');
        setOrganizerLoginData({ email: organizerRegisterData.email, password: '' });
      } catch (err) {
        if (!err.response) {
          setError('Could not connect to backend server. Please check your network connection.');
        } else {
          const data = err.response?.data;
          if (data && data.errors && Array.isArray(data.errors)) {
            setError(data.errors.map(e => `${e.field}: ${e.message}`).join(', '));
          } else {
            setError(data?.message || 'Registration failed. Please try again.');
          }
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 pt-24 pb-12">
      
      {/* Top Brand Logo */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
          <HandHelping className="w-6 h-6" />
        </div>
        <span className="font-extrabold text-2xl text-gray-800 tracking-tight">VolunteerHub</span>
      </div>

      {/* Main Container Card (User-Friendly Balanced Form) */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-7 md:p-9 flex flex-col justify-start">
          
          {/* Header Title */}
          <div className="mb-5 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-1.5">
              {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
              {activeTab === 'login' 
                ? `Sign in to access your ${activeRole} account.` 
                : `Fill in your details below to register as a ${activeRole}.`}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 text-red-500 text-xs px-4 py-3 rounded-xl mb-5 border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* Portal Selector (Student vs Organizer) */}
          <div className="flex border border-gray-200 bg-gray-50 p-1 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'student' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('organizer')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'organizer' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Organizer Portal
            </button>
          </div>

          {/* Mode Selector (Sign In vs Create Account) */}
          <div className="flex justify-center gap-8 mb-6 border-b border-gray-100 pb-3">
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`text-sm font-bold pb-2 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'login'
                  ? (activeRole === 'student' ? 'border-blue-600 text-blue-600' : 'border-teal-600 text-teal-600')
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`text-sm font-bold pb-2 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'register'
                  ? (activeRole === 'student' ? 'border-blue-600 text-blue-600' : 'border-teal-600 text-teal-600')
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Top Google OAuth Button */}
              <div className="mb-2">
                <div className="relative w-full overflow-hidden rounded-xl">
                  <div className="w-full py-3.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-gray-700 font-bold text-base shadow-sm transition-all pointer-events-none">
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </div>
                  <div 
                    id="google-signin-btn-page" 
                    className="absolute inset-0 opacity-0 cursor-pointer flex justify-center items-center overflow-hidden z-10 [&_iframe]:!w-[600px] [&_iframe]:!h-[80px] [&_iframe]:!max-w-none"
                  />
                </div>

                <div className="w-full flex items-center gap-3 mt-4 mb-1">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Or Sign In With Email</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@university.edu"
                  value={activeRole === 'student' ? studentLoginData.email : organizerLoginData.email}
                  onChange={(e) => 
                    activeRole === 'student' 
                      ? setStudentLoginData({ ...studentLoginData, email: e.target.value })
                      : setOrganizerLoginData({ ...organizerLoginData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span
                    onClick={() => navigate('/forgot-password')}
                    className="text-[11px] text-blue-500 hover:underline cursor-pointer font-medium"
                  >
                    Forgot password?
                  </span>
                </div>
                <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-2.5 gap-2 focus-within:border-blue-500 transition-colors">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter password"
                    value={activeRole === 'student' ? studentLoginData.password : organizerLoginData.password}
                    onChange={(e) =>
                      activeRole === 'student'
                        ? setStudentLoginData({ ...studentLoginData, password: e.target.value })
                        : setOrganizerLoginData({ ...organizerLoginData, password: e.target.value })
                    }
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-base shadow-sm transition-all duration-200 mt-2 disabled:opacity-60 cursor-pointer ${
                  activeRole === 'student' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20'
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Top Google OAuth Button */}
              <div className="mb-2">
                <div className="relative w-full overflow-hidden rounded-xl">
                  <div className="w-full py-3.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-gray-700 font-bold text-base shadow-sm transition-all pointer-events-none">
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Sign up with Google</span>
                  </div>
                  <div 
                    id="google-signin-btn-page" 
                    className="absolute inset-0 opacity-0 cursor-pointer flex justify-center items-center overflow-hidden z-10 [&_iframe]:!w-[600px] [&_iframe]:!h-[80px] [&_iframe]:!max-w-none"
                  />
                </div>

                <div className="w-full flex items-center gap-3 mt-4 mb-1">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Or Register With Details</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
              </div>
              {activeRole === 'student' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder="John Doe"
                        value={studentRegisterData.fullName}
                        onChange={(e) => setStudentRegisterData({ ...studentRegisterData, fullName: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Student ID
                      </label>
                      <input
                        type="text"
                        name="studentId"
                        required
                        placeholder="STU123456"
                        value={studentRegisterData.studentId}
                        onChange={(e) => setStudentRegisterData({ ...studentRegisterData, studentId: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Faculty
                    </label>
                    <input
                      type="text"
                      name="faculty"
                      required
                      placeholder="Faculty of Engineering"
                      value={studentRegisterData.faculty}
                      onChange={(e) => setStudentRegisterData({ ...studentRegisterData, faculty: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Skills <span className="text-gray-400 font-normal lowercase">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      name="skills"
                      placeholder="e.g. Leadership, Writing"
                      value={studentRegisterData.skills}
                      onChange={(e) => setStudentRegisterData({ ...studentRegisterData, skills: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Club / Organization Name
                    </label>
                    <input
                      type="text"
                      name="clubName"
                      required
                      placeholder="e.g. Rotaract Club"
                      value={organizerRegisterData.clubName}
                      onChange={(e) => setOrganizerRegisterData({ ...organizerRegisterData, clubName: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      required
                      placeholder="e.g. +94771234567"
                      value={organizerRegisterData.contactNumber}
                      onChange={(e) => setOrganizerRegisterData({ ...organizerRegisterData, contactNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@domain.com"
                  value={activeRole === 'student' ? studentRegisterData.email : organizerRegisterData.email}
                  onChange={(e) => 
                    activeRole === 'student'
                      ? setStudentRegisterData({ ...studentRegisterData, email: e.target.value })
                      : setOrganizerRegisterData({ ...organizerRegisterData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-2.5 gap-2 focus-within:border-blue-500 transition-colors">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Choose password"
                    value={activeRole === 'student' ? studentRegisterData.password : organizerRegisterData.password}
                    onChange={(e) =>
                      activeRole === 'student'
                        ? setStudentRegisterData({ ...studentRegisterData, password: e.target.value })
                        : setOrganizerRegisterData({ ...organizerRegisterData, password: e.target.value })
                    }
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-base shadow-sm transition-all duration-200 mt-2 disabled:opacity-60 cursor-pointer ${
                  activeRole === 'student' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20'
                }`}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
      </div>

      {/* Back to Home Link */}
      <button
        onClick={() => navigate('/')}
        className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

    </div>
  );
};

export default UnifiedAuthPage;
