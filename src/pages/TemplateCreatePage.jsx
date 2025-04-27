import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react"; 

import TemplateEditor from "../features/templates/TemplateEditor";
import TemplateDocumentationCollapsible from "../features/templates/TemplateDocumentationCollapsible";
import EntitySearch from "../components/EntitySearch";
import EntityItem from "../components/EntityItem";
import ActionButton from "../components/ActionButton";
import PageReturnLinkHeader from "../layout/PageReturnLinkHeader";
import EntityPageHeader from "../components/EntityPageHeader";
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
        templates.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    );
  }
  const templatesLibraryPath = "/templates";

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <PageReturnLinkHeader linkLabel="Back to Templates" backTo={templatesLibraryPath}>
        {!templateChosen && templates.length > 0 ? (
          <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg">
            <EntityPageHeader 
                title="Starting from an existing template?"
                description="Your company has already created some analytics template. Find the one that fit your use case... or create it from scratch!"
                breadcrumbs={[{ label: "Templates", to: templatesLibraryPath }, { label: "New", to: "" }]}
                actions={[
                    {Component: ActionButton, props: {onClick: handleSkip, label: "Start from scratch", variant: "primary", Icon: Plus}}
                ]}
                actionsPosition="bottom"
            />
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
                            label: "Use template",
                            variant: "primary",
                            iconOnly: false,
                            size: "sm"
                          }
                        }
                      ]}
                      EntityIcon={FileText}
                      category={template.category}
                    />
                  );
                })}
              </div>
          </div>    
        ) : (
          <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg">
            <EntityPageHeader 
                title="Define your template"
                description="The template editor allows you to define analytics snippets to track users achievements in a very flexible way. Check the documentation below to understand how to structure your template and get one step closer to make data-driven decisions."
                breadcrumbs={[{ label: "Templates", to: templatesLibraryPath }, { label: "New", to: "" }]}
            />
            <TemplateDocumentationCollapsible />
            <TemplateEditor 
              mode="create" 
              initialTemplate={selectedTemplate} 
              onSubmit={(template) => navigate(`/templates/${template.id}`)}
            />
          </div>
        )}
      </PageReturnLinkHeader>
    </div>
  );
}
