import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import EntityDeletionModal from "../components/EntityDeletionModal";
import EntityPageHeader from "../components/EntityPageHeader";
import NavigationButton from "../components/NavigationButton";
import ActionButton from "../components/ActionButton";
import PageReturnLinkHeader from "./PageReturnLinkHeader";

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
 * @param {string} [props.entityHeaderParams.description] - The entity item description (e.g., "Triggered when a product is added to the cart online").
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

  return (
    <>
      <div className={`relative ${showConfirmationModal ? 'pointer-events-none blur-sm' : ''}`}>
        <PageReturnLinkHeader backTo={entityRoutingParams.path} linkLabel={`Back to ${entityRoutingParams.collectionName}`}>
          <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg">
            <EntityPageHeader 
                title={entityHeaderParams.name}
                description={entityHeaderParams.description}
                breadcrumbs={[{ label: entityRoutingParams.collectionName, to: entityRoutingParams.path }, { label: "Details", to: entityPath }]}
                badges={entityHeaderParams.category ? [{label: entityHeaderParams.category.label, variant: entityHeaderParams.category.color}] : null}
                actions={[
                    {Component: NavigationButton, props: {navigateTo: `${entityPath}/edit`, label: "Edit", Icon: Pencil, variant: "primary"}},
                    {Component: ActionButton, props: {onClick: handleDeleteRequest, label: "Delete", Icon: Trash2, variant: "danger"}}
                ]}
            />
            {children ? children : null}
          </div>
        </PageReturnLinkHeader>
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
