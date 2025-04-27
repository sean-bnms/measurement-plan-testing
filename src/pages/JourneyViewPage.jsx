import { useParams } from "react-router-dom";

import EntityViewPage from "../layout/EntityViewPage";

import { deleteJourney, getJourney } from "../utils/TemplateStore";
import useEntityData from "../hooks/useEntityData";

export default function JourneyViewPage() {
  const { id } = useParams();
  const { entity: journey, error, loading } = useEntityData(id, getJourney);

  const entityRoutingParams = {
    name: "Journey",
    collectionName: "Journeys",
    path: "/journeys"
  }

  // Journey was not found
  if (error === "404") {
    return (
    <EntityNotFound
        entity={entityRoutingParams.name}
        redirectPath={entityRoutingParams.path}
        redirectLabel={`Go back to ${entityRoutingParams.collectionName}`}
    />);
  }

  // Journey Data is loading
  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <EntityViewPage
      id={id}
      deleteEntityById={deleteJourney}
      entityHeaderParams={{
        name: journey.name,
        description: journey.description ? journey.description : null,
        category: journey.category ? journey.category : null
      }}
      entityRoutingParams={entityRoutingParams}
    >
      <p>Content to come</p>
    </EntityViewPage>
  );
  }

