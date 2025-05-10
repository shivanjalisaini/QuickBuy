import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/ApiService";
import "./Login.css";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|redmail\.com)$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages({ email: "", password: "" });

    let hasError = false;

    if (!email) {
      setErrorMessages((prev) => ({ ...prev, email: "Email is required." }));
      hasError = true;
    } else if (!validateEmail(email)) {
      setErrorMessages((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      hasError = true;
    }

    if (!password) {
      setErrorMessages((prev) => ({
        ...prev,
        password: "Password is required.",
      }));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await loginUser({ email, password });
      if (response.succeeded) {
        toast.success(response.message);
        const userId = response.data.userId;
        localStorage.setItem("userId", userId);
        setTimeout(() => {
          navigate("/landingPage");
        }, 3000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred during login.");
      console.error("Login error:", error);
    }
  };

  return (
    <Row className="vh100login mp0">
      <Col className="col-md-8 col-sm-12 mp0">
        <div className="login-image">
          <img src={require("../../../assests/Register.jpg")} alt="Login" />
        </div>
      </Col>
      <Col className="col-md-4 main-login-css">
        <div className="login-content">
          <h2 className="login-title">Sign in to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errorMessages.email ? "login-error-input" : ""}
              />
              {errorMessages.email && (
                <span className="login-error-message">
                  {errorMessages.email}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errorMessages.password ? "login-error-input" : ""}
                />
                <span
                  className="password-toggle-icon"
                  onClick={handleTogglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              </div>
              {errorMessages.password && (
                <span className="login-error-message">
                  {errorMessages.password}
                </span>
              )}
            </div>
            <button type="submit" className="btn-login">
              Sign In
            </button>
          </form>
          <div className="forgot-password">
            <a href="/forgetPassword">Forgot password?</a>
          </div>
          <div className="signup-link">
            <span>Don’t have an account? </span>
            <a href="/signup">Create Account</a>
          </div>
        </div>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default Login;