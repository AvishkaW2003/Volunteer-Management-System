import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const VARIANT_MAP = {
  success: {
    wrapper: 'bg-green-50 border-green-200 text-green-700',
    icon:    CheckCircle,
  },
  error: {
    wrapper: 'bg-red-50 border-red-200 text-red-600',
    icon:    XCircle,
  },
  warning: {
    wrapper: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    icon:    AlertCircle,
  },
  info: {
    wrapper: 'bg-blue-50 border-blue-200 text-blue-600',
    icon:    Info,
  },
};

/**
 * Alert — coloured notice banner.
 * Props: variant (success | error | warning | info), message, className
 */
const Alert = ({ variant = 'info', message, className = '' }) => {
  const { wrapper, icon: Icon } = VARIANT_MAP[variant] ?? VARIANT_MAP.info;

  return (
    <div className={`flex items-start gap-2.5 border rounded-xl px-4 py-3 text-sm
      font-medium ${wrapper} ${className}`}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
};

export default Alert;
