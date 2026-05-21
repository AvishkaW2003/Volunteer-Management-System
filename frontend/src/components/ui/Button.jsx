/**
 * Button — variants: primary | secondary | ghost | destructive
 * size    — sm | md (default) | lg
 * Props:  variant, size, loading, icon, disabled, type, onClick, children, className
 */
const variantClass = {
  primary:
    'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-sm',
  secondary:
    'border border-cyan-200 text-cyan-600 hover:bg-cyan-50',
  ghost:
    'text-gray-400 hover:bg-gray-100 hover:text-gray-700',
  destructive:
    'text-gray-500 hover:bg-red-50 hover:text-red-500',
};

const sizeClass = {
  sm:  'px-3 py-1.5 text-xs rounded-lg',
  md:  'px-5 py-2.5 text-sm rounded-xl',
  lg:  'px-6 py-3   text-base rounded-xl w-full',
};

const Button = ({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  icon     = null,
  disabled = false,
  type     = 'button',
  onClick,
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 font-semibold
      transition-all duration-200
      disabled:opacity-60 disabled:cursor-not-allowed
      ${variantClass[variant]}
      ${sizeClass[size]}
      ${className}
    `}
  >
    {loading ? (
      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    ) : icon ? (
      <span className="flex-shrink-0">{icon}</span>
    ) : null}
    {children}
  </button>
);

export default Button;
