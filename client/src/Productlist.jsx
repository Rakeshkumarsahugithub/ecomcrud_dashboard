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
            const result = await axios.get("http://localhost:5000/products", { withCredentials: true });
            setProducts(result.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/products/${id}`, { withCredentials: true });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // const searchHandle = async () => {
    //     if (searchKey) {
    //         try {
    //             const result = await axios.get(`http://localhost:5000/search/${searchKey}`, { withCredentials: true });
    //             setProducts(result.data);
    //         } catch (error) {
    //             console.error("Error searching products:", error);
    //         }
    //     } else {
    //         fetchProducts();
    //     }
    // };
    const searchHandle = async () => {
        if (searchKey) {
          try {
            const result = await axios.get(`http://localhost:5000/search/${searchKey}`, { withCredentials: true });
            setProducts(result.data.data); // Access "data" from API response
          } catch (error) {
            console.error("Error searching products:", error);
          }
        } else {
          fetchProducts(); // Load all products if search key is empty
        }
      };
    

    return (
        // <div className="productlist">
        //     <h1>Product List</h1>
        //     <input
        //         type="text"
        //         className="searchbox"
        //         placeholder="Search Product"
        //         value={searchKey}
        //         onChange={(e) => setSearchKey(e.target.value)}
        //     />
        //     <button onClick={searchProducts}>Search</button>
        //     <ul>
        //         <li>Serial No</li>
        //         <li>Name</li>
        //         <li>Price</li>
        //         <li>Category</li>
        //         <li>Company</li>
        //         <li>Operation</li>
        //     </ul>
        //     {products.map((product, index) => (
        //         <ul key={product._id}>
        //             <li>{index + 1}</li>
        //             <li>{product.name}</li>
        //             <li>{product.price}</li>
        //             <li>{product.category}</li>
        //             <li>{product.company}</li>
        //             <li>
        //                 <button onClick={() => deleteProduct(product._id)}>DELETE</button>
        //                 <Link to={`/Update/${product._id}`}>UPDATE</Link>
        //             </li>
        //         </ul>
        //     ))}
        // </div>
        <div className="productli">
        <h1>Product List</h1>
        {/* <input type="text" className="searchh" placeholder="Search Product" onChange={searchHandlee}></input> */}
     <input type="text" className="searchh" placeholder="Search Product" value={searchKey} onChange={(e) => setSearchKey(e.target.value)}></input>
      <button id="serbtn" onClick={searchHandle}>Search</button>
        <ul>
            <li>Serial No</li>
            <li>Name</li>
            <li>Price</li>
            <li>Category</li>
            <li>Company</li>
            <li>Operation</li>
        </ul>
       
        {
           products.length > 0 ? products.map((product, index) => 
                <ul key={product._id}>
                    <li>{index+1}</li>
                    <li>{product.name}</li>
                    <li>{product.price}</li>
                    <li>{product.category}</li>
                    <li>{product.company}</li>
                    {/* <button className="prdbtnn" onClick={()=>{deleteProduct(item._id)}}>Delete</button>
                    <button className="prdbtnn" ><Link to="/Update">Update</Link></button> */}
                    <li>
                    <button onClick={()=>{deleteProduct(product._id)}}>DELETE</button>
                    <button><Link to={`/Update/${product._id}`}>UPDATE</Link></button>
                    </li>
                </ul>
            ) : <h2>No Result Found!</h2>
        }
    </div>
    );
};

export default ProductList;
// import React, { useEffect, useState } from "react"; // Import React, useEffect for lifecycle methods, and useState for state management.
// import { Link } from "react-router-dom"; // Import Link for navigation between routes.
// import axios from "axios"; // Import axios for HTTP requests.

// const ProductList = () => { // Functional component to display and manage the product list.
//   const [products, setProducts] = useState([]); // State variable to store the list of products.
//   const [searchKey, setSearchKey] = useState(""); // State variable to store the search input value.
//   const [errorMessage, setErrorMessage] = useState(""); // State variable to store error or status messages.

