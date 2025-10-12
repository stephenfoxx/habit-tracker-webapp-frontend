import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "../Components/Signup";
import Welcome from "../Components/Welcome";
import NavBar from "../Components/NavBar";
import Home from "../Components/Home";
import Profile from "../Components/Profile";
import Analytics from "../Components/analytics/Analytics";
import HabitContent from "../Components/analytics/HabitContent";
import ThemeContent from "../Components/ThemeContent";


export default function App() {
  return (
    <HabitContent>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </HabitContent>
  );
}
