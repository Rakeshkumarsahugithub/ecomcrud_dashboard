import React from "react";
import { Link } from "react-router-dom";

// Key Props
// isAuthenticated:

// A boolean indicating whether the user is logged in.
// Used to conditionally render different sets of navigation items.
// handleLogout:

// A function triggered when the user clicks the "Logout" button.
// Allows the parent component to manage logout logic (e.g., clearing tokens, updating authentication status).
//Conditional Rendering
//The isAuthenticated prop determines which set of links/buttons to display:
//If the user is NOT authenticated (!isAuthenticated):
// Displays links for signing up and logging in.
// Positioned using the right class (likely aligns items to the right side of the navigation bar).
//If the user IS authenticated (isAuthenticated):
//Displays links for:
// Home: Navigates to the main/home page.
// Products: Navigates to the products page.
// Add Product: Navigates to a form for adding new products.
// Includes a "Logout" button:
// Styled with the Logbtn class.
// Calls the handleLogout function to log out the user.

const Nav = ({ isAuthenticated, handleLogout }) => {
    return (
        <nav>
            {!isAuthenticated ? (
                <ul className="navul right">
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/login">Log In</Link></li>
                </ul>
            ) : (
                <ul className="navul">
                    <li><Link to="/home" className="home-link">Home</Link></li>
                    <li><Link to="/products" className="home-link">Products</Link></li>
                    <li><Link to="/add-product" className="home-link">Add Product</Link></li>
                    <li>
                        <button className="Logbtn" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default Nav;


// Key Points
// Use of Link:

// The Link component from react-router-dom allows navigation without refreshing the page (Single Page Application behavior).
// Dynamic Navigation:

// Adapts to the user's authentication status for a better user experience.
// Ensures only authenticated users can see product-related links or the logout button.
// Styling Classes:

// navul: Styles for the navigation list.
// right: Likely positions items to the right for unauthenticated users.
// home-link: Adds specific styling for links like "Home," "Products," and "Add Product."
// Logbtn: Styling for the logout button.
// How It Works
// When the component is rendered:

// It checks the value of the isAuthenticated prop.
// Based on the value:
// Shows login/sign-up links if unauthenticated.
// Shows navigation links and a logout button if authenticated.
// Logout Workflow:

// Clicking the "Logout" button triggers the handleLogout function.
// The parent component can then update isAuthenticated to false, causing the navigation to re-render with the login/signup options.
