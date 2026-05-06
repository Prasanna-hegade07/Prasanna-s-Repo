import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Adminlogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAdminlogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/Adminlogin",
        { email, password }
      );

      alert(res.data.message);

      navigate("/AdminDashboard");

    } catch (err) {

      alert("Invalid Admin Credentials");

    }
  };

  return (
    <div className="login-container">

      <nav className="navigationbar">
          <div className="navigationlogo"><img 
          src="/images/logob.png"
          className="logo"
        /></div>   
            <div className="navbtns">
                <Link to="/Home" className="loginbtnnav">Home</Link>
                <Link to="/Login" className="loginbtnnav">Dashboard</Link>
            </div>
            </nav>

      <div className="login-card">
        
        <h1>Admin Sign in</h1>

        <form className="login-form" onSubmit={handleAdminlogin}>
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="Enter the Email address" required value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password:</label>
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" className="login-btn">
            sing In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}


export default Adminlogin;