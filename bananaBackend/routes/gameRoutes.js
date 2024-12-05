// Import required modules
const express = require('express'); // Import the Express framework
const router = express.Router(); // Create a router instance
const gameController = require('../controllers/gameController'); 
// Import the gameController which contains the logic for game operations

// Define route to start a new game
router.get('/start', gameController.startGame); 
// Handles GET requests to "/start"
// This route invokes the `startGame` function in the gameController to initialize a new game

// Define route to make a move in the game
router.post('/move', gameController.makeMove); 
// Handles POST requests to "/move"
// This route invokes the `makeMove` function in the gameController to process a player's move

// Define route to get the result of the game
router.get('/result', gameController.getResult); 
// Handles GET requests to "/result"
// This route invokes the `getResult` function in the gameController to fetch the game's result

// Export the router to be used in other parts of the application
module.exports = router;
