import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import EntityDeletionModal from "../components/EntityDeletionModal";
import PageHeader from "../components/PageHeader";
import NavigationButton from "../components/NavigationButton";
import ActionButton from "../components/ActionButton";

/**
 * A generic page component for rendering the detailed view of an entity.
 * 
 * This component is reusable for any kind of entity (e.g., templates, journeys),
 * and handles fetching, displaying, and basic actions like edit/delete.
 * 
 * It also includes logic for showing a 404-like screen if the entity is not found,
 * and renders a loading state while the data is being fetched.
 * 
 * @component
 * 
 * @param {Object} props
 * @param {string} props.id - The ID of the entity to fetch and display.
 * @param {Function} props.deleteEntityById - Callback to trigger when the delete action is invoked.
 * @param {Object} props.entityRoutingParams - Routing and metadata config for the entity.
 * @param {string} props.entityRoutingParams.name - The entity name (e.g., "template").
 * @param {string} props.entityRoutingParams.path - Base path for navigation (e.g., "/templates").
 * @param {string} props.entityRoutingParams.collectionName - Collection label (e.g., "Templates").
 * @param {Object} props.entityHeaderParams - Routing and metadata config for the entity.
 * @param {string} props.entityHeaderParams.name - The entity item name (e.g., "Product Added").
 * @param {string} [props.entityHeaderParams.category] - The entity item category
 * @param {string} props.children - Additional content for the page, to come below the page header
 */
export default function EntityViewPage({ id, deleteEntityById, entityRoutingParams, entityHeaderParams, children }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const navigate = useNavigate();
  const entityPath = `${entityRoutingParams.path}/${id}`;

  // function handlers
  function handleDeleteRequest() {
    setShowConfirmationModal(true);
  };

  function handleDelete() {
    deleteEntityById(id);
    navigate(entityRoutingParams.path, { replace: true });
  }

  const actions = [
    {Component: NavigationButton, props: {navigateTo: `${entityPath}/edit`, label: "Edit", Icon: Pencil, variant: "primary"}},
    {Component: ActionButton, props: {onClick: handleDeleteRequest, label: "Delete", Icon: Trash2, variant: "danger"}}
  ];

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
    <>
      <div className={`relative ${showConfirmationModal ? 'pointer-events-none blur-sm' : ''}`}>
        <div className="sticky top-0 z-20 bg-white px-8 py-6 w-full border-b-2 border-gray-300 h-32">
          <PageHeader 
              title={entityHeaderParams.name}
              breadcrumbs={[{ label: entityRoutingParams.collectionName, to: entityRoutingParams.path }, { label: "Details", to: entityPath }]}
              badges={entityHeaderParams.category ? [{label: entityHeaderParams.category.label, variant: entityHeaderParams.category.color}] : null}
          >
            {renderActions}
          </PageHeader>
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto bg-white p-8">
          {children ? children : null}
        </div>
      </div>
      <EntityDeletionModal 
        showModal={showConfirmationModal}
        entityLabel={entityRoutingParams.name.toLowerCase()}
        onCancel={() => setShowConfirmationModal(false)}
        onDelete={() => handleDelete()}
      />
    </>
  );
}
