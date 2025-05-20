import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react"; 

import EntityPageHeader from "../components/EntityPageHeader";
import EntityItem from "../components/EntityItem";
import NavigationButton from "../components/NavigationButton";
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
export default function EntityListPage({ entities, entityIcon, entityDescription, entityTitle, entityRoutingParams, searchPlaceholder, children }) {
  const [filteredEntities, setFilteredEntities] = useState([]);
  
  const entityLabel = entityRoutingParams.name.toLowerCase();

  function handleSearch(query) {
    setFilteredEntities(
      entities.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
    );
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
              variant: "link"
            }
          }
        ]}
      />
    ))
  );

  return (
    <div className="bg-white p-8 w-full h-full rounded-lg">
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
            props: { navigateTo: `${entityRoutingParams.path}/new`, label: `New ${entityLabel}`, Icon: Plus, variant: "primary"}
          },
        ]}
      />

      <SplitPanel 
        left={
          <>
            <div className="bg-gray-50 px-6 py-4 rounded-md border-1 border-gray-200">
              {searchBar}
              <div className="overflow-y-auto h-50">
                {entityList}
              </div>
            </div>
          </>
          }
        right={children}
      />
    </div>
  );
}
