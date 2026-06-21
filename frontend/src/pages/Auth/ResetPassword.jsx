import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, formData.newPassword);
      setSuccess('Password has been reset successfully. Please log in.');
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      if (!err.response) {
        setError('Could not connect to backend server. Please ensure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Invalid or expired reset token. Please request a new link.');
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
        Reset Password
      </h1>
      <p className="text-gray-500 text-base mb-8">
        Create a new secure password for your account
      </p>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md w-full
                      max-w-md px-8 py-8">

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Set New Password
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
        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 text-green-700 text-sm px-4
                            py-3 rounded-lg border border-green-200">
              {success}
            </div>
            <p className="text-xs text-gray-500 text-center animate-pulse">
              Redirecting you to the login page shortly...
            </p>
            <button
              onClick={() => navigate('/signin')}
              className="w-full py-3 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium
                                text-gray-700 mb-1">
                New Password
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
                       00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10
                       -10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="At least 6 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="flex-1 outline-none text-sm
                             text-gray-700 placeholder-gray-400
                             bg-transparent w-full"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium
                                text-gray-700 mb-1">
                Confirm Password
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
                       00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10
                       -10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>

          </form>
        )}

      </div>

    </div>
  );
};

export default ResetPassword;
