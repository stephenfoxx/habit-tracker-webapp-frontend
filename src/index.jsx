import { createRoot } from "react-dom/client";
import App from "./App";
import Welcome from "../Components/Welcome";
import Signup from "../Components/Signup";
import Home from "../Components/Home";
import Tab from "../Components/Tab";
import NavBar from "../Components/NavBar";
import Profile from "../Components/Profile";
import ThemeContent from "../Components/ThemeContent";

const root = createRoot(document.getElementById("root")).render(
  <ThemeContent>
    <App />
  </ThemeContent>
);
