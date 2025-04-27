import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function NavigationButton({
  navigateTo,
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
    <NavLink
      to={navigateTo}
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
    </NavLink>
  );
}
