import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';

const OrganizerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clubName: '',
    organizerId: '',
    contactNumber: '',
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

    // Client-side validation for phone number
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (formData.contactNumber && !phoneRegex.test(formData.contactNumber)) {
      setError('Contact number must be a valid phone number (7 to 20 characters).');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        role: 'organizer',
        clubName: formData.clubName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        password: formData.password,
      };
      await registerUser(payload);
      navigate('/login/organizer');
    } catch (err) {
      if (!err.response) {
        setError('Could not connect to backend server. Please ensure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        Create Your Account
      </h1>
      <p className="text-gray-500 text-base mb-8">
        Choose your role to get started
      </p>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md w-full
                      max-w-md px-8 py-8">

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Organizer Registration
          </h2>
          <button
            onClick={() => navigate('/register')}
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

          {/* Club/Organization Name */}
          <div>
            <label className="block text-sm font-medium
                              text-gray-700 mb-1">
              Club/Organization Name
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16
                     m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1
                     4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2
                     a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <input
                type="text"
                name="clubName"
                placeholder="IEEE Student Branch"
                value={formData.clubName}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm
                           text-gray-700 placeholder-gray-400
                           bg-transparent w-full"
              />
            </div>
          </div>


          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium
                              text-gray-700 mb-1">
              Contact Number
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498
                     4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042
                     11.042 0 005.516 5.516l1.13-2.257a1 1 0
                     011.21-.502l4.493 1.498a1 1 0 01.684.949V19
                     a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <input
                type="tel"
                name="contactNumber"
                placeholder="+1 (555) 123-4567"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm
                           text-gray-700 placeholder-gray-400
                           bg-transparent w-full"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium
                              text-gray-700 mb-1">
              Email
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
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
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
                       bg-gradient-to-r from-cyan-400 to-blue-500
                       hover:from-cyan-500 hover:to-blue-600
                       transition-all duration-200 mt-2
                       disabled:opacity-60
                       disabled:cursor-not-allowed">
            {loading ? 'Creating Account...' : 'Create Organizer Account'}
          </button>

        </form>
      </div>

      {/* Sign In Link */}
      <p className="mt-6 text-sm text-gray-500">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login/organizer')}
          className="text-blue-500 font-medium cursor-pointer
                     hover:underline">
          Sign In
        </span>
      </p>

    </div>
  );
};

export default OrganizerRegister;