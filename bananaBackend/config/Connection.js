// Importing the Mongoose library for MongoDB interaction
const mongoose = require("mongoose");

// Defining an asynchronous function to establish a connection to the MongoDB database
const connectDB = async () => {
  try {
    // Attempting to connect to the MongoDB database using Mongoose
    await mongoose.connect("mongodb://localhost:27017/Banana", {
      useNewUrlParser: true, // Use the new URL string parser for MongoDB connection strings
      useUnifiedTopology: true, // Enable the new server discovery and monitoring engine
    });
    
    // Log a success message if the connection is established successfully
    console.log("MongoDB connected");
  } catch (error) {
    // Catch and log any error that occurs during the connection attempt
    console.error(error.message);
    
    // Exit the Node.js process with a failure status code (1) if the connection fails
    process.exit(1);
  }
};

// Exporting the `connectDB` function so it can be used in other parts of the application
module.exports = connectDB;
