import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getViewProfile } from "../../../services/ApiService";
import {
  FaBox,
  FaMapMarkerAlt,
  FaStar,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";
import "./ViewProfile.css";

function ViewProfile1() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const signOut = () => {
    localStorage.removeItem("userId");
    navigate("/signin");
  };

  const defaultUser = {
    profilePicture:
      "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getViewProfile(userId)
        .then((response) => {
          console.log(response);
          if (response.succeeded) {
            setProfile(response.data);
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the profile!", error);
        });
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const profilePicture = profile.profileImage
    ? `data:image/jpeg;base64,${profile.profileImage}`
    : defaultUser.profilePicture;

  return (
    <div className="profile-container1">
      <div className="user-profile1">
        <div className="profile-left1">
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-picture1"
          />
          <h2>
            {profile.firstName} {profile.lastName}
          </h2>

          <div className="profile-options1">
            <button onClick={() => navigate("/previousOrders")}>
              <FaBox /> My Orders
            </button>
            <button onClick={() => navigate("/allAddresses")}>
              <FaMapMarkerAlt /> My Address
            </button>
            <button onClick={() => navigate("/getAllReview")}>
              <FaStar /> My Reviews
            </button>
            <button onClick={() => navigate("/changePassword")}>
              <FaKey /> Change Password
            </button>
            <button onClick={signOut}>
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>
        <div className="profile-right1">
          <h2>Profile Details</h2>
          <h4>
            {profile.firstName} {profile.lastName}
          </h4>
          <p>
            <strong>Mobile:</strong> {profile.phone}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <button
            className="edit-profile-picture-button1"
            onClick={() => navigate("/updateProfile")}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile1;