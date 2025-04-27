export function validateTemplate(json) {
    const errors = [];
  
    if (!json.name || typeof json.name !== "string") {
      errors.push("Missing or invalid 'name'.");
    }
  
    if (!json.description || typeof json.description !== "string") {
      errors.push("Missing or invalid 'description'.");
    }
  
    if (!json.structure || typeof json.structure !== "object") {
      errors.push("Missing or invalid 'structure' object.");
    }
  
    if (!json.fieldsMetadata || typeof json.fieldsMetadata !== "object") {
      errors.push("Missing or invalid 'fieldsMetadata' object.");
    }
  
    // Optional: Warn on potential mismatches
    if (json.fieldsMetadata && json.structure) {
      const metadataKeys = Object.keys(json.fieldsMetadata);
      if (metadataKeys.length === 0) {
        errors.push("Warning: 'fieldsMetadata' is empty.");
      }
  
      // Add deeper matching later if needed
    }
  
    return errors;
  }

  
  export const exampleTemplate = `{
    "id": "purchase",
    "name": "Purchase",
    "category": {
      "label": "Omnichannel",
      "color": "green"
    },
    "description": "Triggered when a user completes a purchase online",
    "structure": {
      "event": "purchase",
      "ecommerce": {
        "items": [
          {
            "item_id": "{{item_id}}",
            "item_name": "{{item_name}}",
            "price": "{{price}}"
          }
        ],
        "payment_method": "{{payment_method}}"
      }
    },
    "fieldsMetadata": {
      "event": {
        "description": "Name of the event sent",
        "type": "string",
        "optional": false
      },
      "ecommerce.items[].item_id": {
        "description": "Unique ID of the product",
        "type": "string",
        "optional": false
      },
      "ecommerce.items[].item_name": {
        "description": "Name of the product",
        "type": "string",
        "optional": true
      },
      "ecommerce.items[].price": {
        "description": "Price displayed to the user",
        "type": "number",
        "optional": false
      },
      "ecommerce.payment_method": {
        "description": "Payment method used for the purchase",
        "type": "string",
        "optional": true,
        "options": ["digital wallet", "bnpl", "card-based", "cryptocurreny"]
      }
    }
  }`;
  
  