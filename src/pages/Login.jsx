import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate=useNavigate();

const handleLogin=async(e)=>{
e.preventDefault();

try{

const response=await axios.post(
"http://localhost:5000/api/auth/login",
{
email,
password
}
);

// STORE USER ID FOR PAYMENT PREMIUM UPDATE
localStorage.setItem(
"userId",
response.data.user._id
);

// optional store user name
localStorage.setItem(
"userName",
response.data.user.firstName
);

alert("Login Successful");

navigate("/UserProfile");

}catch(error){

alert(
error.response?.data?.message ||
"Invalid Email or Password"
);

}
};

return(
<div className="login-container">

<nav className="navigationbar">

<div className="navigationlogo">
<img
src="/images/logob.png"
className="logo"
/>
</div>

<div className="navbtns">
<Link to="/Home" className="loginbtnnav">
Home
</Link>

<Link to="/Registration" className="regbtnnav">
Sign up
</Link>

<Link to="/Adminlogin" className="regbtnnav">
Admin Login
</Link>

</div>

</nav>


<div className="login-card">

<h1>Sign in</h1>

<form
className="login-form"
onSubmit={handleLogin}
>

<label>Email:</label>

<input
type="email"
placeholder="Enter the Email address"
required
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<label>Password:</label>

<input
type="password"
placeholder="Password"
required
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
type="submit"
className="login-btn"
>
Sign In to Listen
</button>

</form>

<center>
<p>or</p>
</center>

<p className="signup-text">
Don’t have an account?{" "}
<Link to="/Registration">
Sign up for Spotify
</Link>
</p>

</div>

</div>
);

}

export default Login;