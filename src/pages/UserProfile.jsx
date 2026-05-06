import { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${userId}`
      );

      setUser(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", localStorage.getItem("userId"));

    try {
      await axios.post("http://localhost:5000/api/auth/upload", formData);
      fetchUser(); 
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">

      <div className="sidebar">

          <img
            src={
              user.profilePic
                ? `http://localhost:5000/uploads/${user.profilePic}`
                : "/default.png"
            }
            className="profile-img"
          />

          <div>
            <h2>{user.firstName}</h2>
            <p>{user.email}</p>

            <label className="upload-btn">
              Change Photo
              <input type="file" hidden onChange={handleUpload} />
            </label>

        </div>

        <div className="dashboard-card">
          <h3>Subscription</h3>

          <p className={`status ${user.premium ? "premium" : "free"}`}>
            Status: {user.premium ? "Premium" : "Free"}
          </p>

          <p>Plan: {user.premiumPlan}</p>

          {!user.premium && (
            <button
              className="upgrade-btn"
              onClick={() => navigate("/subscription")}
            >
              Upgrade
            </button>
          )}
        </div>

      </div>

      <div className="main-content">

        <h2>Welcome, {user.firstName} 👋</h2>

        <p>Start listening to your favorite music 🎧</p>

      </div>

    </div>
  );
}

export default Dashboard;