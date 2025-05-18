import { Info, ChevronDown } from "lucide-react";
import clsx from "clsx";

/**
 * A reusable dropdown/select component with optional label, error, and tooltip.
 *
 * @typedef {object} DropdownProps
 * @property {string} label - The label shown above the select field
 * @property {string} value - The current selected value
 * @property {Function} onChange - Function called when the selected option changes
 * @property {string[]} options - Array of option strings
 * @property {boolean} [required] - Whether the field is required
 * @property {string} [error] - Optional error message
 * @property {string} [tooltip] - Optional tooltip text
 */
export default function Dropdown({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  tooltip = "",
}) {
  const inputId = `dropdown-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="mb-4">
        {label && (
            <div className="flex items-center gap-1 group relative w-fit">
            <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {tooltip && (
                <div className="relative group">
                <Info
                    size={14}
                    className="text-gray-700 cursor-pointer"
                    aria-label="Help"
                />
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {tooltip}
                </div>
                </div>
            )}
            </div>
        )}

        <div className="relative">
            <select
                id={inputId}
                value={value ? value : ""}
                onChange={onChange}
                required={required}
                className={clsx(
                    "w-full px-3 pr-10 py-2 border rounded bg-white text-sm outline-none appearance-none focus:ring-2 focus:ring-blue-500",
                    error ? "border-red-500" : "border-gray-300"
                  )}
                aria-invalid={!!error}
            >
                <option value="" disabled>
                    Select a type...
                </option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
        </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
