import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postChangePassowrd } from "../../../services/ApiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ChangePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userId = localStorage.getItem("userId");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const requestData = {
      userId: parseInt(userId),
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      const response = await postChangePassowrd(requestData);

      if (response) {
        toast.success("Password changed successfully!");
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Row className="vh100 mp0">
      <Col className="col-md-8 col-sm-10 mp0">
        <div className="change-password-image">
          <img
            src={require("../../../assests/Register.jpg")}
            alt="Change Password"
          />
        </div>
      </Col>
      <Col className="col-md-4 main-change-password-css">
        <div className="change-password-content">
          <h1 className="change-password-title">EzyStore</h1>
          <h2 className="change-password-subtitle">Change Your Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group password-group">
              <label htmlFor="oldPassword">Old Password</label>
              <div className="password-wrapper">
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  icon={showOldPassword ? faEye : faEyeSlash}
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="toggle-password-icon"
                />
              </div>
            </div>

            <div className="form-group password-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  icon={showNewPassword ? faEye : faEyeSlash}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="toggle-password-icon"
                />
              </div>
            </div>

            <div className="form-group password-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  required
                />
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEye : faEyeSlash}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password-icon"
                />
              </div>
              {error && <p className="error">{error}</p>}
            </div>

            <button type="submit" className="btn-change-password">
              Change Password
            </button>
          </form>
        </div>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default ChangePassword;