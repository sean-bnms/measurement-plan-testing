import { useEffect, useState } from "react";
import { Footprints } from "lucide-react";

import EntityListPage from "../layout/EntityListPage";

import { getJourneys } from "../utils/EntityStore";

export default function JourneyListPage () {
    const [journeys, setJourneys] = useState([]);

    useEffect(() => {
        const journeys = getJourneys();
        setJourneys(journeys);
    }, []);

    const journeyRoutingParams = {
        name: "Journey",
        collectionName: "Journeys",
        path: "/journeys"
      }


    return (
        <EntityListPage
            entities={journeys}
            entityRoutingParams={journeyRoutingParams}  
            entityTitle="Journey Tracking"
            entitySearchParams={{
                placeholder: "By name, e.g. 'Onboarding flow'",
                title: "Customer Journeys Library",
                description: "Browse the exisitng Customer journeys in your organization"
              }}
            entityIcon={{icon: Footprints, color: "green"}}
        />
    );
}