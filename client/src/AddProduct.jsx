import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const addProduct = async () => {
        setError(false);
        setSuccessMessage('');

        if (!name || !price || isNaN(price) || !category || !company) {
            setError(true);
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                "http://localhost:5005/products",
                { name, price, category, company },
                { withCredentials: true }
            );

            setSuccessMessage("Product added successfully!");
            setName('');
            setPrice('');
            setCategory('');
            setCompany('');
        } catch (error) {
            console.error("Error adding product:", error);
            setSuccessMessage("Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Add Product</h1>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {error && !name && <small className="text-danger">Enter valid name</small>}
            </div>

            <div className="mb-3">
                <input
                    type="number"
                    className="form-control"
                    placeholder="Enter product price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {error && (!price || isNaN(price)) && <small className="text-danger">Enter a valid numeric price</small>}
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter product category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                {error && !category && <small className="text-danger">Enter valid category</small>}
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter product company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />
                {error && !company && <small className="text-danger">Enter valid company</small>}
            </div>

            <button className="btn btn-primary" onClick={addProduct} disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
            </button>

            {successMessage && <div className="mt-3 alert alert-info">{successMessage}</div>}
        </div>
    );
};

export default AddProduct;
