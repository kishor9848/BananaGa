// Import required modules
const User = require("../models/User"); // Import the User model for database operations
const bcrypt = require("bcryptjs"); // Import bcrypt for hashing passwords
const jwt = require("jsonwebtoken"); // Import JSON Web Token for generating authentication tokens

// Register User function
const registerUser = async (req, res) => {
  const { name, password, confirmPassword } = req.body; // Extract input fields from the request body

  // Validate input fields
  if (!name || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill out all fields." }); 
    // Respond with 400 status if any field is missing
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." }); 
    // Respond with 400 status if passwords do not match
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." }); 
    // Respond with 400 status if password length is insufficient
  }

  try {
    // Check if a user with the same name already exists in the database
    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ message: "User already exists." }); 
    // Respond with 400 status if user exists

    // Hash the user's password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); 
    // Hashing strength is 10

    // Create a new user with the hashed password
    const newUser = new User({ name, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error); // Log any errors
    res.status(500).json({ message: "Server error" }); 
    // Respond with 500 status if a server error occurs
  }
};

// Login User function
const loginUser = async (req, res) => {
  const { name, password } = req.body; // Extract input fields from the request body

  // Validate input fields
  if (!name || !password) {
    return res.status(400).json({ message: "Please fill out all fields." }); 
    // Respond with 400 status if any field is missing
  }

  try {
    // Find the user by their name in the database
    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ message: "User not found" }); 
    // Respond with 400 status if user does not exist

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" }); 
    // Respond with 400 status if passwords do not match

    // Generate a JWT token with a 1-hour expiration time
    const token = jwt.sign(
      { id: user._id, name: user.name }, // Payload: user ID and name
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Respond with the generated token
    res.json({ token }); // Send the token as a response
  } catch (error) {
    console.error("Error in loginUser:", error); // Log any errors
    res.status(500).json({ message: "Server error" }); 
    // Respond with 500 status if a server error occurs
  }
};

// Export the functions to be used in other parts of the application
module.exports = { registerUser, loginUser };
