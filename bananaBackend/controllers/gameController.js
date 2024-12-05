const axios = require('axios');

// Helper function to fetch game data from the API
const fetchGameData = async () => {
  try {
    const response = await axios.get("http://marcconrad.com/uob/banana/api.php");
    return response.data;
  } catch (error) {
    throw error; // Propagate the error to be handled by the calling function
  }
};

// Start a new game
exports.startGame = async (req, res) => {
  try {
    console.log("Starting new game...");
    const data = await fetchGameData(); // Reusable API call
    console.log("Game started successfully:", data);  // Log the response
    res.status(200).json({ message: 'New game started', data });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Error starting game', details: error.message });
  }
};

// Make a move
exports.makeMove = async (req, res) => {
  const { number } = req.body;

  // Validate the input number
  if (!number) {
    return res.status(400).json({ error: 'A number is required to make a move' });
  }

  const selectedNumber = parseInt(number, 10);
  if (isNaN(selectedNumber) || selectedNumber < 0 || selectedNumber > 9) {
    return res.status(400).json({ error: 'Please enter a valid number between 0 and 9.' });
  }

  try {
    console.log("Making move with number:", selectedNumber);
    const response = await axios.get(`http://marcconrad.com/uob/banana/api.php?num=${selectedNumber}`);
    console.log("Move made successfully:", response.data);
    res.status(200).json({ message: 'Move made', data: response.data });
  } catch (error) {
    console.error('Error making move:', error);
    res.status(500).json({ error: 'Error making move', details: error.message });
  }
};

// Get the game result
exports.getResult = async (req, res) => {
  try {
    console.log("Fetching game result...");
    const data = await fetchGameData(); // Reusable API call for result
    console.log("Game result fetched successfully:", data);
    res.status(200).json({ message: 'Game result', data });
  } catch (error) {
    console.error('Error getting result:', error);
    res.status(500).json({ error: 'Error getting result', details: error.message });
  }
};
