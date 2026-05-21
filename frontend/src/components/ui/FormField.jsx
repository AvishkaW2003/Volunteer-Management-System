/**
 * FormField — label + required marker + hint text wrapper for any input.
 * Props: label, required, hint, children
 */
const FormField = ({ label, required = false, hint = '', children }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

export default FormField;
