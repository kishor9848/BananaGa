const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  const { name, password, confirmPassword } = req.body;

   // Validate input fields
  if (!name || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error); // Log error
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { name, password } = req.body;

  // Validate input fields
  if (!name || !password) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  try {
    // Find the user by name
    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, name:user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // Respond with the token and username
    res.json({ token });
  } catch (error) {
    // Send response with the generated token
    console.error("Error in loginUser:", error); // Log error
    res.status(500).json({ message: "Server error" });
  }
};

// Exporting the functions for use in other files
module.exports = { registerUser, loginUser };