// Import required modules
const express = require("express"); // Express framework for building APIs
const { registerUser, loginUser } = require("../controllers/authController"); // Import authentication controller functions
const User = require("../models/User"); // Import User model for database operations

// Create an instance of the Express Router
const router = express.Router();

// Define route for user registration
router.post("/register", registerUser); 
// This route handles POST requests to "/register" and invokes the registerUser function from the authController

// Define route for user login
router.post("/login", loginUser); 
// This route handles POST requests to "/login" and invokes the loginUser function from the authController

// Define route to update the user's score
router.put("/update-score", async (req, res) => {
  // Extract username and newScore from the request body
  const { username, newScore } = req.body;

  // Validate the input: Check if both username and newScore are provided
  if (!username || newScore === undefined) {
    return res.status(400).json({ message: "Please provide both username and new score." }); 
    // Respond with 400 status code if input is invalid
  }

  // Ensure newScore is a number
  if (typeof newScore !== "number") {
    return res.status(400).json({ message: "The score must be a number." }); 
    // Respond with 400 status code if newScore is not a valid number
  }

  try {
    // Find the user in the database using the provided username
    const user = await User.findOne({ name: username });

    // If the user is not found, respond with a 404 status code
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's score with the newScore value
    user.score = newScore;

    // Save the updated user document back to the database
    await user.save();

    // Respond with a success message and the updated user details
    res.json({
      message: "Score updated successfully.",
      user: {
        name: user.name, // Return the user's name
        score: user.score, // Return the updated score
      },
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error updating score:", error); // Log the error to the console
    res.status(500).json({ message: "Server error" }); // Respond with a 500 status code
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
