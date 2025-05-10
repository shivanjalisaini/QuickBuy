import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateAddress, getAddressById } from "../../../services/ApiService";
import "./UpdateAddress.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UpdateAddress = () => {
  const [address, setAddress] = useState({
    custName: "",
    mobileNo: "",
    flatNo: "",
    area: "",
    city: "",
    stateName: "",
    pinCode: "",
    country: "",
  });
  const [errors, setErrors] = useState({
    custNameError: "",
    mobileError: "",
    pinCodeError: "",
    flatNoError: "",
    areaError: "",
    cityError: "",
    stateError: "",
    countryError: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const addressId = localStorage.getItem("editAddressId");

    if (!userId) {
      navigate("/signin");
    } else if (addressId) {
      getAddressById(addressId)
        .then((response) => {
          setAddress(response.data);
        })
        .catch((error) => {
          console.error("Error fetching address details:", error);
        });
    }

    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryList = response.data.map((country) => country.name.common);
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, [navigate]);

  useEffect(() => {
    if (address.country) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/states", {
          country: address.country,
        })
        .then((response) => {
          const stateList = response.data.data.states.map(
            (state) => state.name
          );
          setStates(stateList);
        })
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [address.country]);

  const validateMobile = (mobileNo) => /^[0-9]{10}$/.test(mobileNo);
  const validatePinCode = (pinCode) => /^[0-9]{6}$/.test(pinCode);
  const validateWordLimit = (value, limit) => value.length <= limit;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });

    let updatedErrors = {};

    if (name === "mobileNo") {
      if (!validateMobile(value)) {
        updatedErrors.mobileError = "Mobile number must be exactly 10 digits";
      } else {
        updatedErrors.mobileError = "";
      }
    }

    if (name === "flatNo") {
      if (!validateWordLimit(value, 30)) {
        updatedErrors.flatNoError = "Flat No must not exceed 30 characters";
      } else {
        updatedErrors.flatNoError = "";
      }
    }

    if (name === "area") {
      if (!validateWordLimit(value, 30)) {
        updatedErrors.areaError = "Area must not exceed 30 characters";
      } else {
        updatedErrors.areaError = "";
      }
    }

    if (name === "city") {
      if (!validateWordLimit(value, 30)) {
        updatedErrors.cityError = "City must not exceed 30 characters";
      } else {
        updatedErrors.cityError = "";
      }
    }

    if (name === "stateName") {
      if (!validateWordLimit(value, 30)) {
        updatedErrors.stateError = "State must not exceed 30 characters";
      } else {
        updatedErrors.stateError = "";
      }
    }

    if (name === "pinCode") {
      if (!validatePinCode(value)) {
        updatedErrors.pinCodeError = "Pin code must be exactly 6 digits";
      } else {
        updatedErrors.pinCodeError = "";
      }
    }

    if (name === "country") {
      if (value.length > 30) {
        updatedErrors.countryError = "Country must not exceed 30 characters";
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        updatedErrors.countryError = "Only alphabets are allowed in Country";
      } else {
        updatedErrors.countryError = "";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...updatedErrors,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let updatedErrors = {};

    if (!address.custName.trim()) {
      updatedErrors.custNameError = "Customer name is required";
      valid = false;
    }

    if (!address.mobileNo.trim()) {
      updatedErrors.mobileError = "Mobile number is required";
      valid = false;
    }

    if (!address.flatNo.trim()) {
      updatedErrors.flatNoError = "Flat No is required";
      valid = false;
    }

    if (!address.area.trim()) {
      updatedErrors.areaError = "Area is required";
      valid = false;
    }

    if (!address.city.trim()) {
      updatedErrors.cityError = "City is required";
      valid = false;
    }

    if (!address.stateName.trim()) {
      updatedErrors.stateError = "State is required";
      valid = false;
    }

    if (!address.pinCode.trim()) {
      updatedErrors.pinCodeError = "Pin code is required";
      valid = false;
    }

    if (!address.country.trim()) {
      updatedErrors.countryError = "Country is required";
      valid = false;
    }

    setErrors(updatedErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userId = localStorage.getItem("userId");
    const addressId = localStorage.getItem("editAddressId");

    if (userId && addressId) {
      try {
        await updateAddress(addressId, {
          userId,
          ...address,
        });
        toast.success("Address updated successfully");
        setTimeout(() => {
          navigate("/allAddresses");
        }, 3000);

        localStorage.removeItem("editAddressId");
      } catch (error) {
        toast.error("There was an error updating the address!", error);
        console.error("There was an error updating the address!", error);
      }
    }
  };

  return (
    <div className="update-address-page">
      <div className="update-address-container">
        <h2>Update Address</h2>
        <form onSubmit={handleSubmit} className="update-address-form">
          <input
            type="text"
            name="custName"
            placeholder="Customer Name"
            value={address.custName}
            onChange={handleChange}
            className={errors.custNameError ? "error-field" : ""}
          />
          {errors.custNameError && (
            <span className="error-message">{errors.custNameError}</span>
          )}

          <input
            type="text"
            name="mobileNo"
            placeholder="Mobile Number"
            value={address.mobileNo}
            onChange={handleChange}
            className={errors.mobileError ? "error-field" : ""}
          />
          {errors.mobileError && (
            <span className="error-message">{errors.mobileError}</span>
          )}

          <select
            name="country"
            value={address.country}
            onChange={(e) => handleChange(e)}
            className={errors.countryError ? "error-field" : ""}
          >
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.countryError && (
            <span className="error-message">{errors.countryError}</span>
          )}

          <select
            name="stateName"
            value={address.stateName}
            onChange={(e) => handleChange(e)}
            className={errors.stateError ? "error-field" : ""}
          >
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.stateError && (
            <span className="error-message">{errors.stateError}</span>
          )}

          <input
            type="text"
            name="flatNo"
            placeholder="Flat No"
            value={address.flatNo}
            onChange={handleChange}
            className={errors.flatNoError ? "error-field" : ""}
          />
          {errors.flatNoError && (
            <span className="error-message">{errors.flatNoError}</span>
          )}

          <input
            type="text"
            name="area"
            placeholder="Lane/Area"
            value={address.area}
            onChange={handleChange}
            className={errors.areaError ? "error-field" : ""}
          />
          {errors.areaError && (
            <span className="error-message">{errors.areaError}</span>
          )}

          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            className={errors.cityError ? "error-field" : ""}
          />
          {errors.cityError && (
            <span className="error-message">{errors.cityError}</span>
          )}

          <input
            type="text"
            name="pinCode"
            placeholder="Pincode"
            value={address.pinCode}
            onChange={handleChange}
            className={errors.pinCodeError ? "error-field" : ""}
          />
          {errors.pinCodeError && (
            <span className="error-message">{errors.pinCodeError}</span>
          )}

          <button type="submit" className="update-submit-btn">
            Update Address
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdateAddress;