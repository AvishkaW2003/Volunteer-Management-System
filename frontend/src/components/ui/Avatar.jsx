/**
 * Avatar — circle with first initial of a name.
 * Props: name, size (sm | md | lg), bgClass, textClass
 */
const SIZE_MAP = {
  sm: { outer: 'w-7 h-7',  text: 'text-xs' },
  md: { outer: 'w-9 h-9',  text: 'text-sm' },
  lg: { outer: 'w-14 h-14', text: 'text-xl' },
};

const Avatar = ({
  name      = '?',
  size      = 'sm',
  bgClass   = 'bg-cyan-100',
  textClass = 'text-cyan-600',
  rounded   = 'rounded-full',
}) => {
  const { outer, text } = SIZE_MAP[size] ?? SIZE_MAP.sm;
  const initial = name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div className={`${outer} ${bgClass} ${rounded} flex items-center justify-center flex-shrink-0`}>
      <span className={`${text} font-bold ${textClass}`}>{initial}</span>
    </div>
  );
};

export default Avatar;
