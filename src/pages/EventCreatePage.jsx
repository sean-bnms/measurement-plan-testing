import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import Editor from "@monaco-editor/react";
import { ArrowRight, X , MousePointerClick, Eye, CircleHelp} from "lucide-react";

import PageHeader from "../components/PageHeader";
import MilestoneTracker from "../components/MilestoneTracker";
import SplitPanel from "../components/SplitPanel";
import ActionButton from "../components/ActionButton";
// Details forms imports
import Input from "../components/Input";
import Textarea from "../components/TextArea";
// Tracking snippet imports
import EntitySearch from "../components/EntitySearch";
import EntityItem from "../components/EntityItem";
import Modal from "../components/Modal";
// Template preview imports
import JsonCodeBlock from "../components/JsonCodeBlock";
// Documentation imports
import EventDocumentationCardItem from "../features/events/EventDocumentationCardItem";
import EventDocumentationTree from "../features/events/EventDocumentationTree";
import Alert from "../components/Alert";
import EventDocumentationItemEditor from "../features/events/EventDocumentationItemEditor";

import { exampleStructure } from "../utils/TemplateEdition";
import { getEvents, saveEvent } from "../utils/EntityStore";
import {flattenStructure, extractStructureDataTypes, buildStructureTree, flattenTree}  from '../utils/TemplateTree';



