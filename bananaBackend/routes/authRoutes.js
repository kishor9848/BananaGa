const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const User = require("../models/User"); 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Route to update the score based on the username
router.put("/update-score", async (req, res) => {
  const { username, newScore } = req.body; // Get username and newScore from request body

  // Validate input
  if (!username || newScore === undefined) {
    return res.status(400).json({ message: "Please provide both username and new score." });
  }

  if (typeof newScore !== "number") {
    return res.status(400).json({ message: "The score must be a number." });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ name: username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the score
    user.score = newScore;

    // Save the updated user document
    await user.save();

    // Respond with the updated user details
    res.json({
      message: "Score updated successfully.",
      user: {
        name: user.name,
        score: user.score,
      },
    });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;