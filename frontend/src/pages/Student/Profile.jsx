import { User, Mail, Phone, GraduationCap, Star, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const fields = [
    { icon: User,           label: 'Full Name',   value: user?.name      || '—' },
    { icon: Mail,           label: 'Email',        value: user?.email     || '—' },
    { icon: Phone,          label: 'Phone',        value: user?.phone     || '—' },
    { icon: GraduationCap,  label: 'Faculty',      value: user?.studentProfile?.faculty    || '—' },
    { icon: Star,           label: 'Skills',       value: user?.studentProfile?.skills     || '—' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-8 h-8 text-purple-500" /> My Profile
        </h1>
        <p className="text-gray-500 mt-1">Your volunteer account details</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-xl font-bold text-gray-800">{user?.name || 'Student'}</p>
          <p className="text-sm text-purple-500 font-medium capitalize">{user?.role || 'student'}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Edit3 className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Info fields */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 text-lg">Account Information</h2>
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-sm text-gray-700 mt-0.5 font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