export default function EventCreatePage() {
  const [template, setTemplate] = useState({name: "", description: "", category: { label: "", color: ""}, structure: JSON.parse(exampleStructure), fieldsMetadata: {}});
  const [milestoneStep, setMilestoneStep] = useState(0);
  
  // snippet template selection
  const [hasPickedSnippet, setHasPickedSnippet] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewedTemplate, setPreviewedTemplate] = useState(null);

  // ref for json content updating
  const editorValue = useRef(exampleStructure);

  // documentation handling
  const [selectedItem, setSelectedItem] = useState(null);

  // handling required fields error messages
  const [nameError, setNameError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [attributeDescriptionError, setAttributeDescriptionError] = useState(null);

  useEffect(()=>{
    const templates = getEvents();
    const snippets = templates.map((template) => {
      return {id: template.id, name: template.name, description: template.description, category: template.category, structure: template.structure}
    });
    setSnippets(snippets);
    setFilteredSnippets(snippets);
  },[]);

  const navigate = useNavigate();

  // Details form handling
  function validateDetailsData() {
    if (!template.name.trim()) {
      setNameError("Template name is required.");
      return false;
    } else {
      setNameError(""); 
    }
    if (!template.description.trim()) {
      setDescriptionError("Add a description, otherwise no one will ever use it...");
      return false;
    } else {
      setDescriptionError("");
    }
    return true;
  }

  function handleSubmitDetails() {
    const isDataValid = validateDetailsData();
    if (isDataValid) {
      setMilestoneStep(1);
    }
  }

  // Code snippet handling - Starting snippet selection
  const renderTemplateSearch = (
    <>
      <EntitySearch 
        title=""
        placeholder="Search by name..."
        onSearch={handleSearch}
      />
      <div className="space-y-4 my-4">
        {filteredSnippets.map((snippet)=>{
          return (
            <EntityItem
              key={snippet.id}
              item={snippet}
              buttons={[
                { 
                  Component: ActionButton, 
                  props: { onClick: () => handleSnippetPreview(snippet), label: "Preview", variant: "ghost", iconOnly: false, Icon: Eye}
                },
                { 
                  Component: ActionButton, 
                  props: { onClick: () => handleSnippetSelection(snippet), label: "Select", variant: "link", iconOnly: false, Icon: MousePointerClick}
                }
              ]}
              category={snippet.category}
            />
          );
        })}
      </div>
    </>
  );

  const renderTemplateSearchModal = (
    <Modal
      isOpen={showModal}
      title=""
      maxWidthClass="max-w-3xl"
      closeButton={
        {
          Component: ActionButton, 
          props: { onClick: () => setShowModal(false), iconOnly: true, Icon: X, variant: "close", size:"xl"}
        }
      }
    >
    {previewedTemplate && <>
      <h2 className="text-sm text-blue-800 uppercase tracking-widest">Preview</h2>
      <h3 className="text-lg text-gray-900 font-semibold mt-2 mb-4">{previewedTemplate.name}</h3>
      <p className="text-sm text-gray-600 mt-2 mb-4">{previewedTemplate.description}</p>
      <JsonCodeBlock json={previewedTemplate.structure} />
    </>
    }
    </Modal>
);

  function handleSearch(query) {
    setFilteredSnippets(
        snippets.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    );
  }

  function handleSnippetSelection(snippet) {
    setHasPickedSnippet(true);
    setTemplate((prev) => {
      return { ...prev, structure: snippet.structure};
    });
    // updates default value for the json editor
    editorValue.current = JSON.stringify(snippet.structure, null, 2);
  }

  function handleSnippetPreview(snippet) {
    setShowModal(true);
    setPreviewedTemplate(snippet);
  }

  // Code snippet handling - Editor handling
  const jsonEditor =  (
    <Editor
      height="300px"
      defaultLanguage="json"
      defaultValue={editorValue.current}
      theme="vs"
      onChange={(value) => handleCodeEditorChange(value)}
      options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          lineNumbers: "off"
      }}
    />
  );

  function handleCodeEditorChange(value) {
    editorValue.current = value;
    const isJsonValid = validateSchemaLive(value);
    if (isJsonValid) {
      setJsonError(null);
      const parsed = JSON.parse(value);
      setTemplate((prev) => {
        return { ...prev, structure: parsed};
      })
    }
  }

  function validateSchemaLive(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getStructureTree(templateStructure) {
    const flatStructure = flattenStructure(templateStructure);
    const structureDataTypes = extractStructureDataTypes(templateStructure);
    const tree = buildStructureTree(flatStructure, structureDataTypes);
    return flattenTree(tree)
  }

  function handleSubmitCode() {
    const json = editorValue.current;
    const isCodeValid = validateSchemaLive(json);
    if (isCodeValid) {
      const structureTree = getStructureTree(template.structure);
      setTemplate((prev) => {
        const templateMetadata = {};
        structureTree.forEach((item)=>{
          let meta = templateMetadata;
          const metadata = item.metadata;
          const path = item.path;
          meta[path] = metadata;
        });
        return {
          ...prev,
          fieldsMetadata: templateMetadata
        }
      });
      setMilestoneStep(2);
    } else {
      setJsonError("The JSON syntax is invalid, it needs to be fixed to proceed with the next step of the template creation.");
    }
  }

  // Components rendering

  // Details Form
  const renderDetailsForm = (
    <>
      <div className="flex flex-col gap-2 my-4">
        <Input 
          label="Name"
          placeholder="e.g. Product Purchase"
          type="text"
          value={template.name}
          onChange={(e) => setTemplate((prev) => {
            return { ...prev, name: e.target.value};
          })}
          required={true}
          ariaLabel="Name given to the template created"
          error={nameError}
        /> 
        <Input 
          label="Category"
          placeholder="e.g. Ecommerce"
          type="text"
          value={Object.keys(template.category).length === 0 && template.category.constructor === Object ? "" : template.category.label}
          onChange={(e) => setTemplate((prev) => {
            return { ...prev, category: { "label": e.target.value, "color": "blue"} };
          })}
          ariaLabel="Category of template"
        /> 
        <Textarea
          label="Description"
          value={template.description}
          onChange={(e) => setTemplate((prev) => {
            return { ...prev, description: e.target.value};
          })}
          placeholder="e.g. Tracks the completion of product purchase on the E-commerce site"
          required={true}
          ariaLabel="Description of when to use the template"
          error={descriptionError}
        />
      </div>
      <div className="flex space-x-3 justify-end mb-4">
        {
          milestoneStep === 0 ? 
          <ActionButton onClick={handleSubmitDetails} variant="primary" label="Next" Icon={ArrowRight} /> 
          : null
        }
      </div>
    </>
  );

  // Tracking snippet
  const renderCodeEditor = (
    <>
      {
        // option to start from default template or company template
        !hasPickedSnippet && snippets.length > 0 ? (
          <>
            <h3 className="text-lg text-gray-700 font-medium mb-2">Start from an existing snippet</h3>
            <p className="mb-3 text-sm text-gray-700">Browse your company's existing templates to find a snippet close to your new use case, or create one from scratch.</p>
            
            <div className="flex gap-3 justify-start mb-2">
              <ActionButton 
                onClick={()=> setHasPickedSnippet(true)} 
                variant="link" 
                label="Use default snippet"
                Icon={ArrowRight} />
            </div>

            <div className="bg-white px-6 py-4 rounded-md border-1 border-gray-200">
              {renderTemplateSearch}
            </div>

            {renderTemplateSearchModal}
          </>
        ) : (
          <>
            <h3 className="text-lg text-gray-700 font-medium mb-6">Edit snippet</h3>
            <div className={`w-full border-1 ${jsonError ? "border-red-500" : "border-gray-300"} rounded max-w-3xl`}>
              {jsonEditor}
            </div>
            {jsonError && (
              <p className="text-sm text-red-500 mt-1">
                {jsonError}
              </p>
            )}
            <div className="flex space-x-3 justify-end mt-6 mb-4">
              {
                milestoneStep === 1 ? 
                <ActionButton onClick={handleSubmitCode} variant="primary" label="Next" Icon={ArrowRight} /> 
                : null
              }
            </div>
          </>
        )
      }
    </>
  );

  // Documentation Editor
  const renderDocumentationTree = (
    <>
      <h2 className="text-md font-semibold text-gray-900 mb-4">Attributes Tree</h2>
      <EventDocumentationTree metadata={template.fieldsMetadata} onItemSelection={getSelectedDocumentationItem} />
    </>
  );

  function getSelectedDocumentationItem(item) {
    setSelectedItem(item);
  };

  const renderDocumentationItemEditor = (
    selectedItem ?
    <> 
      <EventDocumentationItemEditor 
        itemMetadata={template.fieldsMetadata[selectedItem.path]}
        itemPath={selectedItem.path}
        onToggle={() => setTemplate(prev => {
          const path = selectedItem.path;
          return {
            ...prev,
            fieldsMetadata: {
              ...prev.fieldsMetadata,
              [path]: {
                ...prev.fieldsMetadata?.[path],
                optional: !prev.fieldsMetadata[path].optional
              }
            }
          };
        })}
        onTextAreaChange={(e) => {
          const newDescription = e.target.value;
          const path = selectedItem.path;
        
          setTemplate(prev => {
            return {
              ...prev,
              fieldsMetadata: {
                ...prev.fieldsMetadata,
                [path]: {
                  ...prev.fieldsMetadata[path],
                  description: newDescription
                }
              }
            } 
          });
        }}
        onSelectType={(e) => {
          const newType = e.target.value;
          const path = selectedItem.path;
          
          setTemplate(prev => {
            return {
              ...prev,
              fieldsMetadata: {
                ...prev.fieldsMetadata,
                [path]: {
                  ...prev.fieldsMetadata[path],
                  type: newType
                }
              }
            } 
          });
        }}
        onInputValue={(newOptions) => {
          const path = selectedItem.path;
          setTemplate(prev => {
            return {
              ...prev,
              fieldsMetadata: {
                ...prev.fieldsMetadata,
                [path]: {
                  ...prev.fieldsMetadata?.[path],
                  options: newOptions
                }
              }
            };
          });
        }}
        descriptionError={attributeDescriptionError}
      />
    </>
    : <Alert message="Click on an attribute on the tree to start documenting it." type="info" closable={true} />
  );

  function onSave() {
    saveEvent(template);
    navigate("/events");
  }
  
  const renderDocumentationEditor = (
    <>
      <h2 className="text-2xl font-semibold mb-4">Snippet Documentation</h2>
      <p className="mb-6 text-md text-gray-700">Explain what data needs to be sent in the snippet and define some rules regarding the expected values.</p>
      {renderDocumentationTree}
      <div className="bg-gray-50 border-1 border-gray-200 rounded-md p-4">
        {renderDocumentationItemEditor}
      </div>
      <div className="flex space-x-3 justify-end mt-4 pb-6">
        <ActionButton 
          onClick={()=> onSave()}
          variant="primary" 
          label="Create template" />
      </div>
    </>
  );

  // Template Preview
  const renderTemplateDocumentation = (
    <>
      <h2 className="text-md font-semibold text-gray-900">Attribute item preview</h2>
      <div className='bg-gray-100 rounded-md p-4 my-4 min-h-10'>
        {
            selectedItem && template.fieldsMetadata[selectedItem.path] ?
            <EventDocumentationCardItem 
                itemMetadata={template.fieldsMetadata[selectedItem.path]} 
                path={selectedItem.path}
            />
            : <p className='text-sm text-gray-700 text-center'>Click on an attribute on the tree to preview it.</p>
        }
      </div>
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-20 bg-white px-8 py-6 w-full border-b-2 border-gray-300 h-32">
        <PageHeader 
          title="Event Creation"
          breadcrumbs={[{ label: "Events", to: "/events" }, { label: "New", to: "/events/new" }]}
        >
          <div className="pt-4 pb-6 w-xl">
            <MilestoneTracker milestones={["Description", "Code", "Documentation"]} currentStep={milestoneStep}/>
          </div>
        </PageHeader>
      </div>
  
      <div className="m-6 max-h-[calc(100vh-8rem)] overflow-y-auto bg-white rounded-lg">
        <SplitPanel 
          left={
            <div className="pt-10 pl-10">
              {
                milestoneStep === 0 ? (
                  <div className="mt-5">
                    <h2 className="text-xl font-semibold mb-2">Events Details</h2>
                    <p className="text-base text-gray-500">Describe the purpose of the template and add meaningful categories to help colleagues find it easily.</p>
                  </div> )
                : milestoneStep === 1 ? (
                  <div className="mt-5">
                    <h2 className="text-xl font-semibold mb-2">Tracking Snippet</h2>
                    <p className="text-base text-gray-500 mb-10">Define the JSON snippet used to measure the interaction tracked with this event.</p>
                    {
                      hasPickedSnippet &&
                      <div className="bg-blue-50 border-1 border-blue-100 px-6 pt-4 pb-8 rounded-sm">
                        <div className="flex items-center gap-2 mb-4">
                          < CircleHelp size={24} className="text-blue-800" aria-hidden={true} />
                          <h3 className="text-md text-blue-800 font-semibold">Filling the snippet</h3>
                        </div>
                      
                        <p className="mb-6 text-sm text-gray-900">Use <code className="bg-blue-300 p-1 rounded-sm text-white text-xs">{`{{placeholder}}`}</code> to indicate a placeholder value for some fields. In the documentation step, you will be able to define whether these fields should be optional, the values they can take and the data type expected. You can also provide directly the value if it is intended to remain the same in all situations.</p>
                        <p className="text-sm text-gray-900">When creating an <code className="bg-blue-300 p-1 rounded-sm text-white text-xs">array</code>, only fill the first instance (e.g. if you have an array of prices, just fill <code className="bg-blue-300 p-1 rounded-sm text-white text-xs">{`"prices": [{{price}}]`}</code>)</p>
                      </div>
                    }
                  </div>)
                : (
                  <div className="mt-5">
                    { renderDocumentationEditor }
                  </div>
                )
              } 
            </div>
            }
          right={
            <div className="rounded-r-lg p-10 overflow-y-auto">
              {
                milestoneStep === 0 ?
                (
                  <div className="mx-2 mt-4 py-4 px-8 bg-gray-50 border-1 border-gray-300 rounded-lg">
                    {renderDetailsForm}
                  </div>
                ) : milestoneStep === 1 ? (
                  <div className="mx-2 mt-4 py-4 px-8 bg-gray-50 border-1 border-gray-300 rounded-lg">
                    {renderCodeEditor}
                  </div>
                ) : null
              }
              {/* <div className="py-4 px-8 overflow-y-auto h-5/6 rounded-md border-1 border-gray-200 bg-white"> */}
              {milestoneStep > 1 && renderTemplateDocumentation}
            </div>
          }
          templateKey={"1fr_2fr"}  
          gap={"gap-2"}   
        />
      </div>
    </>
  );
}
