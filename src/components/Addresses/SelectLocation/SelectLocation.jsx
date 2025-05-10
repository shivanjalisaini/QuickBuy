import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./SelectLocation.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SelectLocation = () => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualPosition, setManualPosition] = useState({
    lat: "",
    lng: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          setLoading(false);

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.address) {
                const {
                  road,
                  suburb,
                  village,
                  neighbourhood,
                  locality,
                  city,
                  state,
                  postcode,
                  country,
                  town,
                  municipality,
                } = data.address;

                const lane =
                  road ||
                  suburb ||
                  village ||
                  neighbourhood ||
                  locality ||
                  town ||
                  municipality ||
                  "Not available";

                setAddress({
                  lane,
                  city: city || town || municipality || "Not available",
                  state: state || "Not available",
                  pincode: postcode || "Not available",
                  country: country || "Not available",
                });
              }
            })
            .catch((error) => console.error("Error fetching address:", error));
        },
        (error) => {
          console.error("Error fetching location: ", error);
          if (error.code === error.PERMISSION_DENIED) {
            toast.error(
              "Permission denied. Please allow location access or enter manually."
            );
            setManualEntry(true);
          }
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setManualEntry(true);
      setLoading(false);
    }
  }, []);

  const handleConfirmLocation = () => {
    if (address) {
      localStorage.setItem("selectedAddress", JSON.stringify(address));
      navigate("/AddAddress");
    } else if (manualPosition.lat && manualPosition.lng) {
      localStorage.setItem("selectedAddress", JSON.stringify(manualPosition));
      navigate("/AddAddress");
    } else {
      toast.error("Location or address not found.");
    }
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualPosition((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="select-location-container">
      <h2>Select Your Live Location</h2>
      {loading ? (
        <p>Loading your location...</p>
      ) : (
        <>
          {!manualEntry ? (
            <>
              <MapContainer
                center={position || [51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={false}
                className="map-container"
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {position && <Marker position={position}></Marker>}
              </MapContainer>

              {address ? (
                <div className="address-details">
                  <p>
                    <b>Lane:</b> {address.lane}
                  </p>
                  <p>
                    <b>City:</b> {address.city}
                  </p>
                  <p>
                    <b>State:</b> {address.state}
                  </p>
                  <p>
                    <b>Pin Code:</b> {address.pincode}
                  </p>
                  <p>
                    <b>Country:</b> {address.country}
                  </p>
                </div>
              ) : (
                <p>Fetching address details...</p>
              )}
            </>
          ) : (
            <div className="manual-entry">
              <p>Enter your location manually:</p>
              <input
                type="text"
                name="lat"
                value={manualPosition.lat}
                onChange={handleManualInputChange}
                placeholder="Latitude"
              />
              <input
                type="text"
                name="lng"
                value={manualPosition.lng}
                onChange={handleManualInputChange}
                placeholder="Longitude"
              />
            </div>
          )}

          <button
            onClick={handleConfirmLocation}
            className="confirm-location-button"
          >
            Confirm Location
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default SelectLocation;