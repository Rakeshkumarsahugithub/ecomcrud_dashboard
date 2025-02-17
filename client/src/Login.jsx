import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior
        try {
            const result = await axios.post(
                'https://ecomcrud-dashboard.onrender.com/auth/login',
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            alert(result.data.message);
            setAuth(true);
            navigate('/home');
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error("Error during login:", error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <h1 className="text-center">Login</h1>

                    <form onSubmit={handleLogin}>
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

                        <button type="submit" className="btn btn-primary w-100">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
