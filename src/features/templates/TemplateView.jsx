import { useEffect, useState } from "react";

import { getTemplate } from "../../utils/TemplateStore";
import TemplateDisplay from "./TemplateDisplay";
import JsonCodeBlock from "../../components/JsonCodeBlock";


/**
 * Provides a user friendly view of the JSON template information.
 * @param {Object} props
 * @property {string} props.template Object representing the template 
 * @returns {JSX.Element}
 */
export default function TemplateView({ template }) {

    if (!template.structure || !template.fieldsMetadata || !template.name || !template.description) {
        throw new Error("These template used is invalid. The following fields are required: name, description, structure and fieldsMetadata");
    }

    return (
        <>
            <h2 className="text-lg font-semibold mt-6 mb-3">Data attributes</h2>
            <TemplateDisplay template={template}/>
            <h2 className="text-lg font-semibold mb-3">Code Snippet</h2>
            <JsonCodeBlock json={template.structure}/>
        </>
    );
}