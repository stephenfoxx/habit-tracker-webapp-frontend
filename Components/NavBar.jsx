import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // get current route
  const sidebarRef = useRef(null);

  // Hide sidebar button on specific routes
  const hideSidebarButton = ["/", "/signup"].includes(location.pathname);

  function toggleSideBar() {
    setIsOpen(!isOpen);
  }

  // Close sidebar when clicking anywhere inside it
  function handleSidebarClick() {
    setIsOpen(false);
  }

  //  Close sidebar if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav>
      <div className="nav-div">
        <h2 className="logo">Habit-Tracker-App</h2>

        {!hideSidebarButton && (
          <button onClick={toggleSideBar}>{isOpen ? "✖" : "☰"}</button>
        )}

        <ul
          ref={sidebarRef}
          className={`sidebar ${isOpen ? "open" : ""}`}
          onClick={handleSidebarClick} // close sidebar on any click inside
        >
          <li>
            <Link to="/profile" onClick={(e) => e.stopPropagation()}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/home" onClick={(e) => e.stopPropagation()}>
              Habits
            </Link>
          </li>
          <li>
            <Link to="/analytics" onClick={(e) => e.stopPropagation()}>
              Analytics
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
