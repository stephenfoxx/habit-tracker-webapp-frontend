import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../Components/ThemeContent";

// ✅ Use deployed backend URL
const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    bedtime: "",
    profileImage: "",
  });

  const [editName, setEditName] = useState("");
  const [editBedTime, setEditBedTime] = useState("");
  const [preview, setPreview] = useState("");

  const token = localStorage.getItem("token");

  // -------------------- Fetch Profile --------------------
  useEffect(() => {
    async function fetchProfile() {
      if (!token) return;

      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        setUser({
          username: data.username,
          bedtime: data.bedtime,
          profileImage: data.profileImage || "",
        });
        setEditName(data.username);
        setEditBedTime(data.bedtime);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProfile();
  }, [token]);

  // -------------------- Handle Image Change --------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setPreview(base64);

      try {
        const res = await fetch(`${API}/auth/me/image`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profileImage: base64 }),
        });

        if (!res.ok) throw new Error("Failed to update image");

        const updatedUser = await res.json();
        setUser(updatedUser);
      } catch (err) {
        console.error(err);
      }
    };

    reader.readAsDataURL(file);
  };

  // -------------------- Save Profile --------------------
  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: editName, bedtime: editBedTime }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditName(updatedUser.username);
      setEditBedTime(updatedUser.bedtime);
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------- Logout --------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    navigate("/"); // redirect to login page
  };

  return (
    <main className="profile">
      <h1>Profile</h1>

      <div className="profile-image-div">
        <img
          src={preview || user.profileImage || "wick.jpg"}
          alt="profile"
          className="profile-img"
        />
        <div>
          <h2>{user.username}</h2>
          <p>Bedtime: {user.bedtime}</p>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      </div>

      <h2>Edit Profile</h2>
      <div className="profile-input-div">
        <label>
          Name:
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </label>
        <label>
          Bedtime:
          <input
            type="time"
            value={editBedTime}
            onChange={(e) => setEditBedTime(e.target.value)}
          />
        </label>
        <button onClick={handleSave}>Save</button>
      </div>

      <div className="toggle-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-text">
          {darkMode ? "Dark Mode" : "Light Mode"}
        </span>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </main>
  );
}

// function firstU(str) {
//   const count = [];

//   for (let char of str) {
//     count[char] = (count[char] || 0) + 1;

//     for (let char of str) {
//       if (count[char] === 1) {
//         return char
//       }
//     }
//   }
//   return null;
// }

// function filterAndSort(arr) {
//   return arr.filter(num => num & 2 === 0).sort((a, b) => a - b)
// }

// function updateTools(todos, newtodo) {
//   return [...todos, newtodo].filter(item => item.trim() !== "").sort();
// }
