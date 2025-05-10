import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../services/ApiService";
import "./NavbarLinks.css";

function NavbarLinks() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []); 

  return (
    <div className="navbar-links">
      <div className="navbar-links-container">
        {categories.length ? (
          categories.slice(0, 9).map((category) => (
            <div key={category.categoryId} className="navbar-links-item">
              <Link to={`/category/${category.categoryId}`}>
                {category.categoryName}
              </Link>
            </div>
          ))
        ) : (
          <div className="navbar-links-item">No categories available</div>
        )}
      </div>
    </div>
  );
}

export default NavbarLinks;