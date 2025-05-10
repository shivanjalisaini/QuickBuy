import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, sendOtp } from "../../../services/ApiService";
import "./Signup.css";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    otpError: "",
    phoneNumberError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|redmail\.com)$/;
    return regex.test(email);
  };
  const validateMobile = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);
  const validatePassword = (password) => password.length >= 6;
  const validateOTP = (otp) => otp.length === 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    let updatedErrors = {};

    if (name === "email") {
      updatedErrors.emailError = validateEmail(value)
        ? ""
        : "Email must be a valid format and end with @gmail.com, @yahoo.com, or @hotmail.com";
    }
    if (name === "phoneNumber") {
      updatedErrors.phoneNumberError = validateMobile(value)
        ? ""
        : "PhoneNumber must be exactly 10 digits";
    }
    if (name === "password") {
      updatedErrors.passwordError = validatePassword(value)
        ? ""
        : "Password must be at least 6 characters";
    }
    if (name === "confirmPassword") {
      updatedErrors.confirmPasswordError =
        value === formValues.password ? "" : "Passwords do not match";

      if (
        validatePassword(formValues.password) &&
        value === formValues.password
      ) {
        setPasswordMatchMessage("Passwords match!");
      } else {
        setPasswordMatchMessage("");
      }
    }
    if (name === "otp") {
      updatedErrors.otpError = validateOTP(value)
        ? ""
        : "OTP must be exactly 6 digits";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...updatedErrors,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let updatedErrors = {};

    if (!formValues.firstName.trim()) {
      updatedErrors.firstNameError = "First Name is required";
      valid = false;
    }
    if (!formValues.lastName.trim()) {
      updatedErrors.lastNameError = "Last Name is required";
      valid = false;
    }
    if (!formValues.email.trim()) {
      updatedErrors.emailError = "Email is required";
      valid = false;
    } else if (!validateEmail(formValues.email)) {
      updatedErrors.emailError = "Invalid email format";
      valid = false;
    }
    if (!formValues.phoneNumber.trim()) {
      updatedErrors.phoneNumberError = "PhoneNumber is required";
      valid = false;
    } else if (!validateMobile(formValues.phoneNumber)) {
      updatedErrors.phoneNumberError = "PhoneNumber must be exactly 10 digits";
      valid = false;
    }
    if (!formValues.password.trim()) {
      updatedErrors.passwordError = "Password is required";
      valid = false;
    } else if (!validatePassword(formValues.password)) {
      updatedErrors.passwordError = "Password must be at least 6 characters";
      valid = false;
    }
    if (!formValues.confirmPassword.trim()) {
      updatedErrors.confirmPasswordError = "Confirm Password is required";
      valid = false;
    } else if (formValues.password !== formValues.confirmPassword) {
      updatedErrors.confirmPasswordError = "Passwords do not match";
      valid = false;
    }
    if (!formValues.otp.trim()) {
      updatedErrors.otpError = "OTP is required";
      valid = false;
    } else if (!validateOTP(formValues.otp)) {
      updatedErrors.otpError = "OTP must be exactly 6 digits";
      valid = false;
    }

    setErrors(updatedErrors);
    return valid;
  };

  const handleSend = async () => {
    try {
      const otp = generateOTP();
      const request = {
        email: formValues.email,
        otp,
      };
      await sendOtp(request);
      setGeneratedOTP(otp);
      setOtpEmail(formValues.email);
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error("Failed to send OTP");
      console.error("Failed to send OTP:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (formValues.email !== otpEmail) {
      toast.error(
        "Email has changed! Please verify OTP with the correct email."
      );
      return;
    }

    if (formValues.otp !== generatedOTP) {
      toast.error("Invalid OTP. Please check your email.");
      return;
    }

    try {
      const request = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        password: formValues.password,
        roleId: 1,
      };

      await registerUser(request);
      toast.success("Registration successful!");
      navigate("/signin");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Row className="vh100signup mp0">
      <Col className="col-md-7 col-sm-12 mp0">
        <div className="signup-image">
          <img src={require("../../../assests/Register.jpg")} alt="Signup" />
        </div>
      </Col>
      <Col className="col-md-5 main-signup-css">
        <div className="signup-content">
          <h2 className="signup-title">Create your account</h2>
          <form onSubmit={handleSubmit}>
            <Row>
              <div className="form-group col-md-6">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                />
                {errors.firstNameError && (
                  <span className="signup-error">{errors.firstNameError}</span>
                )}
              </div>

              <div className="form-group col-md-6">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                />
                {errors.lastNameError && (
                  <span className="signup-error">{errors.lastNameError}</span>
                )}
              </div>

              <div className="form-group col-md-12">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                />
                {errors.emailError && (
                  <span className="signup-error">{errors.emailError}</span>
                )}
              </div>

              <div className="form-group col-md-10">
                <label>OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formValues.otp}
                  onChange={handleChange}
                />
                {errors.otpError && (
                  <span className="signup-error">{errors.otpError}</span>
                )}
                <button type="button" className="getotp" onClick={handleSend}>
                  Send
                </button>
              </div>

              <div className="form-group col-md-6">
                <label>Mobile</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumberError && (
                  <span className="signup-error">
                    {errors.phoneNumberError}
                  </span>
                )}
              </div>

              <div className="form-group signup-password-group col-md-6">
                <label>Password</label>
                <div className="signup-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                  />
                  <span
                    className="signup-password-toggle-icon"
                    onClick={handleTogglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                  {errors.passwordError && (
                    <span className="signup-error">{errors.passwordError}</span>
                  )}
                </div>
              </div>

              <div className="form-group signup-password-group col-md-12">
                <label>Confirm Password</label>
                <div className="signup-confirm-password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                  />
                  <span
                    className="signup-confirm-password-toggle-icon"
                    onClick={handleToggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEye : faEyeSlash}
                    />
                  </span>
                  {errors.confirmPasswordError && (
                    <span className="signup-error">
                      {errors.confirmPasswordError}
                    </span>
                  )}
                  {passwordMatchMessage && (
                    <span className="success">{passwordMatchMessage}</span>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-signup">
                Register
              </button>
            </Row>
          </form>
          <div className="login-link">
            <span>Already have an account? </span>
            <a href="/signin">Sign-in Here</a>
          </div>
        </div>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default Signup;