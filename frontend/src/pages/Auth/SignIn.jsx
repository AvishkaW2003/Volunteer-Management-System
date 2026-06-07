import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  {
    key: 'student',
    label: 'Student',
    gradient: 'from-blue-400 to-purple-500',
    activeBg: 'bg-gradient-to-r from-blue-400 to-purple-500',
    ring: 'focus:ring-blue-300',
    btnClass: 'from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    redirect: '/student/dashboard',
    registerPath: '/register/student',
  },
  {
    key: 'organizer',
    label: 'Organizer',
    gradient: 'from-cyan-400 to-blue-500',
    activeBg: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    ring: 'focus:ring-cyan-300',
    btnClass: 'from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    redirect: '/organizer/dashboard',
    registerPath: '/register/organizer',
  },
  {
    key: 'admin',
    label: 'Admin',
    gradient: 'from-[#14B8A6] to-[#6EE7D8]',
    activeBg: 'bg-gradient-to-r from-[#14B8A6] to-[#6EE7D8]',
    ring: 'focus:ring-teal-300',
    btnClass: 'from-[#14B8A6] to-[#6EE7D8] hover:from-teal-600 hover:to-teal-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    redirect: '/admin/dashboard',
    registerPath: null, // Admin has no self-registration
  },
];
const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const role = ROLES.find((r) => r.key === selectedRole);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleSwitch = (key) => {
    setSelectedRole(key);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser({ email: formData.email, password: formData.password });

      // Verify the account role matches the selected tab
      if (data.user.role !== selectedRole) {
        setError(
          `This account is registered as "${data.user.role}". Please select the "${data.user.role}" tab.`
        );
        return;
      }

      login(data.user, data.token);
      navigate(role.redirect);
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 ' +
    'placeholder-gray-400 bg-gray-50 outline-none transition-all ' +
    'focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline mb-7">
        <div className={`w-10 h-10 bg-gradient-to-br ${role.gradient}
                         rounded-xl flex items-center justify-center shadow-md transition-all duration-300`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7
                 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0
                 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-800">VolunteerHub</span>
      </Link>

      {/* Heading */}
      <h1 className="mb-1 text-3xl font-bold text-gray-800">Welcome Back</h1>
      <p className="text-sm text-gray-500 mb-7">Sign in to continue to your dashboard</p>

      {/* Card */}
      <div className="w-full max-w-md overflow-hidden bg-white shadow-lg rounded-2xl">

        {/* Role Tab Selector */}
        <div className="flex border-b border-gray-100">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => handleRoleSwitch(r.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold
                          transition-all duration-200
                          ${selectedRole === r.key
                            ? `${r.activeBg} text-white shadow-inner`
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
            >
              {r.icon}
              {r.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-8 py-7">

          {error && (
            <div className="px-4 py-3 mb-5 text-sm leading-relaxed text-red-600 border border-red-100 bg-red-50 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <span className="text-xs text-blue-500 cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold text-sm
                          bg-gradient-to-r ${role.btnClass}
                          transition-all duration-200 mt-1 shadow-sm
                          hover:shadow-md hover:-translate-y-0.5
                          disabled:opacity-60 disabled:cursor-not-allowed
                          disabled:transform-none`}
            >
              {loading ? 'Signing in…' : `Sign in as ${role.label}`}
            </button>

          </form>

          {/* Register link — not shown for admin */}
          {role.registerPath && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">New here?</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <button
                onClick={() => navigate('/get-started')}
                className="w-full py-2.5 rounded-xl text-gray-600 font-semibold text-sm
                           border border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                Create an Account
              </button>
            </>
          )}

        </div>
      </div>

      {/* Back to home */}
      <p className="mt-6 text-sm text-gray-400">
        <Link to="/" className="font-medium text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </p>

    </div>
  );
};

export default SignIn;
