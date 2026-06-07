import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
const ROLES = [
  {
    key: 'student',
    label: 'Student',
    gradient: 'from-blue-400 to-purple-500',
    activeBg: 'bg-gradient-to-r from-blue-400 to-purple-500',
    ring: 'focus:ring-blue-300',
    btnClass: 'from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    redirect: '/student/dashboard',
    registerPath: '/register/student',
  },
  {
    key: 'organizer',
    label: 'Organizer',
    gradient: 'from-cyan-400 to-blue-500',
    activeBg: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    ring: 'focus:ring-cyan-300',
    btnClass: 'from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    redirect: '/organizer/dashboard',
    registerPath: '/register/organizer',
  },
  {
    key: 'admin',
    label: 'Admin',
    gradient: 'from-[#14B8A6] to-[#6EE7D8]',
    activeBg: 'bg-gradient-to-r from-[#14B8A6] to-[#6EE7D8]',
    ring: 'focus:ring-teal-300',
    btnClass: 'from-[#14B8A6] to-[#6EE7D8] hover:from-teal-600 hover:to-teal-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    redirect: '/admin/dashboard',
    registerPath: null,
  },
];