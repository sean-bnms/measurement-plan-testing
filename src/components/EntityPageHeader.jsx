import Breadcrumbs from "./Breadcrumbs";
import Badge from "./Badge";

/**
 * A flexible and reusable page header for entity-based views.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - The main title displayed on the page.
 * @param {string} [props.description] - Optional supporting text below the title.
 * @param {Array<{ label: string, to: string }>} [props.breadcrumbs=[]] - Navigation path items.
 * @param {Array<{ label: string, variant?: 'info' | 'success' | 'warning' | 'error' | 'default' }>} [props.badges=[]] - Badge elements shown next to the title.
 * @param {Array<{ Component: React.ElementType, props: Object }>} [props.actions=[]] - Action buttons or elements rendered to the right.
 * @param {string} [props.actionsPosition] - Optional indication whether action buttons should be on the top 'right' of the header or on the 'bottom' of the header, left aligned after the description text
 *
 * @returns {JSX.Element}
 */
export default function EntityPageHeader({
  title,
  description,
  breadcrumbs = [],
  actions = [],
  badges = [],
  actionsPosition= "right",
}) {

  const renderActions = (
    actions.length > 0 && (
      <div className="flex-shrink-0 flex gap-2" aria-label="Header actions">
        {actions.map((action, i) => (
          <action.Component key={i} {...action.props} />
        ))}
      </div>
    )
  );

  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
      <div className="flex-1 min-w-0 max-w-2xl">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

        <div className="flex items-center gap-2 flex-wrap mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {badges && badges.map((badge, i) => (
            <Badge key={i} label={badge.label} variant={badge.variant} />
          ))}
        </div>

        {description && (
          <p className="text-sm text-gray-600 mt-2 mb-4">{description}</p>
        )}

        {actionsPosition == "bottom" ? renderActions : null}
      </div>

      {actionsPosition == "right" ? renderActions : null}
    </div>
  );
}

