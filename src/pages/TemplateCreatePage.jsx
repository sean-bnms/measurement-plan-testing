import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import Editor from "@monaco-editor/react";
import { ArrowRight, X } from "lucide-react";

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
import Badge from "../components/Badge";
import JsonCodeBlock from "../components/JsonCodeBlock";
// Documentation imports
import TemplateDocumentationCardItem from "../features/templates/TemplateDocumentationCardItem";
import TemplateDocumentationTree from "../features/templates/TemplateDocumentationTree";
import Alert from "../components/Alert";
import TemplateDocumentationItemEditor from "../features/templates/TemplateDocumentationItemEditor";

import { exampleStructure } from "../utils/TemplateEdition";
import { getTemplates, saveTemplate } from "../utils/TemplateStore";
import {flattenStructure, extractStructureDataTypes, buildStructureTree, flattenTree}  from '../utils/TemplateTree';



export default function TemplateCreatePage() {
  const [template, setTemplate] = useState({name: "", description: "", category: { label: "", color: ""}, structure: JSON.parse(exampleStructure), fieldsMetadata: {}});
  const [milestoneStep, setMilestoneStep] = useState(0);
  
  // snippet template selection
  const [hasPickedSnippet, setHasPickedSnippet] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewedTemplate, setPreviewedTemplate] = useState(null);

  // ref for automatic scrolling and json content updating
  const editorValue = useRef(exampleStructure);

  // documentation handling
  const [selectedItem, setSelecteditem] = useState(null);

  // handling required fields error messages
  const [nameError, setNameError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [attributeDescriptionError, setAttributeDescriptionError] = useState(null);

  useEffect(()=>{
    const templates = getTemplates();
    const snippets = templates.map((template) => {
      return {id: template.id, name: template.name, description: template.description, category: template.category, structure: template.structure}
    });
    setSnippets(snippets);
    setFilteredSnippets(snippets);
  },[]);

  const navigate = useNavigate();


  function scrollTo(sectionId) {
    // Wait for section to render, then scroll automatically to it
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50)
  }

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
      scrollTo("snippet-section");
    }
  }

  // Code snippet handling - Starting snippet selection
  const renderTemplateSearch = (
    <>
      <EntitySearch 
        title="Search Template Library"
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
                  props: { onClick: () => handleSnippetPreview(snippet), label: "Preview", variant: "link", iconOnly: false}
                },
                { 
                  Component: ActionButton, 
                  props: { onClick: () => handleSnippetSelection(snippet), label: "Pick", variant: "primary", iconOnly: false}
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
      title="Pick a template"
      maxWidthClass="max-w-3xl"
      closeButton={
        {
          Component: ActionButton, 
          props: { onClick: () => setShowModal(false), iconOnly: true, Icon: X, variant: "close", size:"xl"}
        }
      }
    >
    {<>
      {renderTemplateSearch}
      {previewedTemplate && (
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-sm text-blue-800 uppercase tracking-widest">Preview</h2>
          <h3 className="text-lg text-gray-900 font-semibold mt-2 mb-4">{previewedTemplate.name}</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">{previewedTemplate.description}</p>
          <JsonCodeBlock json={previewedTemplate.structure} />
        </div>
        )}
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
    setShowModal(false);
    setHasPickedSnippet(true);
    setTemplate((prev) => {
      return { ...prev, structure: snippet.structure};
    });
    scrollTo("snippet-editor");
  }

  function handleSnippetPreview(snippet) {
    setPreviewedTemplate(snippet);
  }

  // Code snippet handling - Editor handling
  const jsonEditor =  (
    <Editor
      height="400px"
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
      scrollTo("documentation-section");
      scrollTo("documentation-preview-section");
    } else {
      setJsonError("The JSON syntax is invalid, it needs to be fixed to proceed with the next step of the template creation.");
    }
  }

  // Components rendering

  // Details Form
  const renderDetailsForm = (
    <>
      <h2 className="text-2xl font-semibold mb-4">Template Details</h2>
      <p className="mb-6 text-md text-gray-700">Describe the purpose of the template and add meaningful categories to help colleagues find it easily.</p>
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
      </div>
      <div className="flex space-x-3 justify-end">
        {
          milestoneStep === 0 ? 
          (
            <ActionButton 
              onClick={handleSubmitDetails}
              variant="primary" 
              label="Next" 
              Icon={ArrowRight} />
          ) : null
        }
      </div>
    </>
  );

  // Tracking snippet
  const renderCodeEditor = (
    <>
      <h2 className="text-2xl font-semibold mb-4">Tracking Snippet</h2>
      <p className="mb-6 text-md text-gray-700">Define the JSON snippet used to measure the interaction tracked with this template.</p>
      {
        // option to start from default template or company template
        !hasPickedSnippet && snippets.length > 0 ? (
          <>
            <h3 className="text-lg text-gray-700 font-medium mb-2">Select starting snippet</h3>
            <p className="mb-6 text-sm text-gray-700">Browse your company's existing templates to find a snippet close to your new use case, or starts with the default snippet structure.</p>
            <div className="flex space-x-3 justify-start mt-8">
              <ActionButton 
                onClick={()=>{
                  setHasPickedSnippet(true);
                  scrollTo("snippet-editor");
                }} 
                variant="secondary" 
                label="Use default snippet" />
              <ActionButton onClick={()=>setShowModal(true)} variant="primary" label="Pick a snippet" />
            </div>
            {renderTemplateSearchModal}
          </>
        ) : (
          <>
            <h3 id="snippet-editor" className="text-lg text-gray-700 font-medium mb-2">Edit snippet</h3>
            <p className="mb-6 text-sm text-gray-700">Use <code className="bg-blue-50 p-1 rounded-sm">{`{{placeholder}}`}</code> to indicate a placeholder value for some fields. In the documentation step, you will be able to define whether these fields should be optional, the values they can take and the data type expected. You can also provide directly the value if it is intended to remain the same in all situations.</p>
            <p className="mb-6 text-sm text-gray-700">When creating an <code className="bg-blue-50 p-1 rounded-sm">array</code>, only fill the first instance (e.g. if you have an array of prices, just fill <code className="bg-gray-50 rounded-sm test-sm">{`"prices": [{{price}}]`}</code>)</p>
            <div className={`w-full border-1 ${jsonError ? "border-red-500" : "border-gray-300"} rounded overflow-hidden max-w-3xl`}>{jsonEditor}</div>
            {jsonError && (
              <p className="text-sm text-red-500 mt-1">
                {jsonError}
              </p>
            )}
            <div className="flex space-x-3 justify-end mt-4">
              {milestoneStep === 1 ? <ActionButton onClick={handleSubmitCode} variant="primary" label="Next" Icon={ArrowRight} /> : null}
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
      <TemplateDocumentationTree templateMetadata={template.fieldsMetadata} onItemSelection={getSelectedDocumentationItem} />
    </>
  );

  function getSelectedDocumentationItem(item) {
    setSelecteditem(item);
  };

  const renderDocumentationItemEditor = (
    selectedItem ?
    <> 
      <TemplateDocumentationItemEditor 
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
    saveTemplate(template);
    navigate("/templates");
  }
  
  const renderDocumentationEditor = (
    <>
      <h2 className="text-2xl font-semibold mb-4">Snippet Documentation</h2>
      <p className="mb-6 text-md text-gray-700">Explain what data needs to be sent in the snippet and define some rules regarding the expected values.</p>
      {renderDocumentationTree}
      <div className="bg-gray-50 border-1 border-gray-200 rounded-md p-4">
        {renderDocumentationItemEditor}
      </div>
      <div className="flex space-x-3 justify-end mt-4">
        <ActionButton 
          onClick={()=> onSave()}
          variant="primary" 
          label="Create template" />
      </div>
    </>
  );

  // Template Preview
  const renderTemplateDetails = ( 
    <>
      <div className="flex items-center gap-2 flex-wrap mt-5">
        <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
        { template.category.label !== "" ? <Badge label={template.category.label} variant={template.category.color} /> : null}
      </div>
      <p className="text-sm text-gray-700 mt-2 mb-4">{template.description}</p>
    </>
  );

  const renderTemplateSnippet = (
    <>
      <h2 className="text-md font-semibold text-gray-900">Tracking snippet</h2>
      <JsonCodeBlock json={template.structure} />
    </>
  );

  const renderTemplateDocumentation = (
    <>
      <h2 className="text-md font-semibold text-gray-900">Attribute item preview</h2>
      <div className='bg-gray-100 rounded-md p-4 my-4 min-h-10'>
        {
            selectedItem && template.fieldsMetadata[selectedItem.path] ?
            <TemplateDocumentationCardItem 
                itemMetadata={template.fieldsMetadata[selectedItem.path]} 
                path={selectedItem.path}
            />
            : <p className='text-sm text-gray-700 text-center'>Click on an attribute on the tree to preview it.</p>
        }
      </div>
    </>
  );

  return (
    <div className="bg-white max-w-6xl mx-auto rounded-lg h-[100vh]">
      <SplitPanel 
        left={
          <div className="h-[90vh] my-14 pl-10 overflow-y-auto pr-8 scroll-smooth">
            <div id="details-section" className={`${milestoneStep == 0 ? "h-full" : ""}`}>
                {renderDetailsForm}
                <hr className="text-gray-200 my-4" />
            </div>
            <div id="snippet-section" className={`py-6 ${milestoneStep == 1 ? "h-full" : ""}`}>
              {
                milestoneStep > 0 && (
                  <>
                    {renderCodeEditor}
                    <hr className="text-gray-200 my-4" />
                  </>
                  )
                }
            </div>
            <div id="documentation-section" className="h-full">
              {
                milestoneStep > 1 && 
                renderDocumentationEditor
              }
            </div>
          </div>
          }
        right={
          <div className="rounded-r-lg bg-gray-100 h-[100vh] py-10">
            <div className="mx-auto pt-4 pb-8 px-8 items-center">
              <MilestoneTracker milestones={["Description", "Code", "Documentation"]} currentStep={milestoneStep}/>
            </div>

            <div className="max-h-[75vh] overflow-y-auto rounded-md mx-10 py-4 px-8 bg-white">
              <h2 className="text-sm text-blue-800 uppercase tracking-widest">Preview</h2>
                {renderTemplateDetails}
                {milestoneStep > 0 && hasPickedSnippet && renderTemplateSnippet}
                <div id="documentation-preview-section" className="">
                  {milestoneStep > 1 && renderTemplateDocumentation}
                </div>
            </div>
          </div>
        }
        templateKey={"1fr_1fr"}  
        gap={"gap-5"}   
      />
    </div>
  );
}
