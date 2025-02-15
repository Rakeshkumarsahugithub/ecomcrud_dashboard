import React, { useState } from "react";
import axios from "axios";
// Imports React and the useState hook for state management.
// Imports axios to make HTTP requests.

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false); // State to track loading status
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

//     Initializes state variables for input fields (name, price, category, company).
// Adds error to track input validation errors.
// Adds loading to show a spinner or "Adding..." while the API request is in progress.
// Adds successMessage to display feedback for the user (success or failure message).


    const addProduct = async () => {
        setError(false);
        setSuccessMessage('');

//         Resets error and successMessage at the start of each call to avoid old messages showing.


        if (!name || !price || isNaN(price) || !category || !company) {
            setError(true);
            return;
        }

//         Ensures all fields are filled.
// Checks if price is numeric using isNaN.

        setLoading(true); // Show loading indicator
 //Sets loading to true to show feedback during the API call.
        try {
            await axios.post(
                "https://ecomcrud-dashboard.onrender.com/products",
                { name, price, category, company },
                { withCredentials: true }
            );

            setSuccessMessage("Product added successfully!"); // Show success message

            // Clear the input fields
            setName('');
            setPrice('');
            setCategory('');
            setCompany('');
        } catch (error) {
            console.error("Error adding product:", error);
            setSuccessMessage("Failed to add product. Please try again."); // Show failure message
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

//     Tries to send a POST request to the backend with the input data.
// On success:
// Updates successMessage with a positive message.
// Clears all input fields.
// On failure:
// Logs the error to the console.
// Updates successMessage with an error message.
// Finally:
// Resets loading to false.


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
{/* 
            Input field for the product name, linked to name state.
If error is true and name is empty, shows a validation message. */}

            <input
                type="number"
                placeholder="Enter product price"
                className="inputBx"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            {error && (!price || isNaN(price)) && <span id="popup">Enter a valid numeric price</span>}

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

            {/* Display success or failure message Button to trigger the addProduct function.
Disabled when loading is true to prevent multiple submissions.
Shows "Adding..." when loading is true.
Displays the success or failure message when successMessage is not empty.
 */}
            {successMessage && <p className="message">{successMessage}</p>}
        </div>
    );
};

export default AddProduct;
