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
          window.google.accounts.id.renderButton(
            btn,
            { theme: "outline", size: "large", width: 280 }
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
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 p-8 relative z-10 max-h-[90vh] overflow-y-auto transition-transform duration-300 transform scale-100">
          
          {/* Header/Logo (Visible on Mobile only) */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <HandHelping className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-gray-800 text-lg">VolunteerHub</span>
          </div>

          <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">
            {showOnboarding ? 'Complete Sign-In' : 'Welcome to VolunteerHub'}
          </h3>
          <p className="text-gray-500 text-xs mb-6">
            Please fill in your details below to proceed.
          </p>

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
                <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-2.5 gap-2 focus-within:border-teal-500 transition-colors">
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
                <div className="flex items-center border border-gray-300 rounded-xl px-3.5 py-2.5 gap-2 focus-within:border-teal-500 transition-colors">
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
                className="w-full py-3 rounded-xl text-white font-bold text-sm bg-teal-600 hover:bg-teal-700 transition-all duration-200 mt-2 disabled:opacity-60"
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
                      ? 'bg-teal-600 text-white shadow-sm'
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
                      ? (activeRole === 'student' ? 'border-blue-600 text-blue-600' : 'border-teal-600 text-teal-600')
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
                      ? (activeRole === 'student' ? 'border-blue-600 text-blue-600' : 'border-teal-600 text-teal-600')
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
                    className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-250 mt-2 disabled:opacity-60 ${
                      activeRole === 'student' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>

                  {/* Google OAuth Button */}
                  <div className="mt-3 flex flex-col items-center justify-center">
                    <div className="w-full flex items-center gap-3 my-2.5">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Or Sign In With</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    <div id="google-signin-btn-modal" className="w-full flex justify-center"></div>
                  </div>
                </form>
              ) : (
                // ── REGISTRATION FORM ──────────────────────
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {activeRole === 'student' ? (
                    // Student fields
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
                            onChange={handleStudentRegisterChange}
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
                            onChange={handleStudentRegisterChange}
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
                          placeholder="e.g. Faculty of Engineering"
                          value={studentRegisterData.faculty}
                          onChange={handleStudentRegisterChange}
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
                          onChange={handleStudentRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </>
                  ) : (
                    // Organizer fields
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
                          onChange={handleOrganizerRegisterChange}
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
                          onChange={handleOrganizerRegisterChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-teal-500 transition-colors"
                        />
                      </div>
                    </>
                  )}

                  {/* Shared Registration fields (email, password) */}
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
                      onChange={activeRole === 'student' ? handleStudentRegisterChange : handleOrganizerRegisterChange}
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
                        onChange={activeRole === 'student' ? handleStudentRegisterChange : handleOrganizerRegisterChange}
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
                    className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-250 mt-2 disabled:opacity-60 ${
                      activeRole === 'student' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  {/* Google OAuth Button */}
                  <div className="mt-3 flex flex-col items-center justify-center">
                    <div className="w-full flex items-center gap-3 my-2.5">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Or Sign Up With</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    <div id="google-signin-btn-modal" className="w-full flex justify-center"></div>
                  </div>
                </form>
              )}
            </>
          )}
      </div>
    </div>
  );
};

export default AuthModal;
