// Import required modules
const express = require('express');  // Import the Express framework to create a server
const cors = require('cors');  // Import CORS to enable cross-origin resource sharing
const dotenv = require('dotenv');  // Import dotenv to manage environment variables
const gameRoutes = require('./routes/gameRoutes');  // Import gameRoutes for handling game-related API routes
const connectDB = require("./config/Connection");  // Import function to connect to the database

// Load environment variables from a .env file into process.env
dotenv.config();  // Load environment variables

// Create an instance of the Express application
const app = express();

// Establish a connection to the database
connectDB();  // Connect to the database using the imported function

// Middleware configuration
app.use(cors());  // Enable CORS to allow cross-origin requests
app.use(express.json());  // Middleware to parse incoming JSON payloads

// Define route handlers
app.use('/api/game', gameRoutes);  // Use gameRoutes for handling requests to /api/game
app.use("/api/auth", require("./routes/authRoutes"));  // Use authRoutes for handling requests to /api/auth

// Start the server and listen on a specified port
const PORT = process.env.PORT || 5000;  // Set the port from the environment variable or default to 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  // Log a message when the server starts
});
