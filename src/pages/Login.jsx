import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/login`,
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    alert("Login Successful");

    navigate("/");
  } catch (error) {

    if (error.response?.data?.message === "User not found") {
      alert("Account does not exist. Please create an account first.");
      navigate("/Registration");
    }

    else if (error.response?.data?.message === "Invalid credentials") {
      alert("Incorrect password");
    }

    else {
      alert("Login failed");
    }
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Sign in</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email:</label>

          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password:</label>

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account?
          <Link to="/Registration"> Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;