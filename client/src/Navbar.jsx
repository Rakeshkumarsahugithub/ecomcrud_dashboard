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
            const response = await axios.get("http://localhost:5000/auth/check", { withCredentials: true });
            if (response.data.isAuthenticated) {
                // Fetch the user data if authenticated
                const userResponse = await axios.get("http://localhost:5000/user", { withCredentials: true });
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
            await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
            setIsLoggedIn(false);
            setDropdownVisible(false);
            navigate("/login");  // Redirect to login page
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <nav>
            <div className="navbar">
                <button onClick={toggleDropdown} className="profile-btn">
                    {isLoggedIn ? `Hi, ${username}` : "Profile"}
                </button>
                {dropdownVisible && isLoggedIn && (
                    <div className="dropdown">
                        <p>{username}</p>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

