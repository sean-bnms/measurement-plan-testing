import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

/**
 * A reusable page header layout, to include an underlined return link on hover to a previous page.
 *
 * @param {Object} props
 * @param {string} props.backTo - Link to go back to.
 * @param {string} props.linkLabel - The label on the link.
 * @param {React.ReactNode} props.children - Content of the page, will come after the return link header.
 * @param {string} [props.color] - Color for the link back.
 */
export default function PageReturnLinkHeader({
  backTo,
  linkLabel,
  children,
  color="blue"
}) {

  const linkClasses = "inline-flex items-center hover:underline";
  const variants = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    gray: "btext-gray-600",
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <NavLink
          to={backTo}
          className={clsx(linkClasses, variants[color])}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>{linkLabel}</span>
        </NavLink>
      </div>

        {children}
    </div>
  );
}
