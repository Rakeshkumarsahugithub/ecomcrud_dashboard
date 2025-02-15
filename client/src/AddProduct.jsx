import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Helper function to get cookies
  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };

  const addProduct = async () => {
    setError(false);
    setSuccessMessage("");

    // Input validation
    if (!name || !price || isNaN(price) || !category || !company) {
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const token = getCookie("token"); // Get token from cookies
      console.log("Token retrieved:", token); // Debugging line

      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.post(
        "https://ecomcrud-dashboard.onrender.com/products",
        { name, price, category, company },
        {
          withCredentials: true, // Send cookies
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        }
      );

      setSuccessMessage("Product added successfully!");
      setName("");
      setPrice("");
      setCategory("");
      setCompany("");
    } catch (error) {
      console.error("Error adding product:", error);
      setSuccessMessage(error.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addproduct">
      <h1>Add Product...</h1>

      <input
        type="text"
        placeholder="Enter product name"
        className="inputBx"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && !name && <span id="popup">Enter valid name</span>}

      <input
        type="number"
        placeholder="Enter product price"
        className="inputBx"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {error && (!price || isNaN(price)) && (
        <span id="popup">Enter a valid numeric price</span>
      )}

      <input
        type="text"
        placeholder="Enter product category"
        className="inputBx"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      {error && !category && <span id="popup">Enter valid category</span>}

      <input
        type="text"
        placeholder="Enter product company"
        className="inputBx"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      {error && !company && <span id="popup">Enter valid company</span>}

      <button className="prdbtn" onClick={addProduct} disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>

      {successMessage && <p className="message">{successMessage}</p>}
    </div>
  );
};

export default AddProduct;
