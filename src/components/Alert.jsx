import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";

/**
 * Displays a static alert with optional close button.
 *
 * @typedef {object} AlertProps
 * @property {string} message - The message to display
 * @property {'info' | 'success' | 'warning' | 'error'} [type] - Alert type (defaults to info)
 * @property {boolean} [closable] - Whether the alert can be dismissed
 * @property {function} [onClose] - Called when alert is dismissed
 *
 * @param {AlertProps} props
 */
export default function Alert({ message, type = "info", closable = false, onClose }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const typeStyles = {
    success: "bg-green-100 border border-green-300 text-green-800",
    error: "bg-red-100 border border-red-300 text-red-800",
    info: "bg-blue-50 border border-blue-200 text-blue-800",
    warning: "bg-yellow-100 border border-yellow-300 text-yellow-800",
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-start space-x-2 px-4 py-3 rounded text-sm ${typeStyles[type]}`}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <span className="flex-1">{message}</span>
      {closable && (
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="ml-2 text-inherit hover:opacity-70"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
