import clsx from "clsx";

/**
 * A flexible action button with support for icons, variants, sizes, and accessibility.
 *
 * @param {Object} props
 * @param {() => void} props.onClick - Click handler.
 * @param {React.ElementType} [props.Icon] - Optional icon component.
 * @param {string} props.label - Button text (used for accessibility even if hidden).
 * @param {'primary' | 'danger' | 'ghost'} [props.variant] - Visual style.
 * @param {'sm' | 'md' | 'lg'} [props.size] - Size of the button.
 * @param {boolean} [props.iconOnly] - Whether to visually hide the label (accessible via aria-label).
 */
export default function ActionButton({
  onClick,
  Icon,
  label,
  variant = "primary",
  size = "md",
  iconOnly = false
}) {
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const iconSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(baseClasses, sizeClasses[size], variants[variant])}
      aria-label={iconOnly ? label : undefined}
    >
      {Icon && (
        <Icon
          className={clsx(iconSizeClasses[size], { "mr-2": !iconOnly })}
          aria-hidden="true"
        />
      )}
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}

