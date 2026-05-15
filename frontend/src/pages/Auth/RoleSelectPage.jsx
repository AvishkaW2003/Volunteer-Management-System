import { useNavigate } from 'react-router-dom';

const roles = [
  {
    key: 'student',
    label: 'Student',
    description: 'Join events, earn certificates, and build your volunteer reputation',
    gradient: 'from-blue-400 to-purple-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    path: '/register/student',
  },
  {
    key: 'organizer',
    label: 'Organizer',
    description: 'Create events, manage volunteers, and track attendance',
    gradient: 'from-green-400 to-teal-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 
             0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 
             2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 
             012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    path: '/register/organizer',
  },
  {
    key: 'admin',
    label: 'Admin',
    description: 'Manage users, approve events, and oversee the platform',
    gradient: 'from-orange-400 to-red-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 
             11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 
             10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    path: '/login/admin',
  },
];

const RoleSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-12 gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600
                        rounded-2xl flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-white"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 
                 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 
                 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 
                 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">VolunteerHub</h1>
        <p className="text-gray-500 text-lg">Choose your role to get started</p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {roles.map((role) => (
          <div
            key={role.key}
            onClick={() => navigate(role.path)}
            className="bg-white rounded-2xl p-10 flex flex-col items-center gap-6
                       cursor-pointer border border-gray-200 shadow-sm
                       hover:shadow-lg hover:border-blue-300 hover:-translate-y-1
                       transition-all duration-200"
          >
            {/* Icon */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.gradient}
                             flex items-center justify-center shadow-sm`}>
              {role.icon}
            </div>

            {/* Text */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {role.label}
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                {role.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RoleSelectPage;