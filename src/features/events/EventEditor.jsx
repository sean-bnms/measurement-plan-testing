import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { SaveIcon, Plus } from "lucide-react";

import { saveEvent } from "../../utils/EntityStore";
import { exampleTemplate, validateTemplate } from "../../utils/TemplateEdition"

import ActionButton from "../../components/ActionButton";
import Alert from "../../components/Alert";

/**
 * Provides a JSON editor for creating or editing a template.
 *
 * @typedef {object} EventEditorProps
 * @property {'create' | 'edit'} mode Determines behavior and button label
 * @property {object} [initialCode] Optional initial template JSON
 * @property {(template: object) => void} [onSubmit] Optional callback after successful save
 *
 * @param {EventEditorProps} props
 * @returns {JSX.Element}
 */
export default function EventEditor({ mode = "create", initialCode, onSubmit }) {
    const [error, setError] = useState(null);
    const [validationMessages, setValidationMessages] = useState([]);

    const templateContent = initialCode ? JSON.stringify(initialCode, null, 2) : exampleTemplate; //example template is already stringified
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
            saveEvent(parsed);
            setError(null);
            if (onSubmit) {
                onSubmit(parsed);
            }
        } catch (e) {
            setError(e.message);
        }
    }

    const jsonEditor =  (
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
    );

    const jsonFormatAlerts = validationMessages.length > 0 && (
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
        );
    
    const saveBtn = (
        <ActionButton
            type="submit"
            variant="primary"
            label={mode === "edit" ? "Save Changes" : "Create Event"}
            Icon={mode === "edit" ? SaveIcon : Plus}
        />);
    
    const savingErrorAlert = ( error &&
        <Alert 
            message={`An issue was encountered: ${error}`} 
            type="error"
        />);

    return (
        <form action={handleSave}>
            <label className="block text-sm font-medium mb-1">Event JSON</label> 
            
            <div className="flex flex-col items-center mb-4">
                { jsonFormatAlerts }
                <div className="w-full border border-gray-300 rounded overflow-hidden max-w-3xl">
                    { jsonEditor }
                </div>
            </div>

            { savingErrorAlert }

            { saveBtn }
        </form>
    );
}
