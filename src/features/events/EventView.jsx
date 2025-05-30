import { useState } from "react";

import JsonCodeBlock from "../../components/JsonCodeBlock";
import EventDocumentationCardItem from "./EventDocumentationCardItem";
import EventDocumentationTree from "./EventDocumentationTree";
import SplitPanel from "../../components/SplitPanel";

/**
 * Provides a user friendly view of the JSON template information.
 * @param {Object} props
 * @property {string} props.event Object representing the event 
 * @returns {JSX.Element}
 */
export default function EventView({ event }) {

    if (!event.structure || !event.fieldsMetadata || !event.name || !event.description) {
        throw new Error("The event used is invalid. The following fields are required: name, description, structure and fieldsMetadata");
    }
    const firstItemPath = Object.keys(event.fieldsMetadata)[0];
    const [selectedItem, setSelecteditem] = useState(null);

    function getSelectedDocumentationItem(item) {
        setSelecteditem(item);
      };

    return (
        <>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-md text-gray-700 mb-6">{event.description}</p>

            <h2 className="text-lg font-semibold text-gray-900 mb-4">Properties</h2>
            <div className="bg-gray-50 border-1 border-gray-300 rounded-sm p-6 mb-6">
                <p className='text-xs text-gray-500 mb-2'>Click on an attribute on the tree to preview it.</p>
                <SplitPanel
                    right={
                        <>
                            <div className='min-h-10 border-1 border-gray-300'>
                            {
                                selectedItem ?
                                <EventDocumentationCardItem 
                                    itemMetadata={event.fieldsMetadata[selectedItem.path]} 
                                    path={selectedItem.path}
                                />
                                : <EventDocumentationCardItem
                                    itemMetadata={event.fieldsMetadata[firstItemPath]}
                                    path={firstItemPath}
                                />
                            }
                            </div>
                        </>
                    }
                    left={
                        <>
                            <EventDocumentationTree 
                                metadata={event.fieldsMetadata} 
                                onItemSelection={getSelectedDocumentationItem} 
                            />
                        </>
                    }
                    gap="gap-5"
                    templateKey="1fr_2fr"
                
                />
            </div>
           
            <h2 className="text-lg font-semibold mb-4">Code Snippet</h2>
            <JsonCodeBlock json={event.structure}/>
                    
        </>
    );
}