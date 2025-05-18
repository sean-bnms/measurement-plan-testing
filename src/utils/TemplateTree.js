export function flattenStructure(obj, prefix = '') {
    let result = {};
  
    for (let key in obj) { 
        const path = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
    
        if (Array.isArray(value) && value.length > 0) {
            const firstItem = value[0];
            result[path] = [];
            const listItemPath = `${path}.${key}[i]`;
            // if array or object, iterate
            if (typeof firstItem === 'object' && firstItem !== null) {
                const nested = flattenStructure(firstItem, listItemPath);
                result = { ...result, ...nested };
              } else {
                // other primitive types
                result[listItemPath] = firstItem;
              }
        } else if (Object.prototype.toString.call(value) === '[object Object]') {
            const nested = flattenStructure(value, path);
            result = { ...result, ...nested };
        } else {
            result[path] = value;
        }
    }
  
    return result;
}

function getDataType(value) {
    // checks for all allowed data types for JSON files
    if (Object.prototype.toString.call(value) === '[object Object]') {
        return "object";
    } else if (Array.isArray(value)) {
        return "array";
    } else if (value === null) {
        return "null";
    } else {
        // value is number, boolean, string or undefined
        return typeof value;
    }
}
  

export function extractStructureDataTypes(obj, prefix = "") {
    let result = {};
  
    for (let key in obj) {
        const path = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        result[path] = getDataType(value);

        if (Array.isArray(value)  && value.length > 0) {
            const firstItem = value[0];
            result[path] = "array";
            const listItemPath = `${path}.${key}[i]`;
            // if array or object, iterate
            if (typeof firstItem === 'object' && firstItem !== null) {
                const nested = extractStructureDataTypes(firstItem, listItemPath);
                result = { ...result, ...nested };
              } else {
                // other primitive types
                result[listItemPath] = getDataType(firstItem);
              }
        } else if (Object.prototype.toString.call(value) === '[object Object]') {
            const nested = extractStructureDataTypes(value, path);
            result = { ...result, ...nested };
        };
    }

    return result;

}
  

// Returns the flatten structure object with metadata and nested level info
export function buildStructureTree(flatData, structureDataTypes) {
    const placeholderRegex = /^\{\{.*\}\}$/;
    const tree = {};
  
    Object.entries(flatData).forEach(([key, value]) => {
        const parts = key.split(".");
        let current = tree;

        parts.forEach((part, i) => {
            const path = parts.slice(0, i + 1).join(".");
            // checks whether the key attribute has already been seen, otherwise adds it to the tree
            if (!current[part]) {
                let keyValue = null;
                let dataType = structureDataTypes[path];
                // adds value as provided in the json structure, when it is a last level item
                if (i + 1 == parts.length) {
                    // placeholders are all in the format "{{ placeholder }}"
                    const isStringPlaceholder = typeof value === 'string' && placeholderRegex.test(value);
                    keyValue = isStringPlaceholder ? null : (Array.isArray(value)  && value.length === 0) ? null : value;
                    dataType = isStringPlaceholder ? null : dataType;             
                } 
                current[part] = {
                    key: part,
                    path,
                    metadata: {
                        description: "",
                        type: dataType,
                        options: keyValue ? [keyValue] : [],
                        optional: false
                    },
                    level: i + 1,
                    children: {}
                };
            }
            current = current[part].children;
        });
    });

    return tree;
  }

export function buildStructureTreeFromMetadata(metadata) {
    const allPaths = Object.keys(metadata);
    const tree = {};
  
    const nodeMap = {};

    function getParentPath(path) {
      const parts = path.split(".");
      return parts.length > 1 ? parts.slice(0, -1).join(".") : null;
    };
  
    // Step 2: Initialize all nodes, bottom-up
    function initNode(path) {
      if (nodeMap[path]) return nodeMap[path];
  
      const parts = path.split(".");
      const key = parts[parts.length - 1];
  
      const meta = metadata[path];
      console.log(meta);
      const node = {
        key,
        path,
        metadata: {
          description: meta.description,
          type: meta.type,
          options: meta.options,
          optional: meta.optional
        },
        level: parts.length,
        children: {}
      };
  
      nodeMap[path] = node;
  
      const parentPath = getParentPath(path);
      if (parentPath) {
        const parent = initNode(parentPath);
        parent.children[key] = node;
      }
  
      return node;
    };
  
    // Step 3: Build nodes for all metadata entries (ensures parents are created)
    allPaths.forEach(initNode);
  
    // Step 4: Extract root nodes
    allPaths.forEach((path) => {
      const parentPath = getParentPath(path);
      if (!parentPath) {
        tree[path] = nodeMap[path];
      }
    });
  
    return tree;
  }
  

export function flattenTree(tree) {
    const result = [];

    function traverse(nodes) {
        Object.values(nodes).forEach((node) => {
        result.push({
            key: node.key,
            path: node.path,
            level: node.level,
            children: node.children,
            metadata: node.metadata
        });

        if (node.children && Object.keys(node.children).length > 0) {
            traverse(node.children);
        }
        });
    }

    traverse(tree);
    return result;
}