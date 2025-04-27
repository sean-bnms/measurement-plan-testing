import { Outlet } from "react-router-dom";
import Header from "./Header"

export default function Layout() {
  return (
    <>
        <Header />
        <main className="p-6 bg-gray-200 min-h-screen">
            <Outlet />
        </main>
    </>
  );
}
