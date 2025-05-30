import HomePage from "./pages/HomePage";
import EventViewPage from "./pages/EventViewPage";
import EventListPage from "./pages/EventListPage";
import EventCreatePage from "./pages/EventCreatePage";
import EventEditPage from "./pages/EventEditPage";
import JourneyListPage from "./pages/JourneyListPage";
import PropertyListPage from "./pages/PropertyListPage";
import Layout from "./layout/Layout"

import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="events/new" element={<EventCreatePage />} />
          <Route path="events/:id" element={<EventViewPage />} />
          <Route path="events/:id/edit" element={<EventEditPage />} />
          <Route path="journeys" element={<JourneyListPage />} />
          <Route path="properties" element={<PropertyListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
