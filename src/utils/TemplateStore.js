const TEMPLATES_STORAGE_KEY = "templates";
const JOURNEYS_STORAGE_KEY = "journeys";
const STEPS_STORAGE_KEY = "steps";

/**
 * Fetch all saved items from localStorage, under the storage key.
 * @param {string} storageKey key in the local storage
 * @param {string} itemType Label of the item type for the error message to display
 * @returns {Array} Array of items
 */
export function getItems(storageKey, itemType) {
    try {
        const items = localStorage.getItem(storageKey);
        return items ? JSON.parse(items) : [];
    } catch (e) {
        console.error(`Error while retrieving ${itemType}`, e);
        return [];
    }
}

/**
 * Fetch an item from localStorage, by id.
 * @param {string} id id of the item
 * @param {string} storageKey key in the local storage for the items
 * @param {string} itemType Label of the item type for the error message to display
 * @returns {object} Item fetched
 */
export function getItem(id, storageKey, itemType) {
    try {
        const items = getItems(storageKey, itemType);
        const item = items.find((i) => i.id === id);
        return item ? item : {}
    } catch (e) {
        console.error(`Error while retrieving ${itemType}`, e);
        return {};
    }
}

/**
 * Save a new item to localStorage, under the storage key.
 * If a template with the same ID exists, it will be overwritten.
 * @param {Object} item item to save in local storage
 * @param {string} storageKey key in the local storage
 * @param {string} itemType Label of the item type for the error message to display
 */
export function saveItem(item, storageKey, itemType) {
    try {
        const existing = getItems(storageKey, itemType);
        const updated = [
          ...existing.filter((i) => i.id !== item.id),
          item,
        ];
        localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
         console.error(`Error while saving ${itemType}`, e);
        }
}

/**
 * Delete an item from localStore by its ID.
 * @param {string} id item id to delete
 * @param {string} storageKey key in the local storage
 * @param {string} itemType Label of the item type for the error message to display
 */
export function deleteItem(id, storageKey, itemType) {
    try {
        const updated = getItems(storageKey, itemType).filter((i) => i.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
        console.error(`Error deleting ${itemType} with id:${id}`, e);
    }
}

// Templates logic

/**
 * Fetch all saved templates from localStorage.
 * @returns {Array} Array of templates
 */
export function getTemplates() {
    return getItems(TEMPLATES_STORAGE_KEY, "templates");
}

/**
 * Fetch templates from localStorage, by id.
 * @returns {object} template fetched
 */
export function getTemplate(id) {
    return getItem(id, TEMPLATES_STORAGE_KEY, "template");
}

/**
 * Save a new template to localStorage.
 * If a template with the same ID exists, it will be overwritten.
 * @param {Object} template
 */
export function saveTemplate(template) {
    saveItem(template, TEMPLATES_STORAGE_KEY, "template");
}

/**
 * Delete a template by its ID.
 * @param {string} id
 */
export function deleteTemplate(id) {
    deleteItem(id, TEMPLATES_STORAGE_KEY, "template");
}


// Journeys logic

/**
 * Fetch all saved journeys from localStorage.
 * @returns {Array} Array of journeys
 */
export function getJourneys() {
    return getItems(JOURNEYS_STORAGE_KEY, "journeys");
}

/**
 * Fetch journeys from localStorage, by id.
 * @returns {object} journey fetched
 */
export function getJourney(id) {
    const cleanId = Number(id); //temporary, as we use datetimes for the key while having local storage implementation
    return getItem(cleanId, JOURNEYS_STORAGE_KEY, "journey");
}

/**
 * Save a new journey to localStorage.
 * If a template with the same ID exists, it will be overwritten.
 * @param {Object} journey
 */
export function saveJourney(journey) {
    saveItem(journey, JOURNEYS_STORAGE_KEY, "journey");
}

/**
 * Delete a journey by its ID.
 * @param {string} id
 */
export function deleteJourney(id) {
    const cleanId = Number(id); //temporary, as we use datetimes for the key while having local storage implementation
    deleteItem(cleanId, JOURNEYS_STORAGE_KEY, "step");
}

// Steps logic

/**
 * Fetch all saved steps from localStorage.
 * @returns {Array} Array of steps
 */
export function getSteps() {
    return getItems(STEPS_STORAGE_KEY, "steps");
}

/**
 * Fetch steps from localStorage, by id.
 * @returns {object} step fetched
 */
export function getStep(id) { 
    const cleanId = Number(id); //temporary, as we use datetimes for the key while having local storage implementation
    return getItem(cleanId, STEPS_STORAGE_KEY, "step");
}

/**
 * Save a new step to localStorage.
 * If a template with the same ID exists, it will be overwritten.
 * @param {Object} step
 */
export function saveStep(step) {
    saveItem(step, STEPS_STORAGE_KEY, "step");
}

/**
 * Delete a step by its ID.
 * @param {string} id
 */
export function deleteStep(id) {
    const cleanId = Number(id); //temporary, as we use datetimes for the key while having local storage implementation
    deleteItem(cleanId, STEPS_STORAGE_KEY, "step");
}