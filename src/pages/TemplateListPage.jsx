import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import EntityListPage from "../layout/EntityListPage";
import TemplateSidePanel from "../features/templates/TemplateSlidePanel";

import { getTemplates, deleteTemplate } from "../utils/TemplateStore";

export default function TemplateListPage () {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        const templates = getTemplates();
        setTemplates(templates);
    }, []);

    function onDelete(id) {
        deleteTemplate(id);
        setTemplates((prev) => prev.filter((e) => e.id !== id));
    };

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
            <TemplateSidePanel />
        </EntityListPage>

    );
}