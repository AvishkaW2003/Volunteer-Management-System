import { useState, useEffect } from 'react';
import { 
  Users, Search, ShieldCheck, GraduationCap, Briefcase, Trash2, 
  Edit, UserPlus, X, ChevronLeft, ChevronRight, Ban, CheckCircle, 
  Phone, Mail, Calendar, Hash, FolderOpen, Award, Filter
} from 'lucide-react';
import { 
  getAdminUsers, 
  deleteAdminUser, 
  createAdminUser, 
  updateAdminUser 
} from '../../services/adminService';

const roleIcon = { 
  student: GraduationCap, 
  organizer: Briefcase, 
  admin: ShieldCheck 
};

const roleBadge = {
  student: 'bg-teal-50 text-teal-700 border border-teal-200',
  organizer: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
  admin: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    department: '',
    status: 'active',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action will permanently remove their profile.')) {
      return;
    }
    try {
      await deleteAdminUser(id);
      setUsers(users.filter(user => user.id !== id));
      showToast('User deleted successfully.');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const actionText = newStatus === 'active' ? 'activate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${actionText} this user's account?`)) {
      return;
    }
    try {
      await updateAdminUser(user.id, { status: newStatus });
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      showToast(`User status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // blank by default on edit
      phone: user.phone || '',
      role: user.role || 'student',
      department: user.department || '',
      status: user.status || 'active',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'student',
      department: '',
      status: 'active',
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const validateForm = (isEdit = false) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!formData.department.trim()) {
      errors.department = formData.role === 'student' ? 'Faculty is required' : (formData.role === 'organizer' ? 'Club name is required' : 'Department is required');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    try {
      await createAdminUser(formData);
      setIsCreateModalOpen(false);
      showToast('User created successfully!');
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      alert(err.response?.data?.message || 'Failed to create user.');
    }
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    try {
      // Don't send empty password
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await updateAdminUser(selectedUser.id, payload);
      setIsEditModalOpen(false);
      showToast('User updated successfully!');
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.response?.data?.message || 'Failed to update user.');
    }
  };

  // Helper toast notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.studentId || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-8 h-8 text-teal-600" /> User Management
          </h1>
          <p className="text-slate-500 mt-1">Create, update, suspend, and manage all users on the platform.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all duration-200 font-medium"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-4 flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="flex-1 flex items-center gap-3 bg-teal-50/50 border border-teal-100 px-4 py-2 rounded-xl focus-within:border-teal-400 transition-colors">
          <Search className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, or Student ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 md:block hidden" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-white border border-teal-100 px-3 py-2 rounded-xl text-sm text-slate-600 outline-none focus:border-teal-400"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-teal-100 px-3 py-2 rounded-xl text-sm text-slate-600 outline-none focus:border-teal-400"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-50/50 border-b border-teal-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">User ID / Role</th>
                <th className="px-6 py-4">Faculty / Club</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Events Count</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map(user => {
                const Icon = roleIcon[user.role] || ShieldCheck;
                const isSuspended = user.status === 'suspended';
                const avatarSeed = encodeURIComponent(user.name || 'User');
                const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

                return (
                  <tr key={user.id} className="hover:bg-teal-50/10 transition-colors text-slate-700 text-sm">
                    {/* User Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={avatarUrl} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full border border-teal-100 bg-teal-50"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                          }}
                        />
                        <div>
                          <div className="font-semibold text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5" /> {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3.5 h-3.5" /> {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role / UserID Column */}
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${roleBadge[user.role] || 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {user.role}
                        </span>
                        <div className="text-xs text-slate-500 font-mono">
                          ID: {user.role === 'student' && user.studentId ? user.studentId : `USR-${user.id}`}
                        </div>
                      </div>
                    </td>

                    {/* Department/Faculty Column */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">{user.department || '—'}</span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Events Count */}
                    <td className="px-6 py-4 text-center font-semibold text-slate-800">
                      {user.eventsCount || 0}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isSuspended 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-red-600' : 'bg-green-600'}`}></span>
                        {isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 text-teal-600 hover:text-teal-800 rounded-lg hover:bg-teal-50 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSuspended 
                              ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                              : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                          }`}
                          title={isSuspended ? "Activate User" : "Suspend User"}
                        >
                          {isSuspended ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 bg-teal-50/5">
                    <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">No users match your criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-teal-50/20 px-6 py-4 flex items-center justify-between border-t border-teal-100">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-semibold text-slate-700">{filteredUsers.length}</span> users
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-teal-100 bg-white hover:bg-teal-50 disabled:opacity-50 text-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-all ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white border-transparent'
                      : 'bg-white border-teal-100 text-slate-600 hover:bg-teal-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-teal-100 bg-white hover:bg-teal-50 disabled:opacity-50 text-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-teal-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-5 text-white flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Add New User Account
              </h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dinithi Perera"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-slate-50 border ${formErrors.name ? 'border-red-400' : 'border-teal-100'} px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm`}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. dinithi@uni.lk"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-slate-50 border ${formErrors.email ? 'border-red-400' : 'border-teal-100'} px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm`}
                  />
                  {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 chars"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full bg-slate-50 border ${formErrors.password ? 'border-red-400' : 'border-teal-100'} px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm`}
                  />
                  {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +94771234567"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-teal-100 px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Account Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value, department: '' })}
                    className="w-full bg-slate-50 border border-teal-100 px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  {formData.role === 'student' ? 'Faculty (e.g. Faculty of Computing)' : (formData.role === 'organizer' ? 'Organization / Club Name' : 'Admin Department')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={formData.role === 'student' ? 'e.g. Faculty of Computing' : (formData.role === 'organizer' ? 'e.g. Rotaract Club' : 'e.g. IT Department')}
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full bg-slate-50 border ${formErrors.department ? 'border-red-400' : 'border-teal-100'} px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm`}
                />
                {formErrors.department && <p className="text-xs text-red-500 mt-1">{formErrors.department}</p>}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-medium text-sm shadow-sm transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-teal-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-5 text-white flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Edit className="w-5 h-5" /> Edit User Account
              </h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-slate-50 border ${formErrors.name ? 'border-red-400' : 'border-teal-100'} px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm`}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-slate-50 border ${formErrors.email ? 'border-red-400' : 'border-teal-100'} px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm`}
                  />
                  {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-teal-100 px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Account Role</label>
                  <select
                    value={formData.role}
                    disabled // Role changes are sensitive, disable to avoid profile mismatch
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-100 border border-teal-100 px-4 py-2.5 rounded-xl outline-none text-slate-500 text-sm cursor-not-allowed"
                  >
                    <option value="student">Student</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-teal-100 px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  {formData.role === 'student' ? 'Faculty (e.g. Faculty of Computing)' : (formData.role === 'organizer' ? 'Organization / Club Name' : 'Admin Department')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full bg-slate-50 border ${formErrors.department ? 'border-red-400' : 'border-teal-100'} px-4 py-2.5 rounded-xl outline-none focus:border-teal-400 transition-colors text-slate-700 text-sm`}
                />
                {formErrors.department && <p className="text-xs text-red-500 mt-1">{formErrors.department}</p>}
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-amber-800 text-xs flex gap-2">
                <Hash className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Note: To change user password, please delete and recreate the account, or instruct the user to use the reset service. Role changes are locked to preserve historical registrations.</span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-medium text-sm shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
