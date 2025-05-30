import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "../components/SideBar";

export default function Layout() {
  // Styling wise, the header is 16 so 4 rem
  // which is why max height is set to 100 vh - 4rem max, with auto vertical scrolling

  //"flex-1 p-6  bg-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto" Outlet former class
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 max-h-[calc(100vh-4rem)] overflow-y-auto bg-gray-200">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}
