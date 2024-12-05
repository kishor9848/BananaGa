import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token); // Assuming the response contains a token
        localStorage.setItem("username", data.username);  // Storing the username
        setFormData({ username: "", password: "" }); // Reset formData
        setError("");
        navigate("/game");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 relative">
      {/* Abstract shape background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500 to-yellow-400 opacity-20"></div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl relative z-10">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-teal-800">Banana Game</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-3xl font-semibold text-center text-teal-700">Login to Continue</h2>
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}

          <div className="space-y-6">
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

          <button
            type="submit"
            className="w-full py-3 text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-all duration-300"
          >
            Login
          </button>

          <div className="text-center text-gray-600">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/register")}
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

export default Login;
