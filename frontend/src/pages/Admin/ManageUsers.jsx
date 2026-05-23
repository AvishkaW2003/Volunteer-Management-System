import { useState } from 'react';
import { Users, Search, ShieldCheck, GraduationCap, Briefcase, MoreVertical } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: 'Alice Johnson',   email: 'alice@uni.edu',   role: 'student',   status: 'Active' },
  { id: 2, name: 'Bob Smith',       email: 'bob@uni.edu',     role: 'organizer', status: 'Active' },
  { id: 3, name: 'Carol Davis',     email: 'carol@uni.edu',   role: 'student',   status: 'Inactive' },
  { id: 4, name: 'David Lee',       email: 'david@uni.edu',   role: 'organizer', status: 'Active' },
];

const roleIcon = { student: GraduationCap, organizer: Briefcase, admin: ShieldCheck };
const roleBadge = {
  student:   'bg-blue-100 text-blue-700',
  organizer: 'bg-cyan-100 text-cyan-700',
  admin:     'bg-indigo-100 text-indigo-700',
};

const ManageUsers = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_USERS.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) ||
         u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-8 h-8 text-indigo-500" /> User Management
          </h1>
          <p className="text-gray-500 mt-1">View and manage all platform users</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search users by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Name', 'Email', 'Role', 'Status', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(user => {
              const Icon = roleIcon[user.role];
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{user.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadge[user.role]}`}>
                      <Icon className="w-3 h-3" /> {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">No users match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
