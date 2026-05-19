/**
 * StatCard — gradient card with icon, value, and label.
 * Props: label, value, icon (Lucide component), gradient (Tailwind from-X to-Y string)
 */
const StatCard = ({
  label,
  value,
  icon: Icon,
  gradient = 'from-cyan-400 to-blue-500',
}) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white`}>
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        {Icon && <Icon className="w-5 h-5 text-white" />}
      </div>
      <span className="text-3xl font-bold">{value}</span>
    </div>
    <p className="text-white/80 text-sm font-medium">{label}</p>
  </div>
);

export default StatCard;
