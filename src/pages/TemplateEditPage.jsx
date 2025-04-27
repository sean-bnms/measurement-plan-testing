import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import TemplateEditor from "../features/templates/TemplateEditor";
import EntityCreatePage from "../layout/EntityCreatePage";
import TemplateDocumentationCollapsible from "../features/templates/TemplateDocumentationCollapsible";
import FadingAlert from "../components/FadingAlert";

import { getTemplate } from "../utils/TemplateStore";

export default function TemplateEditPage() {
    const [template, setTemplate] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const { id } = useParams();
    

    useEffect(() => {
            const template = getTemplate(id);           
            if (!template) {
                setError("Template not found.");
            } else {
                setTemplate(template);
            }
        }, [id]);
  
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <EntityCreatePage title="Template" backLinktTo={`../templates/${id}`}>
            {template === null ? (
                <>
                    <h1 className="text-2xl font-bold mb-2">Template definition</h1>
                    <TemplateDocumentationCollapsible />
                    <div className="bg-white rounded p-8 flex justify-center items-center h-40 mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-sm text-gray-600 ml-2">Template is loading...</p>
                    </div> 
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-2">Template definition</h1>
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
            )}
            </EntityCreatePage>
        </div>
        );
}

