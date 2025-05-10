import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "./VerifyOtp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOTP] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const storedOTP = localStorage.getItem("otp");
    const storedEmail = localStorage.getItem("email");

    const request = {
      email: storedEmail,
      otp: otp,
    };

    const simulatedResponse = { success: request.otp === storedOTP };

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(simulatedResponse);
    if (simulatedResponse.success) {
      setVerificationStatus("success");
      toast.success("OTP verified successfully!");
      setTimeout(() => {
        navigate("/resetPassword");
      }, 3000);
    } else {
      setVerificationStatus("error");
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <Row className="vh100verifyOtp mp0">
      <Col md={8} sm={12} className="mp0">
        <div className="verifyOtp-image">
          <img
            src={require("../../../assests/Register.jpg")}
            alt="Verify OTP"
          />
        </div>
      </Col>
      <Col md={4} className="verifyOtp-main-content">
        <div className="verifyOtp-content">
          <h2 className="verifyOtp-title">Verify OTP</h2>
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label>One Time Password</label>
              <input
                type="text"
                className={`form-control ${
                  verificationStatus === "error" ? "is-invalid" : ""
                }`}
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                required
              />
              {verificationStatus === "error" && (
                <div className="invalid-feedback">
                  Invalid OTP. Please try again.
                </div>
              )}
            </div>
            <button type="submit" className="btn-verifyOtp">
              Verify OTP
            </button>
          </form>
          <div className="verifyOtp-footer">
            <a href="/forgetPassword">Back to Forgot Password</a>
          </div>
        </div>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default VerifyOTP;