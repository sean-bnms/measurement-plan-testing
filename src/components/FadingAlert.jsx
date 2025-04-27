import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

/**
 * Displays an alert which fades in and out.
 *
 * @typedef {object} FadingAlertProps
 * @property {string} message Contains the message for the alert
 * @property {string} [type] Type of alert, valid values are info, success, warning, error. Default is info.
 * @property {string} [duration] How long the alert should be shown, default value is 3000ms 
 * @property {Icon} [transitionDuration] How long the fade in-out transition lasts, default value is 500ms
 * @property {function} [onUnmount] Callback to update on the rendering status of the alert banner
 *
 * @param {FadingAlertProps} props
 * @returns {JSX.Element}
 */
export default function FadingAlert(props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Trigger fade-in
        const alertDuration = props.duration ? props.duration : 3000;
        const hideTimeout = setTimeout(() => setVisible(false), alertDuration); // Trigger fade-out

        const alertTransitionDuration = props.transitionDuration ? props.transitionDuration : 500;
        const removeTimeout = setTimeout(() => props.onUnmount(), alertDuration + alertTransitionDuration); // Handles unmounting the component

        return () => {
            clearTimeout(hideTimeout);
            clearTimeout(removeTimeout);
        };
    }, [props.duration, props.transitionDuration]);

    const baseStyles = `px-4 py-3 rounded mb-4 transition-opacity ease-in-out flex items-center space-x-2 text-sm`;

    const typeStyles = {
        success: "bg-green-100 border border-green-300 text-green-800",
        error: "bg-red-100 border border-red-300 text-red-800",
        info: "bg-blue-100 border border-blue-300 text-blue-800",
        warning: "bg-yellow-100 border border-yellow-300 text-yellow-800",
    };

    const iconTypes = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle,
    };

    const durationStyles = {
        300: "duration-300",
        500: "duration-500",
        700: "duration-700",
    };

    const durationClass = props.transitionDuration ? durationStyles[props.transitionDuration] : "duration-500";
    const typeClass = props.type? typeStyles[props.type] : "bg-blue-100 border border-blue-300 text-blue-800";
    const Icon = props.type ? iconTypes[props.type] : iconTypes["info"];

    const finalClassName = `${baseStyles} ${typeClass} ${durationClass} ${visible ? "opacity-100" : "opacity-0"}`;

    return (
    <div className={finalClassName}>
        <Icon className="w-4 h-4" aria-hidden="true" />
        <span>{props.message}</span>
    </div>
    );
}
