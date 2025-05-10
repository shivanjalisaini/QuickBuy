import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../../services/ApiService";
import "./CategoryWithImage.css";

function CategoryWithImage() {
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
    <div className="category-container">
      {categories.slice(0, 8).map((category) => (
        <div key={category.categoryId} className="category-item">
          <Link to={`/category/${category.categoryId}`}>
            <div className="category-image-wrapper">
              <img
                src={`data:image/jpeg;base64,${category.categoryImage}`}
                alt={category.categoryName}
                className="category-image"
              />
            </div>
            <div className="category-name">{category.categoryName}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default CategoryWithImage;