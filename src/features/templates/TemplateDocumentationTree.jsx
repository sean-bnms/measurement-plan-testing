import { useMemo, useState, useEffect } from 'react';

import TemplateDocumentationTreeItem from './TemplateDocumentationTreeItem';
import {buildStructureTreeFromMetadata, flattenTree}  from '../../utils/TemplateTree';

/**
 * Displays the meatadata documentation for the template snippet.
 *
 * @property {object} props
 * @property {object} props.templateStructure Contains the Analytics JSON snippet of the template
 * @property {function} [props.onItemSelection] Callback to share the selected items info with other components
 * @property {string} [props.templateMetadata] Object representating the metadata
 * @returns {JSX.Element}
 */
export default function TemplateDocumentationTree({ templateMetadata, onItemSelection }) {
    const [selectionMap, setSelectionMap] = useState(null); //holds the state of items selection
    const [selectedItemParents, setSelectedItemParents] = useState([]);

    const structureTree = useMemo(() => {
        const tree = buildStructureTreeFromMetadata(templateMetadata);
        return flattenTree(tree)
    }, [templateMetadata]);

    // Sync the selection Map once structure tree has loaded
    useEffect(() => {
        if (structureTree) {
            const initalMap = structureTree.map(obj => ({ path: obj.path, status: false }));
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
        <div className='border-2 border-gray-300 rounded-md p-4 my-4 overflow-y-auto h-1/3'>
            {
                structureTree.map((item, index) => {
                    return (
                        item.level === 1 ? 
                        <TemplateDocumentationTreeItem 
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
