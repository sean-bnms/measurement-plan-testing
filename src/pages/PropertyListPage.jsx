import { useEffect, useState } from "react";
import { TableProperties } from "lucide-react";

import EntityListPage from "../layout/EntityListPage";

import { getProperties } from "../utils/EntityStore";

export default function PropertyListPage () {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchedProperties = getProperties();
        setProperties(fetchedProperties);
    }, []);

    const entityRoutingParams = {
        name: "Property",
        collectionName: "Properties",
        path: "/properties"
      }


    return (
        <EntityListPage
            entities={properties}
            entityRoutingParams={entityRoutingParams}  
            entityTitle="Tracking Properties"
            entitySearchParams={{
                placeholder: "By name, e.g. 'Onboarding flow'",
                title: "Properties Library",
                description: "Browse the existing properties in your organization"
              }}
            entityIcon={{icon: TableProperties, color: "orange"}}
        />
    );
}