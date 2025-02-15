import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    // Check if the user is logged in and fetch user info
    useEffect(() => {
        checkAuthentication();
    }, []);

    // Function to check authentication and fetch user data
    const checkAuthentication = async () => {
        try {
            const response = await axios.get("https://ecomcrud-dashboard.onrender.com/auth/check", { withCredentials: true });
            if (response.data.isAuthenticated) {
                // Fetch the user data if authenticated
                const userResponse = await axios.get("https://ecomcrud-dashboard.onrender.com/user", { withCredentials: true });
                setIsLoggedIn(true);
                setUsername(userResponse.data.name);  // Set the username
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            setIsLoggedIn(false);
        }
    };

    // Handle profile button click to toggle the dropdown
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    // Handle logout
    const logout = async () => {
        try {
            await axios.post("https://ecomcrud-dashboard.onrender.com/auth/logout", {}, { withCredentials: true });
            setIsLoggedIn(false);
            setDropdownVisible(false);
            navigate("/login");  // Redirect to login page
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <button className="btn btn-outline-secondary" onClick={toggleDropdown}>
                    {isLoggedIn ? `Hi, ${username}` : "Profile"}
                </button>
                {dropdownVisible && isLoggedIn && (
                    <div className="dropdown-menu show">
                        <p className="dropdown-item">{username}</p>
                        <button className="dropdown-item" onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
