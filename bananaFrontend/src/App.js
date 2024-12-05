import React from "react"; // Importing React library
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Importing routing components from react-router-dom
import Login from "./components/Login"; // Importing the Login component
import Register from "./components/Register"; // Importing the Register component
import Game from "./components/Game"; // Importing the Game component

const App = () => {
  return (
    <Router> {/* Router component wraps all the routes for navigation */}
      <Routes> {/* Defines all the available routes in the app */}
        {/* Redirect the root path ("/") to the "/login" route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Route for the Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Route for the Register page */}
        <Route path="/register" element={<Register />} />
        
        {/* Route for the Game page */}
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App; // Export the App component for use in other files
