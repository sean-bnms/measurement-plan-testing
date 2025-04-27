import { NavLink } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to the DataLayer Tool</h1>
        <p className="mb-2">Get started by exploring the template manager.</p>
        <NavLink
            to="/templates"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Go to Templates
        </NavLink>
    </div>
  );
}
