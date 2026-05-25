import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, Building, ArrowRight } from 'lucide-react';
import { registerUser } from '../../services/authService';

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accessCode: '',
    name: '',
    department: '',
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

    if (!formData.department) {
      setError('Please select your department.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        role: 'admin',
        name: formData.name,
        accessCode: formData.accessCode,
        department: formData.department,
        email: formData.email,
        password: formData.password,
      };
      await registerUser(payload);
      alert('Admin registered successfully! Redirecting to login...');
      navigate('/login/admin');
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
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100 flex flex-col 
                    items-center justify-center px-4 py-10">

      {/* Page Heading */}
      <h1 className="text-4xl font-extrabold text-blue-900 mb-1 drop-shadow-sm tracking-tight text-center">
        Create Your Account
      </h1>
      <p className="text-gray-500 text-base mb-8 text-center font-medium">
        Choose your role to get started
      </p>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl w-full 
                      max-w-lg px-8 py-8 border border-gray-100/80">

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Admin Registration
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-blue-500 hover:text-blue-700 
                       font-semibold transition-colors">
            Change Role
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 
                          py-3 rounded-xl mb-4 border border-red-200 shadow-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Admin Access Code */}
          <div>
            <label className="block text-sm font-semibold 
                              text-gray-700 mb-1.5">
              Admin Access Code
            </label>
            <div className="flex items-center border border-gray-300
                            rounded-xl px-3.5 py-2.5 gap-3 
                            focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100
                            transition-all duration-150">
              <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                name="accessCode"
                placeholder="Enter admin access code"
                value={formData.accessCode}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm 
                           text-gray-700 placeholder-gray-400 
                           bg-transparent w-full"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold 
                              text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300
                            rounded-xl px-3.5 py-2.5 gap-3 
                            focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100
                            transition-all duration-150">
              <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                name="name"
                placeholder="Admin Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm 
                           text-gray-700 placeholder-gray-400 
                           bg-transparent w-full"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold 
                              text-gray-700 mb-1.5">
              Department
            </label>
            <div className="flex items-center border border-gray-300
                            rounded-xl px-3.5 py-2.5 gap-3 
                            focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100
                            transition-all duration-150 bg-white">
              <Building className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm text-gray-700 bg-transparent w-full cursor-pointer"
              >
                <option value="" disabled>Select Department</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Student Affairs">Student Affairs</option>
                <option value="Finance & Operations">Finance & Operations</option>
                <option value="Executive Administration">Executive Administration</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold 
                              text-gray-700 mb-1.5">
              Email
            </label>
            <div className="flex items-center border border-gray-300
                            rounded-xl px-3.5 py-2.5 gap-3 
                            focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100
                            transition-all duration-150">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="admin@university.edu"
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
            <label className="block text-sm font-semibold 
                              text-gray-700 mb-1.5">
              Password
            </label>
            <div className="flex items-center border border-gray-300
                            rounded-xl px-3.5 py-2.5 gap-3 
                            focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100
                            transition-all duration-150">
              <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
            className="w-full py-3 rounded-xl text-white font-bold
                       text-base bg-teal-400 hover:bg-teal-500 active:scale-[0.98]
                       transition-all duration-200 shadow-md hover:shadow-teal-400/20
                       mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

        </form>
      </div>

      {/* Sign In Link */}
      <p className="mt-6 text-sm text-gray-500 font-medium">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login/admin')}
          className="text-blue-500 font-bold cursor-pointer 
                     hover:underline transition-all">
          Sign In
        </span>
      </p>

    </div>
  );
};

export default AdminRegister;
