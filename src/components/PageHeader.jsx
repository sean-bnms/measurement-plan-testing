import Breadcrumbs from "./Breadcrumbs";
import Badge from "./Badge";

/**
 * A flexible and reusable page header for entity-based views. Actions and Milestones will appear on the right side of the component.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - The main title displayed on the page.
 * @param {string} [props.description] - Optional supporting text below the title.
 * @param {Array<{ label: string, to: string }>} [props.breadcrumbs=[]] - Navigation path items.
 * @param {Array<{ label: string, variant?: 'info' | 'success' | 'warning' | 'error' | 'default' }>} [props.badges=[]] - Badge elements shown next to the title.
 * @param {ReactDOM.Element} children - Can be used to display children on the right side (e.g. buttons, milestone tracker...)
 *
 * @returns {JSX.Element}
 */
export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  badges = [],
  children
}) {

  return (
    <div className="flex items-start justify-between">

      <div>
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
     
        <div className="flex items-center justify-start gap-2 flex-wrap mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {badges && badges.map((badge, i) => (
            <Badge key={i} label={badge.label} variant={badge.variant} />
          ))}
        </div>

        {description && (
          <p className="text-sm text-gray-600 mt-2 pb-6">{description}</p>
        )}
       </div>
      {children}
    </div>
  );
}

