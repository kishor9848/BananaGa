// Import required modules
const express = require('express');  // Import the Express framework to create and manage the server
const cors = require('cors');  // Import CORS to enable handling of cross-origin resource sharing
const dotenv = require('dotenv');  // Import dotenv to load environment variables from a .env file
const gameRoutes = require('./routes/gameRoutes');  // Import gameRoutes for handling game-related API routes
const connectDB = require("./config/Connection");  // Import the function to establish a database connection

// Load environment variables from a .env file into process.env
dotenv.config();  // Makes environment variables available via `process.env`

// Create an instance of the Express application
const app = express();

// Establish a connection to the MongoDB database
connectDB();  // Calls the connectDB function to connect to the database

// Middleware configuration
app.use(cors());  // Enables CORS, allowing the server to handle requests from different origins
app.use(express.json());  // Middleware to parse incoming request bodies in JSON format

// Define route handlers
app.use('/api/game', gameRoutes);  // All requests to /api/game are routed to gameRoutes
app.use("/api/auth", require("./routes/authRoutes"));  // All requests to /api/auth are routed to authRoutes

// Start the server and listen on a specified port
const PORT = process.env.PORT || 5000;  // Define the port using an environment variable or default to 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  // Log a message to confirm the server has started successfully
});
