// Import required modules
const axios = require('axios'); // Import Axios for making HTTP requests

// Helper function to fetch game data from the Banana API
const fetchGameData = async () => {
  try {
    // Make a GET request to the API
    const response = await axios.get("http://marcconrad.com/uob/banana/api.php");
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Propagate the error for handling in the calling function
  }
};

// Controller function to start a new game
exports.startGame = async (req, res) => {
  try {
    console.log("Starting new game..."); // Log the start of a new game
    const data = await fetchGameData(); // Call the helper function to fetch game data
    console.log("Game started successfully:", data); // Log the fetched game data
    res.status(200).json({ message: 'New game started', data }); 
    // Respond with a success message and game data
  } catch (error) {
    console.error('Error starting game:', error); // Log any errors
    res.status(500).json({ error: 'Error starting game', details: error.message }); 
    // Respond with a 500 status and error details if an error occurs
  }
};

// Controller function to make a move in the game
exports.makeMove = async (req, res) => {
  const { number } = req.body; // Extract the number from the request body

  // Validate the input number
  if (!number) {
    return res.status(400).json({ error: 'A number is required to make a move' }); 
    // Respond with a 400 status if the number is missing
  }

  const selectedNumber = parseInt(number, 10); // Convert the input number to an integer
  if (isNaN(selectedNumber) || selectedNumber < 0 || selectedNumber > 9) {
    return res.status(400).json({ error: 'Please enter a valid number between 0 and 9.' }); 
    // Respond with a 400 status if the number is invalid
  }

  try {
    console.log("Making move with number:", selectedNumber); // Log the selected number
    const response = await axios.get(`http://marcconrad.com/uob/banana/api.php?num=${selectedNumber}`);
    // Make a GET request to the API with the selected number
    console.log("Move made successfully:", response.data); // Log the API response
    res.status(200).json({ message: 'Move made', data: response.data }); 
    // Respond with a success message and API response data
  } catch (error) {
    console.error('Error making move:', error); // Log any errors
    res.status(500).json({ error: 'Error making move', details: error.message }); 
    // Respond with a 500 status and error details if an error occurs
  }
};

// Controller function to get the game result
exports.getResult = async (req, res) => {
  try {
    console.log("Fetching game result..."); // Log the result fetch operation
    const data = await fetchGameData(); // Call the helper function to fetch game data
    console.log("Game result fetched successfully:", data); // Log the fetched game data
    res.status(200).json({ message: 'Game result', data }); 
    // Respond with a success message and game result data
  } catch (error) {
    console.error('Error getting result:', error); // Log any errors
    res.status(500).json({ error: 'Error getting result', details: error.message }); 
    // Respond with a 500 status and error details if an error occurs
  }
};
