import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import EntityListPage from "../layout/EntityListPage";

import { getTemplates } from "../utils/TemplateStore";

export default function TemplateListPage () {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        const templates = getTemplates();
        setTemplates(templates);
    }, []);

    const templateRoutingParams = {
        name: "Template",
        collectionName: "Templates",
        path: "/templates"
      }


    return (
        <EntityListPage
            entities={templates}
            deleteEntity={onDelete} 
            entityRoutingParams={templateRoutingParams}  
            searchPlaceholder="By name, e.g. 'Product Viewed'" 
            entityTitle="Template Library"
            entityDescription={"Templates let you define analytics tracking snipets which can be used across the customer journeys. Find a template close to your use case, or create it from scratch!"}
            entityIcon={{icon: FileText, color: "blue"}}
        >
            <div className="flex flex-col bg-gray-50 border border-gray-200 h-80 p-4 rounded-md gap-2">
                <div className="bg-white border border-gray-200 h-1/2 p-4 rounded-md " />
                <div className="bg-white border border-gray-200 h-1/2 p-4 rounded-md " />
            </div>
        </EntityListPage>

    );
}