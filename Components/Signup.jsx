import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const navigate = useNavigate();

  function handleFirstname(e) {
    setFirstname(e.target.value);
  }
  function handleLastname(e) {
    setLastname(e.target.value);
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }

async function handleRegister(e) {
    e.preventDefault();

    // Validate names first
    if (!firstname.trim()  || !lastname.trim() ) {
      setError("Please enter your first and last name");
      return;
    }

    // Validate email and password
    if (!email.trim() || !password.trim()) {
      setError("please enter email and password");  
    } 

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
    
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: `${firstname} ${lastname}`,
          email,
          password,
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setError("")
        navigate("/")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (err) {
      console.error("Something went wrong, try again later.", err)
      setError("something went wrong, try again later.")
}


  }

  return (
    <main className="signup-main">

      <div className="signup-div">
      <form className="signup-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First name"
          onChange={handleFirstname}
        />
        <input type="text" placeholder="Last name" onChange={handleLastname} />
        <input type="text" placeholder="Email" onChange={handleEmail} />
        <input
          type="password"
          placeholder="Password"
          onChange={handlePassword}
        />
        <p className="err">{error}</p>
        <button type="submit">Register</button>
      </form>
      <p className="signup-p">
        <Link to="/">Login here</Link>
      </p>
      </div>
    </main>
  );
}
