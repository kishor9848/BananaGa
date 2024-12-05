// Import necessary modules and hooks
import React, { useState } from "react";  // React for component creation and useState for state management
import { useNavigate } from "react-router-dom";  // useNavigate hook for navigation

const Login = () => {
  // Initialize navigation hook
  const navigate = useNavigate();

  // State to manage form data and error messages
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // Handle input changes and update form data state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Dynamically update the field being changed
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate that all fields are filled
    if (!formData.username || !formData.password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      // Make a POST request to the server for user authentication
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",  // HTTP POST method
        headers: {
          "Content-Type": "application/json",  // Inform the server that the request body is in JSON format
        },
        body: JSON.stringify({
          name: formData.username,  // Sending username as `name`
          password: formData.password,  // Sending password
        }),
      });

      // Parse the response from the server
      const data = await response.json();
      console.log("Server Response:", data);  // Log the server response for debugging

      if (response.ok) {
        // If login is successful, store the token and username in localStorage
        localStorage.setItem("token", data.token);  // Store authentication token
        localStorage.setItem("username", data.username);  // Store username for future reference
        setFormData({ username: "", password: "" });  // Reset the form fields
        setError("");  // Clear any error messages
        navigate("/game");  // Redirect to the game page
      } else {
        setError(data.message || "Login failed.");  // Display server-provided error message or a default one
      }
    } catch (error) {
      console.error("Error:", error);  // Log any errors during the request
      setError("Server error. Please try again later.");  // Display a generic server error message
    }
  };

  // Render the login form UI
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 relative">
      {/* Abstract shape background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500 to-yellow-400 opacity-20"></div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl relative z-10">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-teal-800">Banana Game</h1> {/* Application title */}
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-3xl font-semibold text-center text-teal-700">Login to Continue</h2>

          {/* Display error message if any */}
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}

          <div className="space-y-6">
            {/* Username input */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 text-gray-800"
              />
            </div>

            {/* Password input */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 text-gray-800"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-300"
          >
            Login
          </button>

          {/* Redirect to register page */}
          <div className="text-center text-gray-600">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/register")}  // Navigate to the register page
              className="ml-1 text-teal-600 hover:underline focus:outline-none"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export the Login component for use in other files
export default Login;
