/**
 * InputField — icon-prefixed input with label, focus ring, and optional error.
 * Props: label, icon, name, type, placeholder, value, onChange,
 *        required, error, hint, focusColor, className
 */
const InputField = ({
  label,
  icon       = null,
  name,
  type       = 'text',
  placeholder = '',
  value,
  onChange,
  required   = false,
  error      = '',
  hint       = '',
  focusColor = 'cyan',   // 'cyan' | 'purple' | 'indigo'
  className  = '',
  ...rest
}) => {
  const ring = {
    cyan:   'focus-within:border-cyan-400   focus-within:ring-2 focus-within:ring-cyan-100',
    purple: 'focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100',
    indigo: 'focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100',
  }[focusColor] ?? 'focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-gray-50
        transition-all ${error ? 'border-red-300' : `border-gray-200 ${ring}`}`}>
        {icon && (
          <span className="text-gray-400 flex-shrink-0 w-4 h-4 flex items-center">{icon}</span>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent w-full"
          {...rest}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
};

export default InputField;
