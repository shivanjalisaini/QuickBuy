import React, { useState } from "react";
import { postResetPassword } from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./ResetPassword.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const email = localStorage.getItem("email");
      const otp = localStorage.getItem("otp");

      const request = {
        email: email,
        otp: otp,
        newPassword: newPassword,
      };

      const response = await postResetPassword(request);
      console.log(response);

      if (response) {
        toast.success("Password reset successfully!");
        localStorage.removeItem("email");
        localStorage.removeItem("otp");
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Row className="vh100reset mp0">
      <Col className="col-md-8 col-sm-12 mp0">
        <div className="reset-image">
          <img
            src={require("../../../assests/Register.jpg")}
            alt="Reset Password"
          />
        </div>
      </Col>
      <Col className="col-md-4 main-reset-css">
        <div className="reset-content">
          <h2 className="reset-title">Reset Your Password</h2>
          <div className="reset-card">
            <label>Enter New Password</label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                className="reset-form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="input-icon"
                onClick={handleToggleNewPasswordVisibility}
              >
                <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <label>Confirm New Password</label>
            <div className="input-group">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                className="reset-form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="input-icon"
                onClick={handleToggleConfirmNewPasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showConfirmNewPassword ? faEye : faEyeSlash}
                />
              </span>
            </div>
            <button className="btn-reset" onClick={handleResetPassword}>
              SUBMIT
            </button>
          </div>
          <div className="login-link">
            <span>Remembered your password? </span>
            <a href="/signin">Sign In</a>
          </div>
        </div>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default ResetPassword;