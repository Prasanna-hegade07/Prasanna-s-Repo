import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    } else {
      navigate("/Login");
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/profile/${user._id}`);
      setUserData(res.data);

      // FIXED: keep localStorage in sync with latest DB data
      const updated = {
        ...user,
        isPremium:        res.data.isPremium,
        subscriptionType: res.data.subscriptionType,
        premiumPlan:      res.data.premiumPlan,
        profilePic:       res.data.profilePic,
      };
      localStorage.setItem("user", JSON.stringify(updated));

    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/Login");
  };

  if (!userData) {
    return <h2 className="loading">Loading profile…</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* Avatar */}
        <div className="profile-avatar-wrap">
          <img
            src={
              userData.profilePic
                ? `${BASE_URL}/uploads/${userData.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            className="profile-image"
          />
          {userData.isPremium && <div className="profile-premium-ring" />}
        </div>

        <h2>{userData.name}</h2>
        <p className="email">{userData.email}</p>

        {/* Premium badge */}
        <div className={`subscription-badge ${userData.isPremium ? "premium" : "free"}`}>
          {userData.isPremium ? "👑 Premium Member" : "🎵 Free User"}
        </div>

        {/* Details */}
        <div className="profile-details">
          <div className="profile-detail-row">
            <span className="detail-label">Plan</span>
            <span className={`detail-value ${userData.isPremium ? "green" : ""}`}>
              {userData.subscriptionType || "Free"}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="detail-label">Current Package</span>
            <span className="detail-value">
              {userData.premiumPlan && userData.premiumPlan !== "None"
                ? userData.premiumPlan
                : "—"}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">
              {userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : "—"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          {!userData.isPremium && (
            <button className="upgrade-btn" onClick={() => navigate("/Subscription")}>
              👑 Upgrade to Premium
            </button>
          )}
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>

      </div>
    </div>
  );
}

export default UserProfile;