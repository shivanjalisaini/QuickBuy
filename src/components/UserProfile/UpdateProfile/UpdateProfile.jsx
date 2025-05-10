import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getViewProfile, updateProfile } from "../../../services/ApiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import "./UpdateProfile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [mobileError, setMobileError] = useState("");

  const defaultUser = {
    profilePicture:
      "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log("Fetching profile for user ID:", userId);
      getViewProfile(userId)
        .then((response) => {
          console.log(response);
          if (response.succeeded) {
            const data = response.data;
            setUsername(`${data.firstName} ${data.lastName}`);
            setMobile(data.phone);
            setEmail(data.email);
            if (data.profileImage) {
              setProfilePicture(`data:image/jpeg;base64,${data.profileImage}`);
            } else {
              setProfilePicture(defaultUser.profilePicture);
            }
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the profile!", error);
        });
    }
  }, [defaultUser.profilePicture]);

  const handleSaveChanges = async () => {
    if (!validateMobile(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    const userId = localStorage.getItem("userId");
    console.log("Updating profile for user ID:", userId);
    const [firstName, lastName] = username.split(" ");

    const updateData = {
      userId: parseInt(userId),
      firstName,
      lastName,
      phone: mobile,
      email,
    };

    if (newProfilePicture) {
      const base64Image = await toBase64(newProfilePicture);
      updateData.profileImage = base64Image.replace(
        /^data:image\/[a-zA-Z]+;base64,/,
        ""
      );
    } else {
      if (profilePicture === defaultUser.profilePicture) {
        const base64DefaultImage = await toBase64FromUrl(
          defaultUser.profilePicture
        );
        updateData.profileImage = base64DefaultImage;
      } else {
        updateData.profileImage = profilePicture.replace(
          /^data:image\/[a-zA-Z]+;base64,/,
          ""
        );
      }
    }

    console.log(updateData);
    updateProfile(userId, updateData)
      .then((response) => {
        if (response.succeeded) {
          console.log("Profile updated successfully!");
          toast.success("Profile updated successfully!");
          if (newProfilePicture) {
            setProfilePicture(URL.createObjectURL(newProfilePicture));
          }
          setTimeout(() => {
            navigate("/viewProfile");
          }, 3000);
        } else {
          toast.error("Profile update failed");
          console.error("Profile update failed:", response.message);
        }
      })
      .catch((error) => {
        toast.error("Network Error");
        console.error("There was an error updating the profile!", error);
      });
  };

  const toBase64FromUrl = (url) => {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  };

  const handleDeleteProfilePicture = async () => {
    const userId = localStorage.getItem("userId");
    console.log("Deleting profile picture for user ID:", userId);

    const updateData = {
      userId: parseInt(userId),
      firstName: username.split(" ")[0],
      lastName: username.split(" ")[1],
      phone: mobile,
      email: email,
      profileImage: await toBase64FromUrl(defaultUser.profilePicture),
    };

    updateProfile(userId, updateData)
      .then((response) => {
        if (response.succeeded) {
          console.log("Profile picture deleted and updated successfully!");
          toast.success("Profile picture deleted successfully!");
          setProfilePicture(defaultUser.profilePicture);
        } else {
          toast.error("Failed to delete profile picture");
          console.error("Profile update failed:", response.message);
        }
      })
      .catch((error) => {
        toast.error("Network Error");
        console.error("There was an error updating the profile!", error);
      });
  };
  const handleChangeProfilePicture = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePicture(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      setMobileError("Mobile number must be exactly 10 digits");
      return false;
    }
    setMobileError("");
    return true;
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMobile(value);
    }
  };

  return (
    <div className="update-profile">
      <div className="profile-header">
        <img src={profilePicture} alt="Profile" className="profile-picture" />
        <div className="haha">
          {" "}
          <button
            className="change-picture-button"
            onClick={handleChangeProfilePicture}
          >
            Edit Profile Pic
          </button>
          <button
            className="delete-picture-button"
            onClick={handleDeleteProfilePicture}
          >
            Delete Profile Pic
          </button>
        </div>

        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      <h2>User Profile</h2>
      <div className="profile-details">
        <div className="profile-item">
          <span>Name:</span>
          {isEditingName ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              autoFocus
            />
          ) : (
            <span>{username}</span>
          )}
          <FontAwesomeIcon
            icon={faPen}
            className="edit-icon"
            onClick={() => setIsEditingName(!isEditingName)}
          />
        </div>
        <div className="profile-item">
          <span>Mobile No:</span>
          {isEditingMobile ? (
            <>
              <input
                type="text"
                value={mobile}
                onChange={handleMobileChange}
                onBlur={() => setIsEditingMobile(false)}
                maxLength="10"
                autoFocus
              />
              {mobileError && (
                <div className="error-message">{mobileError}</div>
              )}
            </>
          ) : (
            <span>{mobile}</span>
          )}
          <FontAwesomeIcon
            icon={faPen}
            className="edit-icon"
            onClick={() => setIsEditingMobile(!isEditingMobile)}
          />
        </div>
        <div className="profile-item">
          <span>Email ID:</span>
          {isEditingEmail ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setIsEditingEmail(false)}
              autoFocus
            />
          ) : (
            <span>{email}</span>
          )}
          <FontAwesomeIcon
            icon={faPen}
            className="edit-icon"
            onClick={() => setIsEditingEmail(!isEditingEmail)}
          />
        </div>
      </div>
      <button onClick={handleSaveChanges} className="save-button">
        Save Changes
      </button>
      <ToastContainer />
    </div>
  );
};

export default UpdateProfile;