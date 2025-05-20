import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import TemplateEditor from "../features/templates/TemplateEditor";
import TemplateDocumentationCollapsible from "../features/templates/TemplateDocumentationCollapsible";
import FadingAlert from "../components/FadingAlert";
import EntityPageHeader from "../components/EntityPageHeader";
import ActionButton from "../components/ActionButton";
import Modal from "../components/Modal";

import { getTemplate } from "../utils/TemplateStore";

export default function TemplateEditPage() {
    const [template, setTemplate] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    let navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const template = getTemplate(id);           
        if (!template) {
            setError("Template not found.");
        } else {
            setTemplate(template);
        }
    }, [id]);

    function handleDeleteRequest() {
        setShowConfirmationModal(true);
    };

    function handleCancelRequest() {
        navigate(templateItemPath);
    };
    
    function handleDelete() {
        deleteEntityById(id);
        navigate(templatesLibraryPath, { replace: true });
    };

    const templatesLibraryPath = "/templates";
    const templateItemPath = `/templates/${id}`;

    const renderLoadingContent = (
        <>
            <EntityPageHeader 
                title="Edit your template"
                description="The template editor allows you to define analytics snippets to track users achievements in a very flexible way. Check the documentation below to understand how to structure your template and get one step closer to make data-driven decisions."
                breadcrumbs={[{ label: "Templates", to: templatesLibraryPath }, { label: "Template", to: templateItemPath }, { label: "Edit", to: "" }]}
            />
            <TemplateDocumentationCollapsible />
            <div className="bg-white rounded p-8 flex justify-center items-center h-40 mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-600 ml-2">Template is loading...</p>
            </div> 
        </>
    );

    const renderEditingContent = (
        <>
            <EntityPageHeader 
                title="Edit your template"
                description="The template editor allows you to define analytics snippets to track users achievements in a very flexible way. Check the documentation below to understand how to structure your template and get one step closer to make data-driven decisions."
                breadcrumbs={[{ label: "Templates", to: templatesLibraryPath }, { label: "Template", to: templateItemPath }, { label: "Edit", to: "" }]}
                actions={[
                    {Component: ActionButton, props: {onClick: handleCancelRequest, label: "Cancel", variant: "ghost"}},
                    {Component: ActionButton, props: {onClick: handleDeleteRequest, label: "Delete", Icon: Trash2, variant: "danger"}}
                ]}
            />
            <TemplateDocumentationCollapsible />
            {showAlert ? (
                <FadingAlert 
                    message={`Your template was successfully saved!`}
                    type="success"
                    onUnmount={() => setShowAlert(false)}
                />) : null}
            <TemplateEditor 
                mode="edit" 
                initialTemplate={template} 
                onSubmit={() => setShowAlert(true)}
            />
        </>
    );
  
    return (
        <div className="bg-white p-8 w-full h-full rounded-lg">
            {
                template === null ? 
                (
                    <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg">
                        {renderLoadingContent}
                    </div>
                )
                : (
                <>
                    <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg">
                        {renderEditingContent}
                    </div>
                    <Modal 
                        isOpen={showConfirmationModal}
                        title="Confirm deletion"
                        confirmBtn={{ variant:"danger", onClick: () => handleDelete(), label:"Confirm"}}
                        cancelBtn={{ variant:"ghost", onClick: () => setShowConfirmationModal(false), label:"Cancel"}}
                        >
                        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this template?</p>
                    </Modal>
                </>
                )
            }
        </div>
        );
}

