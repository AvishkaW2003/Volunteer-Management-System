import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const OrganizerLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      if (data.user.role !== 'organizer') {
        setError('Access denied. Please use the student login page.');
        return;
      }
      login(data.user, data.token);
      navigate('/organizer/dashboard');
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col
                    items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <img src="/images/logo.png" alt="VolunteerHub" className="w-9 h-9 rounded-xl object-cover" />
        <span className="text-lg font-bold text-gray-800">
          VolunteerHub
        </span>
      </div>

      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Welcome Back
      </h1>
      <p className="text-gray-500 text-base mb-8">
        Sign in to your organizer account
      </p>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md w-full
                      max-w-md px-8 py-8">

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br
                            from-cyan-400 to-blue-500
                            rounded-lg flex items-center
                            justify-center">
              <svg xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0
                     01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2
                     a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2
                     -2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2
                     0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012
                     -2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0
                     01-2-2v-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Organizer Login
            </h2>
          </div>
          <button
            onClick={() => navigate('/signin')}
            className="text-sm text-blue-500 hover:text-blue-600
                       font-medium transition-colors">
            Change Role
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4
                          py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium
                              text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-300
                            rounded-lg px-3 py-2 gap-2
                            focus-within:border-cyan-400
                            transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14
                     a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2
                     2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="club@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm
                           text-gray-700 placeholder-gray-400
                           bg-transparent w-full"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium
                              text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300
                            rounded-lg px-3 py-2 gap-2
                            focus-within:border-cyan-400
                            transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
                     00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10
                     -10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm
                           text-gray-700 placeholder-gray-400
                           bg-transparent w-full"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right mt-1">
              <span className="text-xs text-blue-500
                               cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white
                       font-semibold text-base
                       bg-gradient-to-r from-cyan-400 to-blue-500
                       hover:from-cyan-500 hover:to-blue-600
                       transition-all duration-200 mt-2
                       disabled:opacity-60
                       disabled:cursor-not-allowed">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">
            Don't have an account?
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Register Link */}
        <button
          onClick={() => navigate('/register/organizer')}
          className="w-full py-3 rounded-xl text-cyan-500
                     font-semibold text-base border border-cyan-300
                     hover:bg-cyan-50 transition-all duration-200">
          Create Organizer Account
        </button>

      </div>

      {/* Back to Role Select */}
      <p className="mt-6 text-sm text-gray-500">
        Not an organizer?{' '}
        <span
          onClick={() => navigate('/signin')}
          className="text-blue-500 font-medium cursor-pointer
                     hover:underline">
          Choose a different role
        </span>
      </p>

    </div>
  );
};

export default OrganizerLogin;