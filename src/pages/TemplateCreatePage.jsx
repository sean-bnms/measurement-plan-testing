import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react"; 

import TemplateEditor from "../features/templates/TemplateEditor";
import EntityCreatePage from "../layout/EntityCreatePage";
import TemplateDocumentationCollapsible from "../features/templates/TemplateDocumentationCollapsible";
import EntitySearch from "../components/EntitySearch";
import EntityItem from "../components/EntityItem";
import ActionButton from "../components/ActionButton";
import { getTemplates } from "../utils/TemplateStore";

export default function TemplateCreatePage() {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateChosen, setTemplateChosen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const templates = getTemplates();
    setTemplates(templates);
    setFilteredTemplates(templates);
    }, []);

  function handleSelect(template) {
    setSelectedTemplate(template);
    setTemplateChosen(true);
  }

  function handleSkip() {
    setSelectedTemplate(null);
    setTemplateChosen(true);
  }

  function handleSearch(query) {
    setFilteredTemplates(
        templates.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())
    )
  );
}

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <EntityCreatePage title="Template" backLinktTo="../templates">
        {!templateChosen && templates.length > 0 ? (
          <>
            <h2 className="text-xl font-bold mb-4">Start from a Template</h2>
            <EntitySearch 
              title="Search templates"
              placeholder="Search by name..."
              onSearch={handleSearch}
            />
            <div className="space-y-4 mt-4 mb-4">
              {filteredTemplates.map((template)=>{
                return (
                  <EntityItem
                    key={template.id}
                    item={template}
                    buttons={[
                      {
                        Component: ActionButton,
                        props: {
                          onClick: () => handleSelect(template),
                          label: "Use This Template",
                          variant: "primary",
                          iconOnly: false
                        }
                      }
                    ]}
                    EntityIcon={FileText}
                    category={template.category}
                    />
                  );
              })}
            </div>
            <ActionButton 
              onClick={() => handleSkip()}
              label="Start from scratch"
              variant="ghost"
            />
          </>      
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Template definition</h1>
            <TemplateDocumentationCollapsible />
            <TemplateEditor 
              mode="create" 
              initialTemplate={selectedTemplate} 
              onSubmit={(template) => navigate(`/templates/${template.id}`)}
            />
          </>
        )}
      </EntityCreatePage>
    </div>
  );
}
