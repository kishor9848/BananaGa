// Importing the Mongoose library
const mongoose = require("mongoose");

// Defining an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempting to connect to the MongoDB database at the specified URI
    await mongoose.connect("mongodb://localhost:27017/Banana", {
      useNewUrlParser: true,  // Ensures MongoDB connection string parsing is done using the new parser
      useUnifiedTopology: true,  // Enables the new server discovery and monitoring engine
    });
    
    // Logging a success message upon a successful connection
    console.log("MongoDB connected");
  } catch (error) {
    // Catching and logging any errors that occur during the connection attempt
    console.error(error.message);
    
    // Exiting the process with a failure code
    process.exit(1);
  }
};

// Exporting the connectDB function for use in other files
module.exports = connectDB;
