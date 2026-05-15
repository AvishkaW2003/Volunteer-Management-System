import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    faculty: '',
    skills: '',
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
      // TODO: connect to backend API
      console.log('Student registered:', formData);
      navigate('/login/student');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
            Student Registration
          </h2>
          <button
            onClick={() => navigate('/')}
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

          {/* Full Name + Student ID */}
          <div className="grid grid-cols-2 gap-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium 
                                text-gray-700 mb-1">
                Full Name
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 
                       0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="flex-1 outline-none text-sm 
                             text-gray-700 placeholder-gray-400 
                             bg-transparent w-full"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium 
                                text-gray-700 mb-1">
                Student ID
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
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 
                       2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 
                       114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 
                       2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 
                       2M9 14a3.001 3.001 0 00-2.83 2" />
                </svg>
                <input
                  type="text"
                  name="studentId"
                  placeholder="STU123456"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="flex-1 outline-none text-sm 
                             text-gray-700 placeholder-gray-400 
                             bg-transparent w-full"
                />
              </div>
            </div>
          </div>

          {/* Faculty */}
          <div>
            <label className="block text-sm font-medium 
                              text-gray-700 mb-1">
              Faculty
            </label>
            <input
              type="text"
              name="faculty"
              placeholder="e.g. Faculty of Engineering"
              value={formData.faculty}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg 
                         px-3 py-2 text-sm text-gray-700 
                         placeholder-gray-400 outline-none 
                         focus:border-blue-400 transition-colors"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium 
                              text-gray-700 mb-1">
              Skills{' '}
              <span className="text-gray-400 font-normal">
                (comma separated)
              </span>
            </label>
            <input
              type="text"
              name="skills"
              placeholder="Leadership, Communication, Event Planning"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg 
                         px-3 py-2 text-sm text-gray-700 
                         placeholder-gray-400 outline-none 
                         focus:border-blue-400 transition-colors"
            />
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 
                     2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 
                     2 0 002 2z" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="you@university.edu"
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
            className="w-full py-3 rounded-xl text-white font-semibold 
                       text-base bg-gradient-to-r from-blue-500 
                       to-teal-400 hover:from-blue-600 
                       hover:to-teal-500 transition-all duration-200 
                       mt-2 disabled:opacity-60 
                       disabled:cursor-not-allowed">
            {loading ? 'Creating Account...' : 'Create Student Account'}
          </button>

        </form>
      </div>

      {/* Sign In Link */}
      <p className="mt-6 text-sm text-gray-500">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login/student')}
          className="text-blue-500 font-medium cursor-pointer 
                     hover:underline">
          Sign In
        </span>
      </p>

    </div>
  );
};

export default StudentRegister;