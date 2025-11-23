import React from "react";
import { Link, useNavigate } from "react-router-dom";

// ✅ Use deployed backend URL
const API = import.meta.env.VITE_API_URL;

export default function Welcome() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");

        // Extract just the first name (before space)
        const firstName = data.user.username.split(" ")[0];

        // ✅ Clear any previous data from localStorage
        localStorage.clear();

        // ✅ Save token, user info for authenticated routes
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("email", data.user.email);

        // ✅ Navigate to Home page (with state)
        navigate("/home", { state: { firstName } });
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again later.");
    }
  }

  return (
    <main className="welcome-main">
      <div className="welcomemain-div">
        <div className="div-welcome">
          <h1 className="w-h1">WELCOME!!</h1>
          <h2 className="w-h2">
            Track your habits and live a healthy lifestyle.
          </h2>
        </div>

        <form className="input-div" onSubmit={handleLogin}>
          <h2 className="f-h2">Please login here</h2>
          <input
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="err">{error}</p>
          <button className="input-button" type="submit">
            Login
          </button>
        </form>

        <p className="welcome-p">
          Don’t have an account yet? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
