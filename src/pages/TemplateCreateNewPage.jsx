import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, ArrowUpFromLine, X, VideoIcon } from "lucide-react"; 

import EntitySearch from "../components/EntitySearch";
import EntityItem from "../components/EntityItem";
import ActionButton from "../components/ActionButton";
import EntityPageHeader from "../components/EntityPageHeader";
import TemplateView from "../features/templates/TemplateView";
import Modal from "../components/Modal";
import SplitPanel from "../components/SplitPanel";
import { getTemplates } from "../utils/TemplateStore";


export default function TemplateCreateNewPage() {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const templates = getTemplates();
    setTemplates(templates);
    setFilteredTemplates(templates);
    }, []);

  function handleSelect(template) {
    setSelectedTemplate(template);
    setShowModal(true);
  }

  function handleCreationRequest() {
    navigate(`${templatesLibraryPath}/new/create`);
  }

  function handleSearch(query) {
    setFilteredTemplates(
        templates.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    );
  }

  function handleImportRequest() {
    console.log("Import configuration request");
  }
  const templatesLibraryPath = "/templates";

  const renderTemplateSearch = (
    <>
        <EntitySearch 
          title="Search templates for inspiration"
          placeholder="Search by name..."
          onSearch={handleSearch}
        />
        <div className="space-y-4 my-4">
          {filteredTemplates.map((template)=>{
            return (
              <EntityItem
                key={template.id}
                item={template}
                buttons={[
                  { 
                    Component: ActionButton, 
                    props: { onClick: () => handleSelect(template), label: "Preview", variant: "link", iconOnly: false}
                  }
                ]}
                EntityIcon={FileText}
                category={template.category}
              />
            );
          })}
        </div>
      </>
  );

  const renderTemplatePreview = ( selectedTemplate &&
    <Modal
      isOpen={showModal}
      title={selectedTemplate.name}
      description= {selectedTemplate.description}
      maxWidthClass="max-w-3xl"
      closeButton={
        {
          Component: ActionButton, 
          props: { onClick: () => setShowModal(false), iconOnly: true, Icon: X, variant: "close", size:"xl"}
        }
      }
    >
      <TemplateView template={selectedTemplate} />
    </Modal>
  );

  const renderSideDocumentation = (
    <div className="bg-gray-50 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-2">Importing templates via a JSON configuration</h2>
      <p className="text-sm text-gray-600 mb-4">Watch the video to understand how to create the JSON configuration for templates</p>
      <div className="flex justify-center">
        <div className="flex items-center justify-center text-white w-full h-40 bg-gray-300 rounded-lg mx-4">
          <VideoIcon />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 w-full h-full rounded-lg">
          <EntityPageHeader 
            title="Add a new template to the library"
            description="You have two ways of creating templates: via the dedicated tool, to create it step by step, or, if you are more experienced, by simply importing its json configuration. 👀🤓"
            breadcrumbs={[{ label: "Templates", to: templatesLibraryPath }, { label: "New", to: "" }]}
            actions={[
                {Component: ActionButton, props: {onClick: handleImportRequest, label: "Import configuration", variant: "secondary", Icon: ArrowUpFromLine}},
                {Component: ActionButton, props: {onClick: handleCreationRequest, label: "Create with wizard", variant: "primary", Icon: Plus}}
            ]}
            actionsPosition="bottom"
          />
          <SplitPanel 
            left={
              <div className="bg-gray-50 px-6 py-4 rounded-md border-1 border-gray-200">
                {renderTemplateSearch}
              </div>
            }
            right={renderSideDocumentation}
          />
        {
          // Handles the preview modal for templates, when showModal is set to true
          renderTemplatePreview
        }
    </div>
  ); 
}