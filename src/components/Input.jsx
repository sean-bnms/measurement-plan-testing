import clsx from "clsx";

/**
 * A reusable input component with optional label, error, and icon.
 *
 * @typedef {object} InputProps
 * @property {string} label - The label shown above the input
 * @property {string} placeholder - Placeholder text
 * @property {string} value - Controlled input value
 * @property {Function} [onChange] - onChange handler
 * @property {string} [type] - The HTML input type (default: "text")
 * @property {React.ReactNode} [icon] - Optional icon component (e.g. lucide icon)
 * @property {'left' | 'right'} [iconPosition] - Position of the icon (default: left)
 * @property {string} [error] - Optional error message
 * @property {boolean} [required] - Whether the field is required
 * @property {string} [className] - Extra classes to pass to the input
 * @property {string} [ariaLabel] - Optional ARIA label for screen readers
 * @param {InputProps} 
 */
export default function Input({
  label,
  type = "text",
  placeholder = "",
  icon = null,
  iconPosition = "left",
  value,
  onChange,
  error,
  required = false,
  className = "",
  ariaLabel,
}) {

  // handles automatic creation of input id
  function toCamelCase(label) {
    return label
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "") // Remove all non-alphanumeric characters except space
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, ""); // Remove all remaining spaces
  }
  const inputId = `input-${toCamelCase(label)}`;
  

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={clsx(
          "flex items-center border rounded px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-blue-500",
          error ? "border-red-500" : "border-gray-300"
        )}
      >
        {icon && iconPosition === "left" && (
          <div className="mr-2 text-gray-400" aria-hidden="true">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={clsx(
            "w-full outline-none bg-transparent text-sm",
            icon && iconPosition === "right" ? "pr-8" : "",
            className
          )}
          aria-label={ariaLabel || label}
          aria-invalid={!!error}
        />

        {icon && iconPosition === "right" && (
          <div className="ml-2 text-gray-400" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
