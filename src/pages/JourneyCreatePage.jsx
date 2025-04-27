import JourneyEditor from "../components/JourneyEditor";
import EntityCreatePage from "../layout/EntityCreatePage";

export default function JourneyCreatePage() {
  return (
    <EntityCreatePage title="Journey" backLinktTo="/journeys">
      <JourneyEditor />
    </EntityCreatePage>
  );
}
