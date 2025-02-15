

          

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await axios.post(
        'https://ecomcrud-dashboard.onrender.com/auth/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      alert(result.data.message);
      setAuth(true);
      
      // Delay redirect to ensure cookies are set
      setTimeout(() => {
        navigate('/home');
      }, 1000);

    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="regi">
      <h1>Login</h1>
      <label className="lab"><b>Email:</b></label>
      <input
        className="inputBox2"
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label className="lab"><b>Password:</b></label>
      <input
        className="inputBox3"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button id="sign" className="inputBox" onClick={handleLogin}>
        LOGIN
      </button>
    </div>
  );
};

export default Login;

// Key Features:
// State Management:

// email and password are managed using useState.
// These state variables store the input values typed by the user.
// Login API Request:

// Uses axios.post to send a request to the backend with user credentials.
// Includes withCredentials: true to handle sessions/cookies securely.
// Error Handling:

// Displays server-provided error messages (if any) or a generic error message if something goes wrong.
// Authentication State Update:

// The setAuth(true) updates the authentication status in the parent component or global state.
// Navigation:

// After a successful login, the user is redirected to the /home page using navigate('/home').
// Responsive and Secure Form:

// The type="email" ensures basic email validation.
// The type="password" masks the password for security.
// Reusability:

// The setAuth prop allows the component to work with different authentication flows and manage authentication state externally.
// This implementation ensures a clean and functional login flow, handling user inputs, server communication, and navigation efficiently.
// import React, { useState } from "react";
// import axios from "axios";
// import ReCAPTCHA from "react-google-recaptcha";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [captchaToken, setCaptchaToken] = useState('');

//   const handleCaptchaChange = (value) => {
//     setCaptchaToken(value);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     // Ensure CAPTCHA was completed
//     if (!captchaToken) {
//       alert("Please complete the CAPTCHA");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/auth/login", {
//         email,
//         password,
//         captchaToken,
//       });

//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error logging in:", error?.response?.data?.message || error.message);
//       alert("Error logging in");
//     }
//   };

//   return (
//     <div className="regi">
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           className="lab"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           className="lab"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <ReCAPTCHA
//           sitekey="YOUR_SITE_KEY" // Replace with your site key from Google reCAPTCHA
//           onChange={handleCaptchaChange}
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;







