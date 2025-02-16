import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const tokenValue = token.split('=')[1];

            const result = await axios.get(
                "https://ecomcrud-dashboard.onrender.com/products",
                {
                    headers: {
                        'Authorization': `Bearer ${tokenValue}`
                    },
                    withCredentials: true
                }
            );
            setProducts(result.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);  // If there's an error, clear the product list.
        }
    };

    const deleteProduct = async (id) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const tokenValue = token.split('=')[1];

            await axios.delete(
                `https://ecomcrud-dashboard.onrender.com/products/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${tokenValue}`
                    },
                    withCredentials: true
                }
            );
            fetchProducts();  // Refresh the product list after deletion.
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const searchHandle = async () => {
        if (searchKey) {
            try {
                const result = await axios.get(`https://ecomcrud-dashboard.onrender.com/search/${searchKey}`, { withCredentials: true });
                setProducts(result.data.data);  // Assuming the response has 'data' as the list of products.
            } catch (error) {
                console.error("Error searching products:", error);
                setProducts([]);  // Handle error by clearing the product list.
            }
        } else {
            fetchProducts(); // Load all products if search key is empty.
        }
    };

    return (
        <div className="container mt-5">
            <h1>Product List</h1>
            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Product"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                />
                <button className="btn btn-primary ms-2" onClick={searchHandle}>Search</button>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Company</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.company}</td>
                                <td>
                                    <button className="btn btn-danger me-2" onClick={() => deleteProduct(product._id)}>Delete</button>
                                    <Link to={`/Update/${product._id}`} className="btn btn-warning">Update</Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No Result Found!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
