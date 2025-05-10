import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAddressByUserId,
  deleteAddress,
} from "../../../services/ApiService";
import { FaEdit, FaTrashAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./AllAddresses.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllAddresses = () => {
  const [addresses, setAddresses] = useState([]);
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

  const handleEdit = (addressId) => {
    localStorage.setItem("editAddressId", addressId);
    navigate("/updateAddress");
  };

  const handleDelete = (addressId) => {
    deleteAddress(addressId)
      .then((response) => {
        toast.success("Address deleted successfully");
        console.log("Address deleted successfully:", response);
        setAddresses(
          addresses.filter((address) => address.addressId !== addressId)
        );
      })
      .catch((error) => {
        toast.error("Error deleting address");
        console.error("Error deleting address:", error);
      });
  };

  const handleAddAddress = () => {
    localStorage.setItem("isShipping", false);
    localStorage.removeItem("selectedAddress");
    navigate("/addAddress");
  };

  const handleUseMyLocation = () => {
    navigate("/selectLocation");
  };

  return (
    <div className="all-addresses-container1">
      <h2>All Addresses</h2>
      <div className="address-cards1">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.addressId} className="alladdress-card1">
              <div className="address-card-header1">
                <div>
                  <FaEdit
                    onClick={() => handleEdit(address.addressId)}
                    className="edit-icon1"
                  />
                  <FaTrashAlt
                    onClick={() => handleDelete(address.addressId)}
                    className="delete-icon1"
                  />
                </div>
              </div>
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
            </div>
          ))
        ) : (
          <p>No addresses found. Please add a new address.</p>
        )}
      </div>
      <button onClick={handleAddAddress} className="add-new-address-button1">
        Add New Address
      </button>
      <button onClick={handleUseMyLocation} className="use-my-location-button1">
        <FaMapMarkerAlt className="location-icon1" /> Use My Location
      </button>
      <ToastContainer />
    </div>
  );
};

export default AllAddresses;