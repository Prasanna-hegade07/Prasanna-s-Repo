import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function Login() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [adminMode, setAdminMode] = useState(false);

const navigate = useNavigate();

const handleLogin = async (e) => {

e.preventDefault();

if (adminMode) {

if (
email === "admin@spotify.com" &&
password === "admin123"
) {

localStorage.setItem("admin", true);

alert("Admin Login Successful");

navigate("/AdminDashboard");

} else {

alert("Invalid Admin Credentials");

}

return;

}

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

localStorage.setItem(
"userId",
response.data.user._id
);

alert("Login Successful");

navigate("/");

} catch (error) {

if (
error.response?.data?.message ===
"User not found"
) {

alert(
"Account does not exist. Please create an account first."
);

navigate("/Registration");

}

else if (
error.response?.data?.message ===
"Invalid credentials"
) {

alert("Incorrect password");

}

else {

alert("Login failed");

}

}

};

return (

<div className="login-page">

<div className="overlay">

<div className="login-card">

<div className="spotify-logo">
<img
src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
alt="spotify"
/>
</div>

<h1>
{adminMode ? "Admin Login" : "Log in to Spotify"}
</h1>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email address"
value={email}
onChange={(e) =>
setEmail(e.target.value)
}
required
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e) =>
setPassword(e.target.value)
}
required
/>

<button type="submit">
{adminMode ? "Admin Login" : "Log In"}
</button>

</form>

<div className="switch-mode">

<p>

{adminMode
? "Switch to User Login"
: "Switch to Admin Login"}

</p>

<label className="switch">

<input
type="checkbox"
checked={adminMode}
onChange={() =>
setAdminMode(!adminMode)
}
/>

<span className="slider"></span>

</label>

</div>

{!adminMode && (

<p className="signup-link">

Don't have an account?

<Link to="/Registration">
Sign up
</Link>

</p>

)}

</div>

</div>

</div>

);

}

export default Login;