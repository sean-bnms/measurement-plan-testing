import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react"; 

import PageHeader from "../components/PageHeader";
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
 * @param {Object} entitySearchParams - Configuration for the entity search block.
 * @param {string} entitySearchParams.title - Title for the search box.
 * @param {string} entitySearchParams.description - Description for the search box.
 * @param {string} entitySearchParams.placeholder - Placeholder text used in the search input.
 * @param {Array<{ Component: React.ElementType, props: Object }>} [headerButtons] - Optional Headers buttons.
 * @param {Function} children - Components to display in the right side panel
 */
export default function EntityListPage({ entities, entityIcon, entityTitle, entityRoutingParams, entitySearchParams, headerButtons, children }) {
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
      placeholder={entitySearchParams.placeholder}
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

  const actions = headerButtons ? 
  [
    ...headerButtons,
    {
      Component: NavigationButton,
      props: { navigateTo: `${entityRoutingParams.path}/new`, label: `New ${entityLabel}`, Icon: Plus, variant: "primary"}
    },
  ] : [
    {
      Component: NavigationButton,
      props: { navigateTo: `${entityRoutingParams.path}/new`, label: `New ${entityLabel}`, Icon: Plus, variant: "primary"}
    }
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
      <div className="sticky top-0 z-20 bg-white px-8 py-6 w-full border-b-2 border-gray-300 h-32">
        <PageHeader 
          title={entityTitle}
          breadcrumbs={[
            {
              label: entityRoutingParams.collectionName,
              to: entityRoutingParams.path,
            },
          ]}
        >
          {renderActions}
        </PageHeader>
      </div>
      
      <div className="m-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <SplitPanel 
          left={
            <section className="bg-white p-8 w-full rounded-lg">

                <div className="max-w-2xl">
                  <h1 className="text-2xl font-bold text-gray-900">{entitySearchParams.title}</h1>
                  <p className="text-sm text-gray-600 mt-2 mb-8">{entitySearchParams.description}</p>
                </div>

              <div className="bg-gray-50 px-6 py-4 rounded-md border-1 border-gray-200">
                {searchBar}
                <div className="overflow-y-auto h-50">
                  {entityList}
                </div>
              </div>

            </section>
          }
          right={children}
          gap={"gap-6"}
        />
      </div>
    </>
    
  );
}
