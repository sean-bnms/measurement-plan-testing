import { useEffect, useState } from "react";
import { Braces, ArrowUpFromLine } from "lucide-react";

import EntityListPage from "../layout/EntityListPage";
import NavigationButton from "../components/NavigationButton";

import { getEvents } from "../utils/EntityStore";

export default function EventListPage () {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const allEvents = getEvents();
        setEvents(allEvents);
    }, []);

    const entityRoutingParams = {
        name: "Event",
        collectionName: "Events",
        path: "/events"
      }

      //TODO: navigation to modify for the header buttons
    return (
        <EntityListPage
            entities={events}
            entityRoutingParams={entityRoutingParams}  
            entityTitle="Events"
            entityIcon={{icon: Braces, color: "blue"}}
            entitySearchParams={{
                placeholder: "By name, e.g. 'Product Viewed'",
                title: "Events Library",
                description: "Discover how tracking is done in your organization."
              }}
            headerButtons={[{Component: NavigationButton, props: { navigateTo: `${entityRoutingParams.path}`, label: "Import configuration", variant: "secondary", Icon: ArrowUpFromLine}}]}
        >
            <div className="flex flex-col bg-gray-50 border border-gray-200 h-80 p-4 rounded-md gap-2">
                <div className="bg-white border border-gray-200 h-1/2 p-4 rounded-md " />
                <div className="bg-white border border-gray-200 h-1/2 p-4 rounded-md " />
            </div>
        </EntityListPage>

    );
}