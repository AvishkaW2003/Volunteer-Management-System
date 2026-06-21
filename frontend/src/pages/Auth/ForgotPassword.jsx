import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await forgotPassword(email);
      setMessage(res.message || 'If an account exists, a password reset email has been sent.');
    } catch (err) {
      if (!err.response) {
        setError('Could not connect to backend server. Please ensure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col
                    items-center justify-center px-4 py-10 animate-fadeIn">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500
                        to-purple-600 rounded-xl flex items-center
                        justify-center">
          <svg xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10
                 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3
                 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283
                 .356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3
                 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-gray-800">
          VolunteerHub
        </span>
      </div>

      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Forgot Password
      </h1>
      <p className="text-gray-500 text-base mb-8">
        Reset your VolunteerHub account password
      </p>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md w-full
                      max-w-md px-8 py-8">

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Recover Password
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4
                          py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message ? (
          <div className="space-y-4">
            <div className="bg-green-50 text-green-700 text-sm px-4
                            py-3 rounded-lg border border-green-200">
              {message}
            </div>
            <p className="text-xs text-gray-500">
              Please check your inbox for instructions. If you are developing locally, you can also copy the generated reset URL directly from the backend console logs.
            </p>
            <button
              onClick={() => navigate('/signin')}
              className="w-full py-3 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-all duration-200"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium
                                text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center border border-gray-300
                              rounded-lg px-3 py-2 gap-2
                              focus-within:border-blue-400
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
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 outline-none text-sm
                             text-gray-700 placeholder-gray-400
                             bg-transparent w-full"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white
                         font-semibold text-base
                         bg-gradient-to-r from-blue-400 to-purple-500
                         hover:from-blue-500 hover:to-purple-600
                         transition-all duration-200 mt-2
                         disabled:opacity-60
                         disabled:cursor-not-allowed">
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </button>

          </form>
        )}

        {!message && (
          <>
            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">
                Remember your password?
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Link */}
            <button
              onClick={() => navigate('/signin')}
              className="w-full py-3 rounded-xl text-purple-500
                         font-semibold text-base border border-purple-300
                         hover:bg-purple-50 transition-all duration-200">
              Sign In
            </button>
          </>
        )}

      </div>

      {/* Link to Organizer Login */}
      <p className="mt-6 text-sm text-gray-500">
        Are you an organization?{' '}
        <span
          onClick={() => navigate('/login/organizer')}
          className="text-blue-500 font-medium cursor-pointer
                     hover:underline">
          Log in as an organizer
        </span>
      </p>

    </div>
  );
};

export default ForgotPassword;
