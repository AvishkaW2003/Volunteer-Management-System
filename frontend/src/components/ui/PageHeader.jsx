/**
 * PageHeader — title + subtitle row with optional right-side action slot.
 * Props: title, subtitle, action (ReactNode)
 */
const PageHeader = ({ title, subtitle = '', action = null }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="self-start sm:self-auto">{action}</div>}
  </div>
);

export default PageHeader;
