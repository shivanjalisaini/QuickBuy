import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../../components/ShoppingCart/CartContext";
import {
  getAllCategories,
  getAllProducts,
  getViewProfile,
} from "../../services/ApiService";
import "./Navbar.css";
import NavbarLinks from "../NavbarLinks/NavbarLinks";
import quickbuy from "../../assests/quickbuylogo.png";

function CustomNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredResults, setFilteredResults] = useState({
    categories: [],
    products: [],
  });
  const [profileImage, setProfileImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  const userId = localStorage.getItem("userId");

  const defaultUser = {
    profilePicture:
      "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          getAllCategories(),
          getAllProducts(),
        ]);
        setCategories(categoriesResponse.data || []);
        setProducts(productsResponse || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          const profileResponse = await getViewProfile(userId);
          setProfileImage(
            profileResponse.data.profileImage
              ? `data:image/jpeg;base64,${profileResponse.data.profileImage}`
              : defaultUser.profilePicture
          );
          setFirstName(profileResponse.data.firstName || "");
          setLastName(profileResponse.data.lastName || "");
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchProfile();

    const intervalId = setInterval(fetchProfile, 2000);

    return () => clearInterval(intervalId);
  }, [userId]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredCategories = categories.filter(
        (category) =>
          category.categoryName &&
          category.categoryName.toLowerCase().includes(query.toLowerCase())
      );

      const filteredProducts = products.filter((product) => {
        return (
          product.productName &&
          product.productName.toLowerCase().includes(query.toLowerCase())
        );
      });

      setFilteredResults({
        categories: filteredCategories,
        products: filteredProducts,
      });
    } else {
      setFilteredResults({ categories: [], products: [] });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const { categories, products } = filteredResults;

    if (categories.length > 0) {
      navigate(`/category/${categories[0].categoryId}`);
    } else if (products.length > 0) {
      navigate(`/product/${products[0].productId}`);
    } else {
      console.log("No results found");
    }
  };

  const handleSuggestionClick = (id, type) => {
    if (type === "category") {
      navigate(`/category/${id}`);
    } else if (type === "product") {
      navigate(`/product/${id}`);
    }
    setSearchQuery("");
    setFilteredResults({ categories: [], products: [] });
  };

  const handleUserIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCartIconClick = () => {
    navigate("/shoppingCart");
  };

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".account-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      <Navbar expand="lg" className="custom-navbar">
        <Container fluid>
          <Navbar.Brand href="/" className="navbar-brand">
            <img src={quickbuy} alt="QuickBuy Logo" className="navbar-logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Form
              className="d-flex mx-auto search-form"
              onSubmit={handleSearchSubmit}
            >
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <Form.Control
                type="search"
                placeholder="Search For Brands, Products and More."
                className="search-input"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery &&
                (filteredResults.categories.length > 0 ||
                  filteredResults.products.length > 0) && (
                  <ul className="suggestions-list">
                    {filteredResults.categories.length > 0 && (
                      <>
                        <h5>Categories</h5>
                        {filteredResults.categories.map((category) => (
                          <li
                            key={category.categoryId}
                            onClick={() =>
                              handleSuggestionClick(
                                category.categoryId,
                                "category"
                              )
                            }
                            className="suggestion-item"
                          >
                            <FontAwesomeIcon
                              icon={faSearch}
                              className="search-icon-1"
                            />
                            {category.categoryName}
                          </li>
                        ))}
                      </>
                    )}
                    {filteredResults.products.length > 0 && (
                      <>
                        <h5>Products</h5>
                        {filteredResults.products.map((product) => (
                          <li
                            key={product.productId}
                            onClick={() =>
                              handleSuggestionClick(
                                product.productId,
                                "product"
                              )
                            }
                            className="suggestion-item"
                          >
                            {product.productImages[0] && (
                              <img
                                src={`data:image/jpeg;base64,${product.productImages[0]}`}
                                alt={product.productName}
                              />
                            )}
                            {product.productName}
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                )}
            </Form>
            <div className="navbar-icons">
              <div className="account-container" onClick={handleUserIconClick}>
                {userId && profileImage ? (
                  <>
                    <img
                      src={profileImage}
                      alt="User Profile"
                      className="navbar-profile-img"
                    />
                    <span className="profile-text">
                      Hello, {firstName} {lastName}
                    </span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUser} className="navbar-icon" />
                    <span className="profile-text">My Account</span>
                  </>
                )}
                {showDropdown && (
                  <div className="account-dropdown">
                    {!userId && (
                      <>
                        <a href="/signup">Register</a>
                        <a href="/signin">Sign In</a>
                      </>
                    )}
                    {userId && <a href="/viewProfile">My Profile</a>}
                    {userId && <a href="/previousOrders">My Orders</a>}
                    {userId && <a onClick={handleSignOut}>Sign Out</a>}
                  </div>
                )}
              </div>

              <div
                className="cart-icon-container"
                onClick={handleCartIconClick}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="navbar-icon"
                />
                <span className="cart-text">My Cart</span>
                {cartCount > 0 && <div className="cart-badge">{cartCount}</div>}
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <NavbarLinks />
    </>
  );
}

export default CustomNavbar;