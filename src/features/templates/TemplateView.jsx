import { use, useState } from "react";

import JsonCodeBlock from "../../components/JsonCodeBlock";
import TemplateDocumentationCardItem from "./TemplateDocumentationCardItem";
import TemplateDocumentationTree from "./TemplateDocumentationTree";



/**
 * Provides a user friendly view of the JSON template information.
 * @param {Object} props
 * @property {string} props.template Object representing the template 
 * @returns {JSX.Element}
 */
export default function TemplateView({ template }) {
    console.log(template);

    if (!template.structure || !template.fieldsMetadata || !template.name || !template.description) {
        throw new Error("The template used is invalid. The following fields are required: name, description, structure and fieldsMetadata");
    }

    const [selectedItem, setSelecteditem] = useState(null);

    function getSelectedDocumentationItem(item) {
        setSelecteditem(item);
      };

    return (
        <>
            <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Attributes Tree</h2>
            <TemplateDocumentationTree templateMetadata={template.fieldsMetadata} onItemSelection={getSelectedDocumentationItem} />
                 
            <h2 className="text-lg font-semibold text-gray-900">Attribute item preview</h2>
            <div className='bg-gray-100 rounded-md p-4 my-4 min-h-10'>
            {
                selectedItem ?
                <TemplateDocumentationCardItem 
                    itemMetadata={template.fieldsMetadata[selectedItem.path]} 
                    path={selectedItem.path}
                />
                : <p className='text-sm text-gray-700 text-center'>Click on an attribute on the tree to preview it.</p>
            }
            </div>
            <h2 className="text-lg font-semibold mb-3">Code Snippet</h2>
            <JsonCodeBlock json={template.structure}/>
        </>
    );
}