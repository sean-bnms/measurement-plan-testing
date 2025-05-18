import { clsx } from "clsx";

/**
 * Toggle switch input component
 *
 * @typedef {object} ToggleInputProps
 * @property {string} label - The label for the toggle
 * @property {boolean} checked - Controlled checked state
 * @property {Function} onChange - Function called when toggled
 * @property {boolean} [required] - Whether the field is required
 * @property {string} [description] - Optional help text
 * @property {string} [error] - Optional error message
 */
export default function ToggleInput({
  label,
  checked,
  onChange,
  required = false,
  description,
  error,
}) {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div>
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
            </label>
            {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
        </div>
        <button
          type="button"
          id={id}
          onClick={onChange}
          className={clsx(
            "relative inline-flex mr-1 h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none",
            checked ? "bg-blue-600 border-blue-600" : "bg-gray-200 border-gray-200"
          )}
          role="switch"
          aria-checked={checked}
        >
          <span
            className={clsx(
              "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
              checked ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
