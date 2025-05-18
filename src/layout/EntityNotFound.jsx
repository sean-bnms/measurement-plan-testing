import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * A fallback UI component displayed when a specific entity is not found.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.entity - The name of the entity that was not found (e.g., "Journey", "Template").
 * @param {string} props.redirectPath - The path to navigate back to a relevant page.
 * @param {string} props.redirectLabel - The label for the navigation link.
 *
 * @example
 * <EntityNotFound
 *   entity="Journey"
 *   redirectPath="/journeys"
 *   redirectLabel="Back to Journeys"
 * />
 */
export default function EntityNotFound({
  entity,
  redirectPath,
  redirectLabel,
}) {
  return (
    <div className="text-center text-gray-600 mt-12 max-w-6xl">
        
        <span className="text-blue-600">404</span>
        <h2 className="text-xl font-semibold">{entity} not found</h2>
        <p className="text-sm mt-2 mb-6">
            We couldn't find the {entity.toLowerCase()} you're looking for.
        </p>

        <NavLink
            to={redirectPath}
            className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
        >
            <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
            {redirectLabel}
        </NavLink>
    </div>
  );
}
