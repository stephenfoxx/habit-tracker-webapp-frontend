import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // get current route

  // Hide sidebar button on specific routes
  const hideSidebarButton = ["/", "/signup"].includes(location.pathname);

  function toggleSideBar() {
    setIsOpen(!isOpen);
  }

  return (
    <nav>
      <div className="nav-div">
        <h2 className="logo">Habit-Tracker-App</h2>

        {!hideSidebarButton && (
          <button onClick={toggleSideBar}>{isOpen ? "✖" : "☰"}</button>
        )}

        <ul className={`sidebar ${isOpen ? "open" : ""}`}>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/home">Habits</Link>
          </li>
          <li>
            <Link to="/analytics">Analytics</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
