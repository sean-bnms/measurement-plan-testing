import clsx from "clsx";

/**
 * @typedef {Object} BadgeProps
 * @property {string} label - The text to display inside the badge.
 * @property {'blue' | 'purple' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'gray'} [variant]
 * @property {string} [className]
 */
export default function Badge({ label, variant = 'blue'}) {
  const baseClasses = "inline-block px-2 py-0.5 text-xs font-semibold rounded-full";
  const variants = {
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800",
    red: "bg-red-100 text-red-800",
    pink: "bg-pink-100 text-pink-800",
    gray: "bg-gray-100 text-gray-800",
    warning: "bg-red-50 text-red-700"
  };

  return (
    <span
      className={clsx(baseClasses, variants[variant])}
      role="status"
      aria-label={label}
    >
      {label}
    </span>
  );
}
