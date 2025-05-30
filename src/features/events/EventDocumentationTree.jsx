import { useMemo, useState, useEffect } from 'react';

import EventDocumentationTreeItem from './EventDocumentationTreeItem';
import {buildStructureTreeFromMetadata, flattenTree}  from '../../utils/TemplateTree';

/**
 * Displays the meatadata documentation for the template snippet.
 *
 * @property {object} props
 * @property {function} [props.onItemSelection] Callback to share the selected items info with other components
 * @property {string} [props.metadata] Object representating the metadata
 * @returns {JSX.Element}
 */
export default function EventDocumentationTree({ metadata, onItemSelection }) {
    const [selectionMap, setSelectionMap] = useState(null); //holds the state of items selection
    const [selectedItemParents, setSelectedItemParents] = useState([]);

    const structureTree = useMemo(() => {
        const tree = buildStructureTreeFromMetadata(metadata);
        return flattenTree(tree)
    }, [metadata]);

    // Sync the selection Map once structure tree has loaded
    useEffect(() => {
        if (structureTree) {
           
            // intialize the map with the first item selected for display
            const initalMap = structureTree.map((obj, index) => {
                return { path: obj.path, status: index === 0 ? true : false };
            });
            setSelectionMap(initalMap);
        }
    }, [structureTree]);

    function handleSelection(item) {
        const path = item.path;
        // computed first to ensure state between selectionMap and selectedItem is synced
        const newSelectionMap = selectionMap.map(entry =>
            entry.path === path
              ? { ...entry, status: !entry.status }
              : { ...entry, status: false }
          );
        // only one item can be selected at once
        const selectedEntry = newSelectionMap.find(obj => obj.status);

        // update states
        setSelectionMap(newSelectionMap);
        onItemSelection(selectedEntry ? structureTree.find(obj => obj.path === selectedEntry.path) : null);
        setSelectedItemParents(structureTree.filter((obj) => path.includes(obj.path) && path !== obj.path).map(obj => obj.path));
      }      
    
    if (!selectionMap) return null;

    return (
        <div className='bg-white border-1 border-gray-300 rounded-md p-4 overflow-y-auto'>
            {
                structureTree.map((item, index) => {
                    return (
                        item.level === 1 ? 
                        <EventDocumentationTreeItem 
                            key={index} 
                            item={item} 
                            selectionMap={selectionMap} 
                            selectedItemParents={selectedItemParents}
                            onClick={handleSelection}
                        /> 
                        : null
                    );
                })
            }
        </div>
    );
}
