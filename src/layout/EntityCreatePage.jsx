import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * A reusable page layout for creating any entity.
 *
 * @typedef {object} EntityCreatePageProps
 * @property {string} title The name of the entity type (e.g. "Template", "Product")
 * @property {string} backLinktTo The route to be redirected with the top left navigation link
 * @property {React.ReactNode} children Content to render within the view
 * @param {EntityCreatePageProps} props
 */
export default function EntityCreatePage(props) {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <NavLink
          to={props.backLinktTo}
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to {props.title}s</span>
        </NavLink>
      </div>

      <div className="bg-gray-50 p-4 rounded shadow-sm">
        {props.children}
      </div>
    </div>
  );
}
