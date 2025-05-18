import ToggleInput from "../../components/ToggleInput";
import Textarea from "../../components/TextArea";
import MultiInput from "../../components/MultiInput";
import Dropdown from "../../components/Dropdown";

/**
 * A reusable dropdown/select component with optional label, error, and tooltip.
 *
 * @typedef {object} TemplateDocumentationItemEditorProps
 * @property {object} itemMetadata - The metadata object with the keys {description, type, options, optional}
 * @property {string} itemPath - The path for the variable
 * @property {Function} onToggle - Function called when the toggle input see its value being modified
 * @property {Function} onTextAreaChange - Function called when the description input field is modified
 * @property {Function} onSelectType - Function called when the data type input field is modified
 * @property {Function} onInputValue - Function called when the multi values input field is modified
 */
export default function TemplateDocumentationItemEditor({
    itemMetadata, 
    itemPath, 
    onToggle, 
    onTextAreaChange,
    onSelectType,
    onInputValue,
    descriptionError
    }){
    return (
        <> 
            <h3 className="text-lg text-gray-900">{itemPath}</h3>
            <div className="flex flex-col gap-2 my-4">
                <ToggleInput
                    label="Optional field?"
                    checked={itemMetadata.optional}
                    onChange={onToggle}
                    description="If enabled, users can omit this fields in the snippet"
                />
                <Textarea
                    label="Description"
                    value={itemMetadata.description}
                    onChange={(e) => onTextAreaChange(e)}
                    placeholder="e.g. (items) holds all the item present in the cart during checkout"
                    required={true}
                    ariaLabel="Gives context on the attribute purpose"
                    error={descriptionError}
                />
                <Dropdown
                    label="Data Type"
                    value={itemMetadata.type}
                    onChange={(e) => onSelectType(e)}
                    options={["string", "number", "boolean", "array", "object"]}
                    required
                    tooltip="Select the data type expected for this field"
                />
                { 
                    !["object", "boolean", "array"].includes(itemMetadata.type) ?
                    <MultiInput
                    label="Allowed Values"
                    values={itemMetadata.options}
                    onChange={(newOptions) => onInputValue(newOptions)}
                    placeholder="e.g. card-based"
                    required={false}
                    tooltip={"If this field is not holding categorical values, do not input any values."}
                    />
                    : null
                }
            </div>
        </>
    );
}