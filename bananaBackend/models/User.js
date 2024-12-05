// Import the mongoose library for working with MongoDB
const mongoose = require("mongoose");

// Define a schema for the User model
const UserSchema = new mongoose.Schema({
  // Define the 'name' field for the user
  name: { 
    type: String, // Data type: String
    required: true, // This field is mandatory
  },
  // Define the 'password' field for the user
  password: { 
    type: String, // Data type: String
    required: true, // This field is mandatory
  },
  // Define the 'score' field for the user
  score: { 
    type: String, // Data type: String
    default: 0, // Default value is 0 if no score is provided
  },
});

// Export the User model based on the defined schema
module.exports = mongoose.model("User", UserSchema); 
// This creates a MongoDB collection named 'users' (pluralized version of 'User') and exports it for use in other parts of the application
