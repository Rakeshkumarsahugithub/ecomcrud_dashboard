import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [username, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const collectData = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const result = await axios.post(
        "https://ecomcrud-dashboard.onrender.com/auth/signup",
        { username, email, password, confirmPassword },
        { withCredentials: true }
      );
      
      alert(result.data.message);
      setuserName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error.response || error);
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <h1 className="text-center">Register</h1>

          <form onSubmit={collectData}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Enter Your Name:</label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={username}
                onChange={(e) => setuserName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Enter Your Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Enter Your Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Your Password:</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">SIGN UP</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
