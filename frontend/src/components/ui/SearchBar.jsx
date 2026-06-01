import { Search } from 'lucide-react';

/**
 * SearchBar — search icon + input with focus ring.
 * Props: value, onChange, placeholder, focusColor, className
 */
const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search…',
  focusColor  = 'cyan',
  className   = '',
}) => {
  const ring = {
    cyan:   'focus-within:border-cyan-400   focus-within:ring-2 focus-within:ring-cyan-100',
    purple: 'focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100',
    indigo: 'focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100',
  }[focusColor] ?? 'focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100';

  return (
    <div className={`flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2
      bg-gray-50 transition-all ${ring} ${className}`}>
      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
      />
    </div>
  );
};

export default SearchBar;
