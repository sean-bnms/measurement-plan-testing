import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <nav className="bg-gray-800 p-4 text-white flex gap-4">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => isActive ? "font-bold underline" : "hover:underline"}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/templates"
                    className={({ isActive }) => isActive ? "font-bold underline" : "hover:underline"}
                >
                    Templates
                </NavLink>
                <NavLink
                    to="/journeys"
                    className={({ isActive }) => isActive ? "font-bold underline" : "hover:underline"}
                >
                    Journeys
                </NavLink>
            </nav>
        </header> 
    );
}