import { X, Info } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

/**
 * MultiInput - Input with tags/badges
 * 
 * @typedef {object} Props
 * @property {string[]} values - Current list of values
 * @property {(updated: string[]) => void} onChange - Update callback
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {boolean} [required]
 * @property {string} [error]
 * @property {string} [tooltip] - Optional text to display in tooltip to help users fill the input field
 */
export default function MultiInput({
  values,
  onChange,
  label,
  placeholder = "Type and press Enter",
  required = false,
  error = "",
  tooltip = null
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInputValue("");
  };

  const handleRemove = (indexToRemove) => {
    const updated = values.filter((_, index) => index !== indexToRemove);
    onChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="mb-4">
        {label && (
            <div className="flex items-center gap-2 mb-1 group relative w-fit">
            <label className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            { tooltip ?
                <>
                    <Info
                        size={14}
                        className="text-gray-700 cursor-pointer"
                        aria-label="Help"
                    />

                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {tooltip}
                    </div>
                </>
                : null
            }
            </div>
        )}

        <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAdd}
            className={clsx(
            "w-full bg-white border rounded px-3 py-1 text-sm outline-none",
            error ? "border-red-500" : "border-gray-300",
            "focus:ring-2 focus:ring-blue-500"
            )}
            aria-invalid={!!error}
        />

        {/* Display tags */}
        <div className="mt-2 flex flex-wrap gap-2">
            {values.map((val, index) => (
            <span
                key={index}
                className="inline-flex items-center bg-blue-100 text-blue-700 text-sm rounded-full px-3 py-0.5"
            >
                {val}
                <button
                onClick={() => handleRemove(index)}
                className="ml-2 text-blue-500 hover:text-blue-700"
                aria-label={`Remove ${val}`}
                >
                <X size={14} />
                </button>
            </span>
            ))}
        </div>

        {error && (
            <p className="text-sm text-red-500 mt-1">
            {error}
            </p>
        )}
    </div>
  );
}
