
import { useMemo } from 'react'

function flattenStructure(obj, prefix = '') {
    let result = {};
  
    for (let key in obj) {
      const path = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
  
      if (Array.isArray(value)) {
        value.forEach((item) => {
          const arrayPath = `${path}[]`;
          const nested = flattenStructure(item, arrayPath);
          result = { ...result, ...nested };
        })
      } else if (typeof value === 'object' && value !== null) {
        const nested = flattenStructure(value, path);
        result = { ...result, ...nested };
      } else {
        result[path] = value;
      }
    }
  
    return result;
  }


/**
 * Displays a snippet of code, in the laguage provided.
 *
 * @typedef {object} JsonStructureInspectorProps
 * @property {string} code Contains the code to display, as a string
 * @property {string} language Language picked, based on shiki language variables
 * @param {JsonStructureInspectorProps} props
 * @returns {JSX.Element}
 */
export default function TemplateDisplay(props) {

  const fields = useMemo(() => {
    const flat = flattenStructure(props.template.structure);
    const placeholderRegex = /^\{\{.*\}\}$/;
  
    return Object.entries(flat).map(([path, value]) => {

      const metadata = props.template.fieldsMetadata?.[path] || {
        description: '',
        type: 'undefined',
        optional: false,
      };

      // placeholders are all in the format "{{ placeholder }}"
      const isStringPlaceholder =
        typeof value === 'string' && placeholderRegex.test(value);
  
      const isRealValue = !isStringPlaceholder;
      const type = Array.isArray(value)
        ? 'array'
        : value === null
        ? 'null'
        : typeof value
  
      // to display properly in the table
      const predefinedOption = isRealValue ? [String(value)] : null;
  
      return {
        path,
        value,
        description: metadata.description,
        options: metadata.options || predefinedOption, //options is not always filled in the metada, only when it makes sense
        optional:  metadata.optional,
        type: metadata.type,
      };
    })
  }, [props.template]);
  
  const typeColors = {
    string: 'bg-purple-100 text-purple-800',
    number: 'bg-yellow-100 text-yellow-800',
    boolean: 'bg-green-100 text-green-800',
    array: 'bg-pink-100 text-pink-800',
    object: 'bg-blue-100 text-blue-800',
    null: 'bg-gray-200 text-gray-800',
    undefined: 'bg-gray-100 text-gray-500',
  };
  

  return (
    <div className="bg-white border rounded-md p-4 shadow text-sm mb-6">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2 font-medium">Path</th>
            <th className="p-2 font-medium">Description</th>
            <th className="p-2 font-medium">Type</th>
            <th className="p-2 font-medium">Accepted values</th>
            <th className="p-2 font-medium">Field required?</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(({ path, description, type, options, optional }) => (
            <tr key={path} className="border-b last:border-0">
              <td className="p-2 font-mono text-blue-900">{path}</td>
              <td className="p-2">{description}</td>
              <td className="p-2">
                <span className={`inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs ${typeColors[type] || 'bg-gray-100 text-gray-800'}`} >
                  {type}
                </span>
              </td>
              <td className="p-2">
                {options ? options.map((opt, i) => (
                  <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mr-1">
                    {opt}
                  </span>
                )) : '—'}
              </td>
              <td className="p-2">
                {optional ? (
                  <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                    No
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                    Yes
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
