import { useState, useEffect } from "react";

/**
 * Custom hook to fetch and manage an entity by its ID.
 *
 * @param {string} id - The ID of the entity to fetch.
 * @param {Function} getEntityById - Function to retrieve the entity by ID.
 * @returns {{
 *   entity: object|null,
 *   loading: boolean,
 *   error: string|null
 * }}
 */
export default function useEntityData(id, getEntityById) {
  const [entity, setEntity] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchedEntity = getEntityById(id);

    if (Object.keys(fetchedEntity).length === 0 && fetchedEntity.constructor === Object) {
      setError("404");
    } else {
      setEntity(fetchedEntity);
    }

    setLoading(false);
  }, [id, getEntityById]);

  return { entity, error, loading };
}