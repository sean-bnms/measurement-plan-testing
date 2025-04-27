import { useEffect, useState } from "react";
import { Footprints } from "lucide-react";

import EntityListPage from "../layout/EntityListPage";

import { getJourneys, deleteJourney } from "../utils/TemplateStore";

export default function JourneyListPage () {
    const [journeys, setJourneys] = useState([]);

    useEffect(() => {
        const journeys = getJourneys();
        setJourneys(journeys);
    }, []);

    function onDelete(id) {
        deleteJourney(id);
        setJourneys((prev) => prev.filter((e) => e.id !== id));
    };

    const journeyRoutingParams = {
        name: "Journey",
        collectionName: "Journeys",
        path: "/journeys"
      }


    return (
        <EntityListPage
            entities={journeys}
            deleteEntity={onDelete} 
            entityRoutingParams={journeyRoutingParams}  
            searchPlaceholder="By name, e.g. 'Onboarding flow'" 
            entityTitle="User Journeys"
            entityDescription="Journeys let you map the main milestones of your customer journeys and define what is important for you to track. Find the journeys which matter to you, or create one from scratch!"
            entityIcon={{icon: Footprints, color: "green"}}
        />
    );
}