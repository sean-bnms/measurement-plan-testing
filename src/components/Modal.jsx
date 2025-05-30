import ActionButton from "./ActionButton";


/**
 * A flexible and reusable modal, with title, description and action buttons.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal should be showing.
 * @param {string} props.title - The main title displayed on the modal.
 * @param {React.ElementType} [props.children] - The content expected in the modal.
 * @param {string} [props.description] - Optional supporting text below the title.
 * @param {string} [props.maxWidthClass] - Optional maximum width allowed for the modal.
 * @param {{ Component: React.ElementType, props: Object }} [props.closeButton] - Optional handler to pass if you want to include a top right close button.
 * @param {Array<{ Component: React.ElementType, props: Object }>} [props.actions=[]] - Optional Action buttons or elements rendered to the bottom.
 *
 * @returns {JSX.Element}
 */
export default function Modal({ 
    isOpen, 
    title, 
    description,
    children, 
    actions = [],
    maxWidthClass = "max-w-xl",
    closeButton
  }) {

    const renderActions = (
      actions.length > 0 && (
        <div className="flex justify-start gap-3" aria-label="Modal actions">
          {actions.map((action, i) => (
            <action.Component key={i} {...action.props} />
          ))}
        </div>
      )
    );

    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-gray-900/10 flex items-center justify-center">
        <div className={`bg-white py-6 px-10 rounded shadow-lg z-60 pointer-events-auto w-full ${maxWidthClass} max-h-lg`}>
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {closeButton && <closeButton.Component {...closeButton.props} />}
          </div>
          {description && <p className="text-md text-gray-600 mb-6">{description}</p>}
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {children}
          </div>
          {renderActions}
        </div>
      </div>
    );
  }

  