import { useState, useEffect, useContext } from "react";
import { HabitsContexts } from "./analytics/HabitContent";

// ✅ Use deployed backend URL
const API = import.meta.env.VITE_API_URL;

export default function Tab() {
  const [dateTime, setDateTime] = useState(new Date());
  const { habits, setHabits, activeBoxes, setActiveBoxes } =
    useContext(HabitsContexts);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);

  const token = localStorage.getItem("token");

  // -------------------- Update Time Every Second --------------------
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = dateTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // -------------------- Load Habits --------------------
  useEffect(() => {
    async function loadHabits() {
      if (!token) return;

      try {
        const res = await fetch(`${API}/habits`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch habits");

        const data = await res.json();

        setHabits(data);
        setActiveBoxes(data.map((h) => h.completed || Array(7).fill(false)));
      } catch (err) {
        console.error("Failed to load habits:", err);
      }
    }

    loadHabits();
  }, [token, setHabits, setActiveBoxes]);

  // -------------------- Toggle Habit --------------------
  async function toggleHabit(row, col) {
    const newBoxes = activeBoxes.map((inner) => [...inner]);
    newBoxes[row][col] = !newBoxes[row][col];
    setActiveBoxes(newBoxes);

    // Update server
    try {
      const habitId = habits[row]._id;
      await fetch(`${API}/habits/${habitId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dayIndex: col, value: newBoxes[row][col] }),
      });

      // Show congrats if all habits for the day are completed
      const allCompleted = newBoxes.every((row) => row[col]);
      if (allCompleted) {
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 10000);
      }
    } catch (err) {
      console.error("Toggle habit failed:", err);
    }
  }

  // -------------------- Add Habit --------------------
  async function addHabit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newHabitName = formData.get("newHabits")?.toString().trim();
    if (!newHabitName) return;

    try {
      const res = await fetch(`${API}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newHabitName }),
      });

      const data = await res.json();
      setHabits((prev) => [...prev, data]);
      setActiveBoxes((prev) => [
        ...prev,
        data.completed || Array(7).fill(false),
      ]);
      e.currentTarget.reset();
    } catch (err) {
      console.error("Failed to add habit:", err);
    }
  }

  // -------------------- Update Habit --------------------
  async function updateHabit(index) {
    const habitId = habits[index]._id;

    try {
      const res = await fetch(`${API}/habits/${habitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editValue }),
      });

      if (!res.ok) throw new Error("Failed to update habit");

      const data = await res.json();

      setHabits((prev) =>
        prev.map((h, i) => (i === index ? { ...h, name: data.name } : h))
      );

      setEditingIndex(null);
      setEditValue("");
    } catch (err) {
      console.error("Failed to update habit:", err);
    }
  }

  // -------------------- Delete Habit --------------------
  async function removeHabit(index) {
    const habitId = habits[index]._id;
    try {
      await fetch(`${API}/habits/${habitId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabits((prev) => prev.filter((_, i) => i !== index));
      setActiveBoxes((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete habit:", err);
    }
  }

  function isHabitCompletedToday(index) {
    return activeBoxes[index]?.some((box) => box) || false;
  }

  function getDailyProgress(colIndex) {
    const totalHabits = activeBoxes.length || 1;
    const completed = activeBoxes.filter((row) => row[colIndex]).length;
    return Math.round((completed / totalHabits) * 100);
  }

  return (
    <main>
      <div className="timehabit">
        <div className="period-section">
          <div className="period-buttons">
            <button>Months</button>
            <button>Weeks</button>
            <button>Days</button>
            <button>AllTime</button>

            <form onSubmit={addHabit} className="addHabits">
              <input
                type="text"
                name="newHabits"
                placeholder="Input habits..."
              />
              <button className="timetabbutton">+ Add Habit</button>
            </form>

            <ul className="progress-list">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, col) => (
                  <li key={col}>
                    {day}: {getDailyProgress(col)}%
                  </li>
                )
              )}
            </ul>
          </div>
          <p className="date-time">{formatted}</p>
        </div>
      </div>

      <div className="habit-grid-wrapper">
        <ul className="habit-list">
          {habits.map((h, rowIndex) => (
            <li key={h._id || rowIndex} className="habit-tag">
              {editingIndex === rowIndex ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button onClick={() => updateHabit(rowIndex)}>💾</button>
                  <button onClick={() => setEditingIndex(null)}>✖</button>
                </>
              ) : (
                <>
                  {h.name}{" "}
                  {isHabitCompletedToday(rowIndex) && (
                    <span className="habit-completed-msg">✅Completed</span>
                  )}
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingIndex(rowIndex);
                      setEditValue(h.name);
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeHabit(rowIndex)}
                  >
                    ✖
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="grid-container">
          <ul className="days-list">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <li key={day}>{day}</li>
            ))}
          </ul>

          <div className="grid-boxes">
            {activeBoxes.map((row, rowIndex) =>
              row.map((isActive, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`grid-box ${isActive ? "active" : ""}`}
                  onClick={() => toggleHabit(rowIndex, colIndex)}
                ></div>
              ))
            )}
          </div>
        </div>
      </div>

      {showCongrats && (
        <div className="popup">
          🎉 Congrats! You completed all habits for this day!
        </div>
      )}
    </main>
  );
}
