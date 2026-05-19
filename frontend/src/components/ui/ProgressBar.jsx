/**
 * ProgressBar — thin horizontal bar with animated fill.
 * Props: value (0–100), colorClass (Tailwind bg-* class), className
 */
const ProgressBar = ({
  value      = 0,
  colorClass = 'bg-cyan-500',
  className  = '',
}) => (
  <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
    <div
      className={`h-full ${colorClass} rounded-full transition-all duration-300`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export default ProgressBar;
