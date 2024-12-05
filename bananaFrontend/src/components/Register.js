import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Used for navigation between pages

const Register = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  }); // State to store form inputs
  const [error, setError] = useState(""); // State to handle error messages

  // Handle input change and update formData state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const { name, password, confirmPassword } = formData;

    // Validate form inputs
    if (!name || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Attempt to register the user via API
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Inform server to expect JSON
        body: JSON.stringify({ name, password, confirmPassword }), // Send form data as JSON
      });

      const data = await response.json(); // Parse JSON response

      if (response.ok) {
        // On success, save the token (if provided) and navigate to login page
        localStorage.setItem("token", data.token);
        navigate("/login"); // Redirect to login page
      } else {
        setError(data.message || "Registration failed."); // Handle errors from server
      }
    } catch (error) {
      setError("Server error. Please try again later."); // Handle network or server errors
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 relative">
      {/* Abstract shape background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500 to-yellow-400 opacity-20"></div>

      {/* Registration form container */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl relative z-10">
        {/* App title */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-teal-800">Banana Game</h1>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-3xl font-semibold text-center text-teal-700">Register</h2>
          {/* Error message */}
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}

          {/* Input fields */}
          <div className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 text-gray-800"
              />
            </div>
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
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
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
            Register
          </button>

          {/* Redirect to Login */}
          <div className="text-center text-gray-600">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="ml-1 text-teal-600 hover:underline focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
