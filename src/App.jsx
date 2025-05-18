import HomePage from "./pages/HomePage";
import TemplateViewPage from "./pages/TemplateViewPage";
import TemplateListPage from "./pages/TemplateListPage";
import TemplateCreatePage from "./pages/TemplateCreatePage";
import TemplateCreateNewPage from "./pages/TemplateCreateNewPage";
import TemplateClonePage from "./pages/TemplateClonePage";
import TemplateEditPage from "./pages/TemplateEditPage";
import JourneyListPage from "./pages/JourneyListPage";
import JourneyCreatePage from "./pages/JourneyCreatePage";
import JourneyViewPage from "./pages/JourneyViewPage";
import Layout from "./layout/Layout"

import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="templates" element={<TemplateListPage />} />
          <Route path="templates/new" element={<TemplateCreateNewPage />} />
          <Route path="templates/new/create" element={<TemplateCreatePage />} />
          <Route path="templates/new/clone/:id" element={<TemplateClonePage />} />
          <Route path="templates/:id" element={<TemplateViewPage />} />
          <Route path="templates/:id/edit" element={<TemplateEditPage />} />
          <Route path="journeys" element={<JourneyListPage />} />
          <Route path="journeys/new" element={<JourneyCreatePage />} />
          <Route path="journeys/:id" element={<JourneyViewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
