import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://ecomcrud-dashboard.onrender.com/products/${id}`, { withCredentials: true });
            if (response.data) {
                const { name, price, category, company } = response.data;
                setName(name);
                setPrice(price);
                setCategory(category);
                setCompany(company);
            } else {
                alert("Product not found.");
                navigate("/products");
            }
        } catch (error) {
            console.error("Error fetching product details:", error.response || error.message);
            alert("Error fetching product details. Please try again.");
            navigate("/products");
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async () => {
        if (!name || !price || !category || !company) {
            return alert("All fields are required.");
        }
        if (isNaN(price) || price <= 0) {
            return alert("Please enter a valid price greater than 0.");
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `https://ecomcrud-dashboard.onrender.com/products/${id}`,
                { name, price: parseFloat(price), category, company },
                { withCredentials: true }
            );
            alert(response.data?.message || "Product updated successfully!");
            navigate("/products");
        } catch (error) {
            console.error("Error updating product:", error.response || error.message);
            const errorMessage = error.response?.data?.message || "Error updating product. Please try again.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading, please wait...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Update Product</h1>
            <div className="form-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                />
            </div>
            <div className="form-group mb-3">
                <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product Price"
                />
            </div>
            <div className="form-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Product Category"
                />
            </div>
            <div className="form-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Product Company"
                />
            </div>
            <button className="btn btn-primary btn-block" onClick={updateProduct}>
                Update Product
            </button>
        </div>
    );
};

export default UpdateProduct;
