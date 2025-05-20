import { NavLink } from "react-router-dom";
import { FileText, Footprints } from "lucide-react";

const sidebarItems = [
  { name: "Templates", path: "/templates", Icon: FileText },
  { name: "Journey Tracking", path: "/journeys",  Icon: Footprints  },
];

export default function Sidebar() {
  // main container has top-16 as the header height is 16, which is 4 rem.
  // height is set to 100 viewport height minus the bar
  return (
    <aside className="w-64 bg-white sticky top-16 h-[calc(100vh-4rem)]">
        <nav className="flex flex-col p-4 space-y-2">
            {sidebarItems.map((item) => (
                
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded hover:bg-gray-50 transition-colors ${
                        isActive ? "bg-blue-50 font-semibold text-blue-800" : "text-gray-700"
                        }`
                    }              
                >
                    < item.Icon size={16} aria-hidden="true" className="mr-2"/>
                    {item.name}
                </NavLink>
            ))}
        </nav>
    </aside>
  );
}
