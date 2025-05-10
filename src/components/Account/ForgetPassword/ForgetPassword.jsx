import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../../services/ApiService";
import "./ForgetPassword.css";
import { Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = async () => {
    try {
      const newOTP = generateOTP();
      localStorage.setItem("otp", newOTP);
      localStorage.setItem("email", email);

      const request = {
        email: email,
        otp: newOTP,
      };

      const response = await forgetPassword(request);

      if (response) {
        toast.success("OTP sent successfully!");
        setTimeout(() => {
          navigate("/verifyOtp");
        }, 3000);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};

    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Email is invalid";

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      await handleSendOTP();
    }
  };

  return (
    <Row className="vh100forgot mp0">
      <Col className="col-md-8 col-sm-12 mp0">
        <div className="forgot-password-image">
          <img
            src={require("../../../assests/Register.jpg")}
            alt="Forgot Password"
          />
        </div>
      </Col>
      <Col className="col-md-4 main-forgot-password-css">
        <div className="forgot-password-content">
          <h2 className="forgot-password-title">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <button type="submit" className="btn-forgot-password">
              Send OTP
            </button>
          </form>
          <div className="login-link">
            <span>Remembered your password? </span>
            <a href="/signin">Sign in here</a>
          </div>
        </div>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default ForgetPassword;