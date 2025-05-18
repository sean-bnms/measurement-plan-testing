import clsx from "clsx";

/**
 * A reusable textarea component with optional label, error, and icon.
 *
 * @typedef {object} TextareaProps
 * @property {string} label - The label shown above the textarea
 * @property {string} placeholder - Placeholder text
 * @property {string} value - Controlled input value
 * @property {Function} [onChange] - onChange handler
 * @property {string} [error] - Optional error message
 * @property {boolean} [required] - Whether the field is required
 * @property {string} [className] - Extra classes to pass to the textarea
 * @property {number} [rows] - Number of rows (default: 4)
 * @property {string} [ariaLabel] - Optional ARIA label for screen readers
 * @param {TextareaProps}
 */
export default function Textarea({
  label,
  placeholder = "",
  value,
  onChange,
  error,
  required = false,
  className = "",
  rows = 4,
  ariaLabel,
}) {

  function toCamelCase(label) {
    return label
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");
  }

  const inputId = `textarea-${toCamelCase(label)}`;

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

      <textarea
        id={inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={clsx(
          "w-full p-2 border rounded bg-white text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
