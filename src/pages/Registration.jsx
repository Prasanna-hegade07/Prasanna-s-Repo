import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Registration.css";

function Registration() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { firstName, lastName, email, password };

    try {
      await axios.post(
        "https://spotify-backend-lug8.onrender.com/api/auth/register",
        formData
      );

      alert("User Registered Successfully");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    }
  };

  return (
    <div className="Reg-page">
      <nav className="navigationbar">
        <div className="navigationlogo">
          <img src="/images/logob.png" alt="Spotify" />
        </div>
        <div className="navbtns">
          <Link to="/Home" className="regbtnnav">Home</Link>
          <Link to="/Adminlogin" className="regbtnnav">Admin Login</Link>
          <Link to="/Login" className="regbtnnav primary">Sign in</Link>
        </div>
      </nav>

      <div className="Reg-overlay">
        <div className="Reg-card">

          <div className="Reg-card-logo">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
              alt="Spotify"
            />
          </div>

          <h1>Create account</h1>
          <p className="subtitle">Start listening for free today.</p>

          <form className="Reg-form" onSubmit={handleSubmit}>

            <div className="name-row">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="Reg-btn">
              Sign Up to Listen
            </button>

          </form>

          <p className="signup-text">
            Already a listener?
            <Link to="/Login">Log in here</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Registration;