//   useEffect(() => { // useEffect to fetch products on component mount.
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => { // Function to fetch all products from the server.
//     try {
//       const result = await axios.get("http://localhost:5000/products", { withCredentials: true }); // API call to fetch products.
//       setProducts(result.data); // Update the products state with the fetched data.
//       setErrorMessage(""); // Reset the error message if the fetch is successful.
//     } catch (error) {
//       console.error("Error fetching products:", error); // Log the error.
//       setErrorMessage("Error fetching products."); // Update the error message to inform the user.
//     }
//   };

//   const deleteProduct = async (id) => { // Function to delete a product by ID.
//     try {
//       await axios.delete(`http://localhost:5000/products/${id}`, { withCredentials: true }); // API call to delete a product.
//       fetchProducts(); // Refresh the product list after deletion.
//     } catch (error) {
//       console.error("Error deleting product:", error); // Log the error.
//       setErrorMessage("Error deleting product."); // Update the error message to inform the user.
//     }
//   };

//   const searchHandle = async () => { // Function to handle product search.
//     if (searchKey) { // Check if the search key is not empty.
//       try {
//         const result = await axios.get(`http://localhost:5000/search/${searchKey}`, { withCredentials: true }); // API call to search products by key.
//         setProducts(result.data.data || []); // Update the products state with search results or an empty array.
//         setErrorMessage(""); // Clear any existing error messages.
//       } catch (error) {
//         if (error.response && error.response.status === 404) { // Handle 404 error (no products found).
//           setProducts([]); // Clear the products list.
//           setErrorMessage("No Result Found!"); // Display a "No Result Found" message.
//         } else {
//           console.error("Error searching products:", error); // Log the error.
//           setErrorMessage("Error searching products."); // Update the error message to inform the user.
//         }
//       }
//     } else {
//       fetchProducts(); // If the search key is empty, fetch all products.
//     }
//   };

//   return (
//     <div className="productli"> {/* Wrapper div for styling */}
//       <h1>Product List</h1> {/* Heading */}
//       <input
//         type="text" // Input field for entering the search keyword.
//         className="searchh" // CSS class for styling.
//         placeholder="Search Product" // Placeholder text.
//         value={searchKey} // Bind the input value to the `searchKey` state.
//         onChange={(e) => setSearchKey(e.target.value)} // Update the state when the user types.
//       />
//       <button id="serbtn" onClick={searchHandle}>Search</button> {/* Button to trigger the search function */}

//       {errorMessage && <h2>{errorMessage}</h2>} {/* Display error or "No Result Found" messages */}

//       <ul> {/* Header for the product list table */}
//         <li>Serial No</li>
//         <li>Name</li>
//         <li>Price</li>
//         <li>Category</li>
//         <li>Company</li>
//         <li>Operation</li>
//       </ul>

//       {products.length > 0 ? ( // Check if there are any products in the list.
//         products.map((product, index) => ( // Map through the product list and render each product.
//           <ul key={product._id}> {/* Use product ID as a unique key */}
//             <li>{index + 1}</li> {/* Display serial number */}
//             <li>{product.name}</li> {/* Display product name */}
//             <li>{product.price}</li> {/* Display product price */}
//             <li>{product.category}</li> {/* Display product category */}
//             <li>{product.company}</li> {/* Display product company */}
//             <li> {/* Render operation buttons */}
//               <button onClick={() => deleteProduct(product._id)}>DELETE</button> {/* Button to delete the product */}
//               <button><Link to={`/Update/${product._id}`}>UPDATE</Link></button> {/* Link to update the product */}
//             </li>
//           </ul>
//         ))
//       ) : (
//         !errorMessage && <h2>No Result Found!</h2> // Show "No Result Found" only if no error message and no products.
//       )}
//     </div>
//   );
// };

// export default ProductList; // Export the ProductList component for use in other parts of the application.


// Key Features of This Code:
// Dynamic Rendering:

// Displays either the product list, "No Result Found!", or an error message based on the state.
// Search Functionality:

// Filters the product list based on the search key, fetching results from the backend.
// Error Handling:

// Handles API errors and provides user-friendly messages for failed fetches, deletions, or searches.
// Operations on Products:

// Provides functionality to delete and update products via buttons.
// Reusable Component:

// Modular structure allows it to be reused or extended for other similar product management features.
// Real-Time Updates:

// Updates the product list dynamically after search or deletion without needing a page refresh.
