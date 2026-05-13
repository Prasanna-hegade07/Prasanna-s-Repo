import { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function UserProfile() {

  const [userData, setUserData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    if (user?._id) {
      fetchProfile();
    }

  }, []);

  const fetchProfile = async () => {

    try {

      const res = await axios.get(
        `${BASE_URL}/api/auth/profile/${user._id}`
      );

      setUserData(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  if (!userData) {
    return <h2>Loading...</h2>;
  }

  return (

    <div className="profile-container">

      <div className="profile-card">

       <img
  src={
    userData.profilePic
      ? `${BASE_URL}/uploads/${userData.profilePic}`
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  }
  alt="profile"
  className="profile-image"
/>

        <h2>{userData.name}</h2>

        <p>{userData.email}</p>

        <h3>
          Subscription :
          <div
  className={`subscription ${
    userData.isPremium ? "premium" : "free"
  }`}
>
  {userData.isPremium
    ? "👑 Premium User"
    : "Free User"}
</div>
        </h3>

      </div>

    </div>
  );
}

export default UserProfile;