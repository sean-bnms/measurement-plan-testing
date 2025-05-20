import Badge from "./Badge";
import clsx from "clsx";

/**
 * Displays items in a responsive list view.
 *
 * @typedef {object} props
 * @property {object} props.item - The entity object (must include name and description).
 * @property {Object} [props.entityIcon] - Optional icon to illustrate the item, in the format { icon: Icon, color: "blue"|"green"|"yellow"|"red"|"grey"}
 * @property {Object} [props.category] - Optional Badge category, in the format {"label": label, "color": "blue"|"green"|"yellow"|"red"|"grey"}
 * @property {Array<{ Component: React.ElementType, props: Object }>} [props.buttons=[]] - Optional Item buttons.
 *
 * @returns {JSX.Element}
 */
export default function EntityItem({ item, entityIcon, category, buttons = [] }) {
  const { name, description } = item;

  const iconBaseClasses = "inline-flex items-center justify-center w-12 h-12 rounded-md";
  const iconVariants = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    gray: "bg-gray-100 text-gray-600",
  };

  const entityIconRender = entityIcon && (
    <div className={clsx(iconBaseClasses, iconVariants[entityIcon.color])}>
      <entityIcon.icon className="w-6 h-6" aria-hidden="true" />
    </div>
  );

  const categoryBadgeRender = category && (
    <Badge 
      label={category.label}
      variant={category.color}
    />
  );

  const entityDescriptionRender =  (<p className="text-sm text-gray-600 max-w-xl">{description}</p>);

  const entityNameRender = (<h3 className="text-md font-medium text-gray-900">{name}</h3>);

  const buttonsRender = buttons && (
    buttons.map((button, index) => (
      <button.Component key={index} {...button.props} />
    ))
  );

  return (
    <div className="p-4 mb-1 border bg-white border-gray-200 hover:bg-gray-50">
      <div className="grid md:grid-cols-[1fr_auto] gap-4 items-start">
        {/* LEFT SIDE: icon, text, badge, description */}
        <div className="flex items-start gap-3">
          { entityIconRender }
          <div className="flex-1">

            <div className="flex items-center flex-wrap gap-2 mb-2">
              { entityNameRender }
              { categoryBadgeRender }
            </div>

            { entityDescriptionRender }

            {/* BUTTONS: left aligned on mobile */}
            <div className="mt-3 flex gap-2 md:hidden">
              { buttonsRender }
            </div>
          </div>
        </div>

        {/* RIGHT SIDE BUTTONS (only visible on md+) */}
        <div className="hidden md:flex items-center justify-end gap-2">
          { buttonsRender }
        </div>
      </div>
    </div>
  );
}
