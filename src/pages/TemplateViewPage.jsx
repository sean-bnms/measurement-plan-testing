import { useParams } from "react-router-dom";

import TemplateView from "../features/templates/TemplateView";
import EntityViewPage from "../layout/EntityViewPage";
import EntityNotFound from "../layout/EntityNotFound";

import { deleteTemplate, getTemplate } from "../utils/TemplateStore";
import useEntityData from "../hooks/useEntityData";


export default function TemplateViewPage() {
  const { id } = useParams();
  const { entity: template, error, loading } = useEntityData(id, getTemplate);

  const entityRoutingParams = {
    name: "Template",
    collectionName: "Templates",
    path: "/templates"
  }

  // Template was not found
  if (error === "404") {
    return (
    <EntityNotFound
        entity={entityRoutingParams.name}
        redirectPath={entityRoutingParams.path}
        redirectLabel={`Go back to ${entityRoutingParams.collectionName}`}
    />);
  }

  // Template Data is loading
  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <EntityViewPage
      id={id}
      deleteEntityById={deleteTemplate}
      entityHeaderParams={{
        name: template.name,
        description: template.description ? template.description : null,
        category: template.category ? template.category : null
      }}
      entityRoutingParams={entityRoutingParams}
    >
      <TemplateView template={template} />
    </EntityViewPage>
  )
}

