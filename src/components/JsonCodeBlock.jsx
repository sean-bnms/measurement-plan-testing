import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function JsonCodeBlock({ json }) {
  const [copied, setCopied] = useState(false);

  const formattedJson = JSON.stringify(json, null, 2);

  function escapeHtml(str) {
    str.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
    return str;
  }
   
  function renderJson(value, indent = 0) {
    const pad = (n) => ' '.repeat(n * 2);
  
    if (Array.isArray(value)) {
      return `[\n${value
        .map((v) => pad(indent + 1) + renderJson(v, indent + 1))
        .join(',\n')}\n${pad(indent)}]`;
    }
  
    if (typeof value === 'object' && value !== null) {
      return `{\n${Object.entries(value)
        .map(([key, val]) =>
          `${pad(indent + 1)}<span class="text-red-800">"${escapeHtml(key)}"</span>: ${renderJson(val, indent + 1)}`
        )
        .join(',\n')}\n${pad(indent)}}`;
    }
  
    if (typeof value === 'string') {
      return `<span class="text-blue-900">"${escapeHtml(value)}"</span>`;
    }
  
    if (typeof value === 'number') {
      return `<span class="text-green-700">${value}</span>`;
    }
  
    if (typeof value === 'boolean' || value === null) {
      return `<span class="text-indigo-700">${String(value)}</span>`;
    }
  
    return '';
  };
  
  function highlightJson(text) {
    try {
      const parsed = JSON.parse(text);
      return renderJson(parsed);
    } catch (err) {
      console.log(err);
      return `<span class="text-red-500">Invalid JSON</span>`;
    }
  };
  
  function handleCopy() {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative bg-white text-sm rounded-lg border border-gray-200 overflow-x-auto font-mono text-gray-800 mt-4 mb-4">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 text-gray-500 hover:text-black flex items-center space-x-1 text-xs"
          >
          {copied ? (
              <>
              <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
              <span>Copied!</span>
              </>
          ) : (
              <>
              <Copy className="w-4 h-4" aria-hidden="true" />
              <span>Copy</span>
              </>
          )}
        </button>

      <pre className="p-4 overflow-x-auto text-sm font-mono">
        <code
          dangerouslySetInnerHTML={{ __html: highlightJson(formattedJson) }}
        />
      </pre>
    </div>
  );
}



