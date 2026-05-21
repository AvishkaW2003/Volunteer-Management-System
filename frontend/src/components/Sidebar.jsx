import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

/**
 * Sidebar — generic reusable sidebar shell.
 * Props:
 *   logo        — ReactNode (brand avatar / icon)
 *   brandName   — string
 *   navItems    — [{ to, icon: LucideComponent, label }]
 *   activeClass — Tailwind classes for active NavLink (default: cyan-blue gradient)
 *   hoverClass  — Tailwind classes for hover state
 *   onClose     — callback fired after a nav item click (for mobile overlay close)
 */
const Sidebar = ({
  logo,
  brandName  = 'VolunteerHub',
  navItems   = [],
  activeClass = 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-sm',
  hoverClass  = 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700',
  onClose,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 flex-shrink-0">
        {logo}
        <span className="font-bold text-gray-800 text-sm">{brandName}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-150 ${isActive ? activeClass : hoverClass}`
            }
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl
            text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
