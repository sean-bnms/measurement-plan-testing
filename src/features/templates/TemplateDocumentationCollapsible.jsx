import { useState } from 'react';
import { ChevronDown } from "lucide-react";

import JsonCodeBlock from "../../components/JsonCodeBlock";
import { exampleTemplate } from '../../utils/TemplateEdition';

export default function TemplateDocumentationCollapsible() {
    const [isOpen, setIsOpen] = useState(false);
    
    function toggleSection() {
        setIsOpen((prev) => !prev);
    };

    const template = JSON.parse(exampleTemplate);

    return (
        <div className="mb-4">
            <button
                onClick={toggleSection}
                className="w-full flex items-center justify-between bg-white hover:bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 transition"
            >
                <span className="font-semibold text-left">How to define your template?</span>
                <ChevronDown 
                    className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
            />
            </button>

            {isOpen && (
                <div className="mt-4 p-4 border-l-4  bg-white border border-gray-200 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Template structure</h2>
                    <p className="mt-2"> The JSON template allows you to define an analytics snippet. </p>
                    <p className="mt-2 mb-6">Each snippet must include four main sections: name, description, structure, fieldsMetadata.</p>

                    <h3 className="text-lg mt-2"><code>name</code></h3>            
                    <p className="mt-2">The name of your template.</p> 
                    <JsonCodeBlock json={{"name": template.name}} /> 

                    <h3 className="text-lg mt-2">description</h3>           
                    <p className="mt-2">Describes when the snippet should be used.</p> 
                    <JsonCodeBlock json={{"description": template.description}} /> 
                        
                    <h3 className="text-lg mt-2">structure</h3> 
                    <p className="mt-2">This section defines the actual tracking event with placeholders for dynamic data. When dealing with arrays, it is only needed to provide the structure of the items once. If the structure is variable, provide all potential values and mention which ones are optional in the <code>fieldsMetadata</code>. For example:</p>  
                    <JsonCodeBlock json={{"structure": template.structure}} /> 

                    <h3 className="text-lg mt-2">fieldsMetadata</h3> 
                    <p className="mt-2">
                        Provides additional information for each key in the structure. When defining the <code>fieldsMetadata</code>, ensure you include:
                    </p>
                    <ul className="list-disc ml-6">
                        <li><strong>description</strong>: A brief explanation of what the field represents.</li>
                        <li><strong>type</strong>: The data type for the field. Accepted values are "string", "number", "boolean", "array" and "object".</li>
                        <li><strong>optional</strong>: Specify whether the field is required (false) or optional (true).</li>
                        <li><strong>options</strong> (optional): If the field has a limited set of possible values, specify them here.</li>
                    </ul>  
                    <JsonCodeBlock json={{"fieldsMetadata": template.fieldsMetadata}} />

                    <h3 className="text-lg mt-2">Optional fields</h3> 
                    <p className="mt-2">
                        The property category is offered to create category badges, which can be used to group your templates.
                    </p>

                </div>
                )}
        </div>
  );
};


