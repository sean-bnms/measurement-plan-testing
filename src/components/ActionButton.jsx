import clsx from "clsx";

/**
 * A flexible action button with support for icons, variants, sizes, and accessibility.
 *
 * @param {Object} props
 * @param {() => void} [props.onClick] - Click handler.
 * @param {React.ElementType} [props.Icon] - Optional icon component.
 * @param {string} props.label - Button text (used for accessibility even if hidden).
 * @param {'primary' | 'danger' | 'ghost' | 'secondary' | 'link'} [props.variant] - Visual style.
 * @param {'sm' | 'md' | 'lg'} [props.size] - Size of the button.
 * @param {boolean} [props.iconOnly] - Whether to visually hide the label (accessible via aria-label).
 * @param {string} [props.type] - Whether the html button has a specific type (e.g. 'submit' for form buttons)
 * @param {string} [props.roundedCornerClass] - Optional tailwind css class to modify the look of the rounded corners of the button
 */
export default function ActionButton({
  onClick,
  Icon,
  label,
  variant = "primary",
  size = "md",
  iconOnly = false,
  type = "button",
  roundedCornerClass="rounded-md"
}) {
  const sizeClasses = {
    sm: variant === "link" || variant === "ghost" ? "pr-2.5 py-1.5 text-xs" : "px-2.5 py-1.5 text-xs",
    md: variant === "link" || variant === "ghost" ? "pr-4 py-1.5 text-sm" : "px-4 py-2 text-sm",
    lg: variant === "link" || variant === "ghost" ? "pr-5 py-1.5 text-base" : "px-5 py-2.5 text-base"
  };

  const iconSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  };

  const iconOnlySizeClasses = {
    sm: "p-1.5 text-xs",
    md: "p-1.5 text-sm",
    lg: "p-1.5 text-base",
    xl: "p-1.5 text-xl"
  }

  const baseClasses = `inline-flex items-center cursor-pointer justify-center ${roundedCornerClass} font-medium`;
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    link: "bg-transparent text-blue-700 hover:bg-gray-100",
    close: "bg-transparent text-gray-700 hover:text-red-700",
    chevron: "bg-transparent text-gray-700 hover:text-blue-500"
  };

  return (
    <button
      type={type}
      onClick={onClick? onClick : null}
      className={iconOnly ? clsx(baseClasses, iconOnlySizeClasses[size], variants[variant]) : clsx(baseClasses, sizeClasses[size], variants[variant])}
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

