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

    const formData = {
      firstName,
      lastName,
      email,
      password
    };

    try {

      const response = await axios.post(
        "https://spotify-backend-lug8.onrender.com/api/auth/register",
        formData
      );

      alert("User Registered Successfully");

      //clearing form fields
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
    <div className="Reg-container">

      <nav className="navigationbar">
            <div className="navigationlogo"><img 
          src="/images/logob.png"
          className="logo"
        /></div>   
            <div className="navbtns">
                <Link to="/Login" className="loginbtnnav">Sign in</Link>
                <Link to="/Home" className="regbtnnav">Home</Link>
                <Link to="/Adminlogin" className="regbtnnav">Admin Login</Link>
            </div>
            </nav>

      <div className="Reg-card">

        <h1>Sign up</h1>

        <form className="Reg-form" onSubmit={handleSubmit}>

          <label>First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter the Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="Reg-btn">
            Sign Up to Listen
          </button>

        </form>

        <p className="signup-text">
          Already a Listener?{" "}
          <Link to="/login">Login to Listen</Link>
        </p>

      </div>
    </div>
  );
}

export default Registration;