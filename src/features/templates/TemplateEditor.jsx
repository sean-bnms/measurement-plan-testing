import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";

import { saveTemplate } from "../../utils/TemplateStore";
import { exampleTemplate, validateTemplate } from "../../utils/TemplateEdition"

import Alert from "../../components/Alert";

/**
 * Provides a JSON editor for creating or editing a template.
 *
 * @typedef {object} TemplateEditorProps
 * @property {'create' | 'edit'} mode Determines behavior and button label
 * @property {object} [initialTemplate] Optional initial template JSON
 * @property {(template: object) => void} [onSubmit] Optional callback after successful save
 *
 * @param {TemplateEditorProps} props
 * @returns {JSX.Element}
 */
export default function TemplateEditor({ mode = "create", initialTemplate, onSubmit }) {
    const [error, setError] = useState(null);
    const [validationMessages, setValidationMessages] = useState([]);

    const templateContent = initialTemplate ? JSON.stringify(initialTemplate, null, 2) : exampleTemplate; //example template is already stringified
    const editorValue = useRef(templateContent);
  
    function validateSchemaLive(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            const issues = validateTemplate(parsed); 
            setValidationMessages(issues);
        } catch (e) {
            setValidationMessages(["Invalid JSON syntax"]);
        }
    }

    function handleSave() {
        console.log("Save Triggered");
        try {
            const content = editorValue.current;
            const parsed = JSON.parse(content);
            const errors = validateTemplate(parsed);
            if (errors.length > 0) {
                throw new Error(errors.join(" "));
            }
            saveTemplate(parsed);
            setError(null);
            if (onSubmit) {
                onSubmit(parsed);
            }
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <form action={handleSave}>
            <label className="block text-sm font-medium mb-1">Template JSON</label> 
            
            <div className="flex flex-col items-center mb-4">
                {validationMessages.length > 0 && (
                <ul className="space-y-2 w-full max-w-3xl mb-2">
                    {validationMessages.map((msg, i) => (
                    <Alert 
                        key={i} 
                        message={msg}
                        type="warning"
                        closable={false}
                    />
                    ))}
                </ul>
                )}

                <div className="w-full border border-gray-300 rounded overflow-hidden max-w-3xl">
                <Editor
                    height="500px"
                    defaultLanguage="json"
                    defaultValue={editorValue.current}
                    theme="vs"
                    onChange={(value) => {
                        editorValue.current = value;
                        validateSchemaLive(value);
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        automaticLayout: true,
                    }}
                />
                </div>
            </div>

            {error && <p className="text-red-600 text-sm mb-2">Error: {error}</p>}

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {mode === "edit" ? "Save Changes" : "Create Template"}
            </button>
        </form>
    );
}
