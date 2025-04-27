import { useState } from "react";
import { Plus, FileText, Trash2, ArrowRight } from "lucide-react"; 

import EntityPageHeader from "../components/EntityPageHeader";
import EntityItem from "../components/EntityItem";
import FadingAlert from "../components/FadingAlert";
import Modal from "../components/Modal";
import NavigationButton from "../components/NavigationButton";
import ActionButton from "../components/ActionButton";
import EntitySearch from "../components/EntitySearch";
import SplitPanel from "../components/SplitPanel";

/**
 * EntityListPage Component
 *
 * This component displays a list of entities (e.g., templates, journeys, etc.) and provides:
 * - A searchable list UI
 * - A header with a breadcrumb and create button
 * - Delete functionality with confirmation modal and feedback alert
 * 
 * Props:
 * @param {Array} entities - Array of entity objects to be displayed.
 * @param {Object} entityRoutingParams - Configuration for navigation and naming.
 * @param {string} entityRoutingParams.name - Singular name of the entity (e.g., "Template").
 * @param {string} entityRoutingParams.collectionName - Plural display name for breadcrumbs.
 * @param {string} entityRoutingParams.path - Base path used for routing (e.g., "/templates").
 * @param {string} entityDescription - Descriptive text to explain what the entity is.
 * @param {string} searchPlaceholder - Placeholder text used in the search input.
 * @param {Function} deleteEntity - Function to delete an entity by ID.
 * @param {Function} children - Components to display in the right side panel
 */
export default function EntityListPage({ entities, entityIcon, entityDescription, entityTitle, entityRoutingParams, searchPlaceholder, deleteEntity, children }) {
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);

  const entityLabel = entityRoutingParams.name.toLowerCase();

  /**
   * Handles a delete button click, opening the confirmation modal.
   * @param {Object} entity - The entity to be deleted.
   */
  function handleDeleteRequest(entity) {
    setEntityToDelete(entity);
    setShowConfirmationModal(true);
  }

  function handleSearch(query) {
    setFilteredEntities(
      entities.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
    );
  }

  function handleDelete() {
    if (entityToDelete) {
      const id = entityToDelete.id;
      deleteEntity(id);
      setFilteredEntities((prev) => prev.filter((e) => e.id !== id));
      setShowAlert(true);
    }
    setShowConfirmationModal(false);
    setEntityToDelete(null);
  }

  const searchBar = (
    <EntitySearch
      title={`Search ${entityLabel}`}
      placeholder={searchPlaceholder}
      onSearch={handleSearch}
    /> );
  
  const entityList = (
    filteredEntities.map((entity) => (
      <EntityItem
        key={entity.id}
        item={entity}
        entityIcon={entityIcon}
        category={entity.category ? entity.category : null}
        buttons={[
          {
            Component: NavigationButton,
            props: {
              navigateTo: `${entityRoutingParams.path}/${entity.id}`,
              label: "View",
              Icon: ArrowRight,
              variant: "primary",
              iconOnly: true
            }
          },
          {
            Component: ActionButton,
            props: {
              onClick: () => handleDeleteRequest(entity),
              Icon: Trash2,
              label: "Delete",
              variant: "danger",
              iconOnly: true
            }
          }
        ]}
      />
    ))
  );

  return (
    <>
      {/* Main content with optional modal blur effect, triggered when modal is shown */}
      <div className={`relative ${showConfirmationModal ? 'pointer-events-none blur-sm' : ''}`}>
        <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg">
          <EntityPageHeader 
            title={entityTitle}
            description={entityDescription}
            breadcrumbs={[
              {
                label: entityRoutingParams.collectionName,
                to: entityRoutingParams.path,
              },
            ]}
            actionsPosition="bottom"
            actions={[
              {
                Component: NavigationButton,
                props: {
                  navigateTo: `${entityRoutingParams.path}/new`,
                  label: `New ${entityLabel}`,
                  Icon: Plus,
                  variant: "primary",
                },
              },
            ]}
          />

          <SplitPanel 
            left={
              <>
                {searchBar}
                {showAlert && (
                  <FadingAlert
                    message={`Your ${entityLabel} was successfully deleted.`}
                    type="success"
                    onUnmount={() => setShowAlert(false)}
                  />
                )}
                {entityList}
              </>
              }
            right={children}
          />
        </div>
      </div>

      {/* Modal for confirming deletion */}
      <Modal
        isOpen={showConfirmationModal}
        title="Confirm deletion"
        confirmBtn={{
          variant: "danger",
          onClick: () => handleDelete(),
          label: "Confirm",
        }}
        cancelBtn={{
          variant: "ghost",
          onClick: () => setShowConfirmationModal(false),
          label: "Cancel",
        }}
      >
        <p className="text-sm text-gray-600 mb-4">
          {`Are you sure you want to delete this ${entityLabel}?`}
        </p>
      </Modal>
    </>
  );
}
