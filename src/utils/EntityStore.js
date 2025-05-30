const EVENTS_STORAGE_KEY = "templates";
const JOURNEYS_STORAGE_KEY = "journeys";
const PROPERTIES_STORAGE_KEY = "properties";

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

function generateId() {
    return `id_${Math.random().toString(36).substr(2, 9)}`;
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

        // If item has no ID, generate one
        if (!item.id) {
            item.id = generateId();
        }
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
 * Fetch all saved events from localStorage.
 * @returns {Array} Array of events
 */
export function getEvents() {
    return getItems(EVENTS_STORAGE_KEY, "events");
}

/**
 * Fetch events from localStorage, by id.
 * @returns {object} event fetched
 */
export function getEvent(id) {
    return getItem(id, EVENTS_STORAGE_KEY, "event");
}

/**
 * Save a new event to localStorage.
 * If a template with the same ID exists, it will be overwritten.
 * @param {Object} event
 */
export function saveEvent(event) {
    saveItem(event, EVENTS_STORAGE_KEY, "event");
}

/**
 * Delete a event by its ID.
 * @param {string} id
 */
export function deleteEvent(id) {
    deleteItem(id, EVENTS_STORAGE_KEY, "event");
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
    return getItem(id, JOURNEYS_STORAGE_KEY, "journey");
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
    deleteItem(id, JOURNEYS_STORAGE_KEY, "journey");
}

// Steps logic

/**
 * Fetch all saved properties from localStorage.
 * @returns {Array} Array of properties
 */
export function getProperties() {
    return getItems(PROPERTIES_STORAGE_KEY, "properties");
}

/**
 * Fetch properties from localStorage, by id.
 * @returns {object} property fetched
 */
export function getProperty(id) { 
    return getItem(id, PROPERTIES_STORAGE_KEY, "property");
}

/**
 * Save a new property to localStorage.
 * If a property with the same ID exists, it will be overwritten.
 * @param {Object} property
 */
export function saveProperty(step) {
    saveItem(step, PROPERTIES_STORAGE_KEY, "property");
}

/**
 * Delete a step by its ID.
 * @param {string} id
 */
export function deleteProperty(id) {
    deleteItem(id, PROPERTIES_STORAGE_KEY, "property");
}