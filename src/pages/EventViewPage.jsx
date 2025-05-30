import { useParams } from "react-router-dom";

import EventView from "../features/events/EventView";
import EntityViewPage from "../layout/EntityViewPage";
import EntityNotFound from "../layout/EntityNotFound";

import { deleteEvent, getEvent } from "../utils/EntityStore";
import useEntityData from "../hooks/useEntityData";


export default function EventViewPage() {
  const { id } = useParams();
  const { entity: event, error, loading } = useEntityData(id, getEvent);

  const entityRoutingParams = {
    name: "Event",
    collectionName: "Events",
    path: "/events"
  }

  // Event was not found
  if (error === "404") {
    return (
    <EntityNotFound
        entity={entityRoutingParams.name}
        redirectPath={entityRoutingParams.path}
        redirectLabel={`Go back to ${entityRoutingParams.collectionName}`}
    />);
  }

  // Event Data is loading
  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <EntityViewPage
      id={id}
      deleteEntityById={deleteEvent}
      entityHeaderParams={{
        name: event.name,
        category: event.category ? event.category : null
      }}
      entityRoutingParams={entityRoutingParams}
    >
      <EventView event={event} />
    </EntityViewPage>
  )
}

