import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutNavbar from "../../CheckoutNavbar/CheckoutNavbar";
import { getAddressByUserId } from "../../../services/ApiService";
import "./ShippingAddress.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShippingAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/signin");
      return;
    }

    getAddressByUserId(userId)
      .then((response) => {
        if (response.data) {
          setAddresses(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
      });
  }, [navigate]);

  const handleSelect = (addressId) => {
    setSelectedAddressId(addressId);
    localStorage.setItem("selectedAddressId", addressId);
  };

  const handleProceedToPayment = () => {
    if (selectedAddressId) {
      navigate("/paymentMode");
    } else {
      toast.error("Please select an address before proceeding to payment.");
    }
  };

  const AddAddress = () => {
    localStorage.setItem("isShipping", true);
    navigate("/addAddress");
  };

  return (
    <>
      <CheckoutNavbar />
      <div className="shipping-address-container">
        <h2>Select Delivery Address</h2>
        <div className="address-cards">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.addressId}
                className={`address-card ${
                  selectedAddressId === address.addressId ? "selected" : ""
                }`}
                onClick={() => handleSelect(address.addressId)}
              >
                <p>
                  <b>Cust Name:</b> {address.custName}
                </p>
                <p>
                  <b>Mobile No:</b> {address.mobileNo}
                </p>
                <p>
                  <b>Flat No:</b> {address.flatNo}
                </p>
                <p>
                  <b>Area:</b> {address.area}
                </p>
                <p>
                  <b>City:</b> {address.city}
                </p>
                <p>
                  <b>State Name:</b> {address.stateName}
                </p>
                <p>
                  <b>Pin Code:</b> {address.pinCode}
                </p>
                <p>
                  <b>Country:</b> {address.country}
                </p>
                <button className="select-button">
                  {selectedAddressId === address.addressId
                    ? "Selected"
                    : "Select"}
                </button>
              </div>
            ))
          ) : (
            <p>No addresses found. Please add a new address.</p>
          )}
        </div>
        <div className="button-group">
          <button onClick={AddAddress} className="add-new-address-button">
            Add New Address
          </button>
          <button
            onClick={handleProceedToPayment}
            className="proceed-to-payment-button"
          >
            Proceed to Payment
          </button>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default ShippingAddress;