const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Start a new game
router.get('/start', gameController.startGame);

// Make a move
router.post('/move', gameController.makeMove);

// Get the game result
router.get('/result', gameController.getResult);

module.exports = router;
