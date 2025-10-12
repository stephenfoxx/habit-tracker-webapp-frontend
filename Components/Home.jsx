import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Tab from "./Tab";

export default function Home() {
  const [timeleft, setTimeleft] = useState("");
  const [bedTimeStr, setBedTimeStr] = useState("21:00");
  const location = useLocation();

  const storedFirstName = localStorage.getItem("firstName");
  const firstName = location.state?.firstName || storedFirstName || "user";

  const token = localStorage.getItem("token"); 




  // Fetch user's bedtime
  useEffect(() => {
    async function fetchBedtime() {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/auth/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.bedtime) setBedTimeStr(data.bedtime);
      } catch (err) {
        console.error("Failed to fetch bedtime", err);
      }
    }

    fetchBedtime();
  }, [token]);

  // Update countdown every second
  useEffect(() => {
    //console.log("useEffect running...");
    const interval = setInterval(() => {
      const now = new Date();
      // const bedTime = new Date();
      // bedTime.setHours(21, 0, 0, 0);

      // Parse the user's bedtime
      const [hours, minutes] = bedTimeStr.split(":").map(Number);
      const bedTime = new Date();
      bedTime.setHours(hours, minutes, 0, 0);

      if (now > bedTime) {
        bedTime.setDate(bedTime.getDate() + 1);
      }

      // to get difference in current time and bedtime
      const diff = bedTime - now;

      if (diff > 0) {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const timeStr = `${hrs}h ${mins}m ${secs}s`;
        //console.log("Setting timeleft:", timeStr);
        setTimeleft(timeStr);
      } else {
        setTimeleft("It's bedtime!");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bedTimeStr]); // ✅ include bedTimeStr

  return (
    <main className="home-main">
      <div className="main-content">
        <h1>Hey There, {firstName}</h1>
        <h2>{timeleft} until bedtime</h2>

        <Tab />
      </div>
    </main>
  );
}
