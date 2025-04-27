import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * @typedef {Object} Crumb
 * @property {string} label - The text for the breadcrumb.
 * @property {string} to - The route to navigate to.
 */

/**
 * @param {{ items: Crumb[] }} props
 */
export default function Breadcrumbs({ items }) {
  return (
    <nav className="text-sm text-gray-600 mb-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400" aria-hidden="true" />}
            <NavLink
              to={item.to}
              className={index == items.length - 1 ? "text-blue-600 font-medium" : "hover:underline"}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}
