import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, User, Building, Phone, HandHelping, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { loginUser, registerStudent, registerOrganizer, googleLogin, googleRegisterOrganizer } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialTab = 'login', initialRole = 'student' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Active portal (student or organizer) and mode (login or register)
  const [activeRole, setActiveRole] = useState(initialRole);
  const [activeTab, setActiveTab] = useState(initialTab);

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

  // Onboarding (specifically for Organizer Google Login)
  const [onboardingData, setOnboardingData] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({
    clubName: '',
    contactNumber: ''
  });

  // Reset errors and settings on open/change
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setActiveRole(initialRole);
      setError('');
      setShowPassword(false);
      setShowOnboarding(false);
      setStudentLoginData({ email: '', password: '' });
      setOrganizerLoginData({ email: '', password: '' });
      setStudentRegisterData({
        fullName: '',
        studentId: '',
        faculty: '',
        skills: '',
        email: '',
        password: '',
      });
      setOrganizerRegisterData({
        clubName: '',
        contactNumber: '',
        email: '',
        password: '',
      });
    }
  }, [isOpen, initialTab, initialRole]);

  // Handle inputs change
  const handleStudentLoginChange = (e) => {
    setStudentLoginData({ ...studentLoginData, [e.target.name]: e.target.value });
  };
  const handleOrganizerLoginChange = (e) => {
    setOrganizerLoginData({ ...organizerLoginData, [e.target.name]: e.target.value });
  };
  const handleStudentRegisterChange = (e) => {
    setStudentRegisterData({ ...studentRegisterData, [e.target.name]: e.target.value });
  };
  const handleOrganizerRegisterChange = (e) => {
    setOrganizerRegisterData({ ...organizerRegisterData, [e.target.name]: e.target.value });
  };
  const handleOnboardingChange = (e) => {
    setOnboardingForm({ ...onboardingForm, [e.target.name]: e.target.value });
  };

  // Google Credential Callback
  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      const res = await googleLogin(response.credential, activeRole);
      if (res.status === "needs_onboarding") {
        setOnboardingData({
          email: res.email,
          name: res.name,
          idToken: res.idToken
        });
        setOnboardingForm({
          clubName: res.name || '',
          contactNumber: ''
        });
        setShowOnboarding(true);
      } else {
        login(res.user, res.token);
        onClose();
        navigate(res.user.role === 'student' ? '/student/dashboard' : '/organizer/dashboard');
      }
    } catch (err) {
      if (!err.response) {
        setError('Could not connect to backend server. Please ensure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth button renderer inside modal
  useEffect(() => {
    if (!isOpen || showOnboarding) return;

    const timer = setTimeout(() => {
      const btn = document.getElementById("google-signin-btn-modal");
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
      if (btn && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
          });
          const parentWidth = btn.parentElement ? btn.parentElement.clientWidth : 400;
          const targetWidth = Math.min(Math.max(parentWidth, 240), 500);

          window.google.accounts.id.renderButton(
            btn,
            { 
              theme: "outline", 
              size: "large", 
              width: targetWidth,
              text: activeTab === 'login' ? 'signin_with' : 'signup_with',
              shape: "rectangular"
            }
          );
        } catch (err) {
          console.error("Google Sign-In initialization failed:", err);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab, activeRole, showOnboarding]);

  // Submit Organizer Google Onboarding
  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (onboardingForm.contactNumber && !phoneRegex.test(onboardingForm.contactNumber)) {
      setError('Contact number must be a valid phone number (7 to 20 characters).');
      setLoading(false);
      return;
    }

    try {
      const res = await googleRegisterOrganizer(
        onboardingData.idToken,
        onboardingForm.clubName,
        onboardingForm.contactNumber
      );
      login(res.user, res.token);
      onClose();
      navigate('/organizer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign In Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const credentials = activeRole === 'student' ? studentLoginData : organizerLoginData;

    try {
      const data = await loginUser(credentials);
      if (data.user.role !== activeRole) {
        setError(`Access denied. Please switch to the ${data.user.role} portal.`);
        setLoading(false);
        return;
      }
      login(data.user, data.token);
      setStudentLoginData({ email: '', password: '' });
      setOrganizerLoginData({ email: '', password: '' });
      onClose();
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

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (activeRole === 'student') {
      // Client-side validation for Student ID
      if (studentRegisterData.studentId && !/^STU\d{6}$/.test(studentRegisterData.studentId)) {
        setError('Student ID must be in the format STU followed by exactly 6 digits (e.g., STU123456).');
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
        // Switch to login tab on success
        setError('');
        setActiveTab('login');
        setStudentLoginData({ email: studentRegisterData.email, password: '' });
      } catch (err) {
        if (!err.response) {
          setError('Could not connect to backend server. Please ensure the backend is running on port 5000.');
        } else {
          const data = err.response?.data;
          if (data && data.errors && Array.isArray(data.errors)) {
            const fieldMsgs = data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
            setError(fieldMsgs);
          } else {
            setError(data?.message || 'Registration failed. Please try again.');
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Client-side validation for phone number
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
          setError('Could not connect to backend server. Please ensure the backend is running on port 5000.');
        } else {
          const data = err.response?.data;
          if (data && data.errors && Array.isArray(data.errors)) {
            const fieldMsgs = data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
            setError(fieldMsgs);
          } else {
            setError(data?.message || 'Registration failed. Please try again.');
          }
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      {/* Backdrop Click-to-Close listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="bg-white w-full max-w-xl md:max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-6 md:p-8 relative z-10 max-h-[92vh] overflow-y-auto transition-all duration-300 transform scale-100">
          
          {/* Header/Logo (Visible on Mobile only) */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <HandHelping className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-gray-800 text-lg">VolunteerHub</span>
          </div>

          <div className="mb-6 text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
              {showOnboarding 
                ? 'Complete Sign-In' 
                : (activeTab === 'login' 
                    ? (activeRole === 'student' ? 'Welcome Back, Student!' : 'Welcome Back, Organizer!') 
                    : (activeRole === 'student' ? 'Join VolunteerHub' : 'Register Organization'))}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
              {showOnboarding 
                ? 'Please complete your organization profile to proceed.'
                : (activeTab === 'login' 
                    ? (activeRole === 'student'
                        ? 'Sign in to discover university volunteer events, track hours, and earn certificates.'
                        : 'Sign in to host campus events, manage volunteer attendance, and issue certificates.')
                    : (activeRole === 'student'
                        ? 'Create your free student account to start building your campus volunteer reputation.'
                        : 'Register your student club or organization to publish events and recruit volunteers.'))}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4 border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* Onboarding Mode Form */}
          {showOnboarding ? (
            <form onSubmit={handleOnboardingSubmit} className="space-y-4">
              <div className="text-left mb-4">
                <p className="text-xs text-gray-500">
                  Please finalize your Google Registration for <strong className="text-gray-800">{onboardingData?.email}</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Club / Organization Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-2.5 gap-2 focus-within:border-blue-500 transition-colors">
                  <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    name="clubName"
                    value={onboardingForm.clubName}
                    onChange={handleOnboardingChange}
                    placeholder="Enter your club name"
                    required
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Contact Number
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-2.5 gap-2 focus-within:border-blue-500 transition-colors">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={onboardingForm.contactNumber}
                    onChange={handleOnboardingChange}
                    placeholder="e.g. +94771234567"
                    required
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-all duration-200 mt-2 disabled:opacity-60"
              >
                {loading ? 'Completing...' : 'Finish Registration'}
              </button>
            </form>
          ) : (
            // Standard Forms
            <>
              {/* PORTAL CHOOSE OPTION TABS (Left Side) */}
              <div className="flex border border-gray-100 bg-gray-50/70 p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => { setActiveRole('student'); setError(''); }}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all duration-250 flex items-center justify-center gap-1 ${
                    activeRole === 'student'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Student Portal
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveRole('organizer'); setError(''); }}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all duration-250 flex items-center justify-center gap-1 ${
                    activeRole === 'organizer'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  Organizer Portal
                </button>
              </div>

              {/* ACTION CHOOSE OPTION TABS (Left Side) */}
              <div className="flex justify-center gap-6 mb-5">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`text-sm font-bold pb-1.5 border-b-2 transition-colors duration-200 ${
                    activeTab === 'login'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  className={`text-sm font-bold pb-1.5 border-b-2 transition-colors duration-200 ${
                    activeTab === 'register'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {activeTab === 'login' ? (
                // ── LOGIN FORM ─────────────────────────────
                <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                      onChange={activeRole === 'student' ? handleStudentLoginChange : handleOrganizerLoginChange}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Password
                      </label>
                      <span
                        onClick={() => { onClose(); navigate('/forgot-password'); }}
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
                        onChange={activeRole === 'student' ? handleStudentLoginChange : handleOrganizerLoginChange}
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
                    className="w-full py-3.5 rounded-xl text-white font-bold text-base shadow-sm transition-all duration-250 mt-2 disabled:opacity-60 cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>

                  {/* Bottom Google OAuth Button Container (Identical Full-Width Size to Sign In Button) */}
                  <div className="mt-4 flex flex-col items-center justify-center w-full">
                    <div className="w-full flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Or Sign In With Google</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="relative w-full overflow-hidden rounded-xl h-[46px]">
                      {/* Styled full-width button matching primary button height & width */}
                      <div className="w-full h-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center gap-3 text-slate-700 font-extrabold text-sm shadow-sm transition-all pointer-events-none">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        <span>Sign in with Google</span>
                      </div>

                      {/* Stretched GIS Overlay */}
                      <div 
                        id="google-signin-btn-modal" 
                        className="absolute inset-0 opacity-0 cursor-pointer flex justify-center items-center scale-x-[1.7] scale-y-[1.3]"
                      />
                    </div>
                  </div>
                </form>
              ) : (
                // ── REGISTRATION FORM (COMPACT 2-COLUMN GRID) ──────────────
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {activeRole === 'student' ? (
                    /* Student 2-Column Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          onChange={handleStudentRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
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
                          onChange={handleStudentRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                        />
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
                          onChange={handleStudentRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Skills <span className="text-gray-400 font-normal lowercase">(optional)</span>
                        </label>
                        <input
                          type="text"
                          name="skills"
                          placeholder="Leadership, Writing"
                          value={studentRegisterData.skills}
                          onChange={handleStudentRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="student@university.edu"
                          value={studentRegisterData.email}
                          onChange={handleStudentRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Password
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-2 gap-2 focus-within:border-blue-500 transition-colors">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            placeholder="Choose password"
                            value={studentRegisterData.password}
                            onChange={handleStudentRegisterChange}
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
                    </div>
                  ) : (
                    /* Organizer 2-Column Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Club / Organization Name
                        </label>
                        <input
                          type="text"
                          name="clubName"
                          required
                          placeholder="Rotaract Club"
                          value={organizerRegisterData.clubName}
                          onChange={handleOrganizerRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
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
                          placeholder="+94771234567"
                          value={organizerRegisterData.contactNumber}
                          onChange={handleOrganizerRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="club@organization.com"
                          value={organizerRegisterData.email}
                          onChange={handleOrganizerRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Password
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-2 gap-2 focus-within:border-blue-500 transition-colors">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            placeholder="Choose password"
                            value={organizerRegisterData.password}
                            onChange={handleOrganizerRegisterChange}
                            className="flex-1 outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent w-full"
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
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-extrabold text-base transition-all duration-250 mt-1 disabled:opacity-60 cursor-pointer shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
                  >
                    {loading ? 'Creating Account...' : `Create ${activeRole === 'student' ? 'Student Account' : 'Organizer Account'}`}
                  </button>

                  {/* Bottom Google OAuth Button Container (Identical Full-Width Size to Sign In Button) */}
                  <div className="mt-3 flex flex-col items-center justify-center w-full">
                    <div className="w-full flex items-center gap-3 mb-2">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Or Register With Google</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="relative w-full overflow-hidden rounded-xl h-[46px]">
                      {/* Styled full-width button matching primary button height & width */}
                      <div className="w-full h-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center gap-3 text-slate-700 font-extrabold text-sm shadow-sm transition-all pointer-events-none">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        <span>Sign up with Google</span>
                      </div>

                      {/* Stretched GIS Overlay */}
                      <div 
                        id="google-signin-btn-modal" 
                        className="absolute inset-0 opacity-0 cursor-pointer flex justify-center items-center scale-x-[1.7] scale-y-[1.3]"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* Role Features Preview Badge */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>
                  {activeRole === 'student' 
                    ? 'Student Perks: Earn Verified Certificates & Leaderboard Points' 
                    : 'Organizer Perks: Automated Attendance & Volunteer Analytics'}
                </span>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default AuthModal;
