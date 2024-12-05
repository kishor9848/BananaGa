import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import GameStatus from './GameStatus'; // Import the GameStatus class

function Game() {
  const [number, setNumber] = useState(''); // State for storing the entered number
  const [gameData, setGameData] = useState(null); // State to store game data (question and solution)
  const [error, setError] = useState(null); // State to handle errors
  const [gameOver, setGameOver] = useState(false); // State to track if the game is over
  const [showResult, setShowResult] = useState(false); // State to show result after making a move
  const [loading, setLoading] = useState(false); // State to handle loading state when starting a game
  const [isIncorrect, setIsIncorrect] = useState(false); // State to handle incorrect number attempts
  const [username, setUsername] = useState(''); // State to store the logged-in user's name
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // State for logout confirmation modal

  const navigate = useNavigate();

  // Create an instance of GameStatus to track the score and chances left
  const [gameStatus] = useState(new GameStatus());

  useEffect(() => {
    // Check if the user is logged in by verifying the token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token to extract the username
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.name);
      } catch (err) {
        console.error('Token decoding error:', err);
        navigate('/login'); // Redirect to login if token decoding fails
      }
    } else {
      navigate('/login'); // Redirect to login if token is not found
    }
  }, [navigate]);

  const startGame = async () => {
    // Function to start the game
    setLoading(true);
    try {
      // Make a request to the backend to start a new game
      const response = await axios.get('http://localhost:5000/api/game/start');
      setGameData(response.data.data); // Set the game data
      setError(null);
      setGameOver(false); // Reset game over state
      setShowResult(false); // Reset show result state
      gameStatus.setScore(0); // Reset score
      gameStatus.setChancesLeft(3); // Reset chances
      setLoading(false);
    } catch (err) {
      setError('Error starting the game.'); // Set error state if API call fails
      setLoading(false);
    }
  };

  const makemove = async () => {
    // Function to make a move in the game
    if (!number) return setError('Please enter a number.'); // Check if number is entered
    
    const selectedNumber = parseInt(number, 10);
    if (isNaN(selectedNumber) || selectedNumber < 0 || selectedNumber > 9) {
      setError('Please enter a valid number between 0 and 9.'); // Validate the entered number
      return;
    }

    if (gameData) {
      const solution = gameData.solution;
      if (selectedNumber === solution) {
        // If the guessed number is correct
        setGameOver(true);
        setShowResult(true);
        setError(null);
        gameStatus.incrementScore(10); // Increase score for correct guess
        setIsIncorrect(false);

        // Update the score in the backend after a correct guess
        try {
          await axios.put('http://localhost:5000/api/auth/update-score', {
            username: username, // Send the username
            newScore: gameStatus.getScore(), // Send the updated score
          });
          console.log('Score updated successfully');
        } catch (err) {
          console.error('Error updating score:', err);
          setError('Error updating score.'); // Handle error during score update
        }
      } else {
        // If the guessed number is incorrect
        setIsIncorrect(selectedNumber);
        gameStatus.decrementChances(); // Decrease chances
        gameStatus.decrementScore(2); // Decrease score for incorrect guess

        if (gameStatus.getChancesLeft() <= 0) {
          setGameOver(true);
          setShowResult(true);
          setError('Out of attempts! Game Over.'); // Show game over message if no chances left
        } else {
          setError(`Oops! ${selectedNumber} is not a correct number. Try again!`); // Provide feedback for incorrect guess
        }
      }
    }

    setNumber(''); // Reset the entered number
  };

  const handleChange = (e) => {
    setNumber(e.target.value); // Update the entered number as the user types
  };

  const handlePlayAgain = () => {
    // Function to reset the game and start again
    setNumber('');
    setGameData(null);
    setGameOver(false);
    setShowResult(false);
    setIsIncorrect(false);
    startGame(); // Restart the game
  };

  const handleLogout = () => {
    // Function to show logout confirmation modal
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    // Function to handle logout and redirect to login page
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false); // Close the logout confirmation modal without logging out
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-screen flex justify-center items-center">
      <div className="game-container flex w-full max-w-6xl p-8 bg-white rounded-xl shadow-xl">
        {/* Game Section */}
        <div className="game-content w-2/3 p-6 bg-gradient-to-t from-indigo-400 to-indigo-500 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold text-white text-center mb-6">Banana Game</h1>
          {!gameData && !gameOver && (
            <div className="start-game-btn mb-6">
              <button
                className="bg-green-600 text-white py-3 px-6 rounded-full w-full shadow-md hover:bg-green-700"
                onClick={startGame} // Start game button
                disabled={loading}
              >
                {loading ? 'Starting Game...' : 'Start New Game'}
              </button>
            </div>
          )}

          {gameData && (
            <div className="game-section text-center">
              <div className="image-container mb-6">
                <img
                  src={gameData.question} // Display the game question image
                  alt="Game Question"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              {showResult && gameOver ? (
                isIncorrect ? (
                  <div className="result text-center mt-4">
                    <p className="text-lg text-white-600">Oops! {isIncorrect} is not a correct number. Try again!</p>
                  </div>
                ) : (
                  <div className="result text-center mt-4">
                    <p className="text-lg text-red-800 text-lg">Correct! Well done!</p>
                  </div>
                )
              ) : (
                <div className="move flex justify-center space-x-6 mb-6">
                  <input
                    type="number"
                    placeholder="Enter number"
                    value={number}
                    onChange={handleChange} // Update number on input change
                    className="border-2 border-gray-300 p-3 rounded-md text-center w-50"
                  />
                  <button
                    className="bg-green-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-green-700"
                    onClick={makemove} // Call makemove when the user takes a step
                  >
                    Take a step
                  </button>
                </div>
              )}
              {error && <p className="error text-red-800 text-center mb-6 text-lg">{error}</p>}
              {gameOver && (
                <div className="play-again text-center">
                  <button
                    className="bg-green-600 text-white py-3 px-6 rounded-full w-full shadow-md hover:bg-green-700"
                    onClick={handlePlayAgain} // Button to play again
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="user-info w-1/3 p-6 ml-6 bg-white rounded-xl shadow-xl flex flex-col justify-between">
          <div className="welcome-message text-center mb-4">
            <p className="text-lg font-semibold text-gray-700">Welcome, {username ? username : 'Guest'}</p>
          </div>
          <div className="score-attempts text-center text-gray-700 mb-6">
            <p className="text-xl">Score: {gameStatus.getScore()}</p>
            <p className="text-xl">Chances Left: {gameStatus.getChancesLeft()}</p>
          </div>

          <button
            className="bg-red-600 text-white py-2 px-6 rounded-full shadow-md hover:bg-red-700 w-full"
            onClick={handleLogout} // Show logout confirmation modal
          >
            Logout
          </button>

          {showLogoutConfirmation && (
            <div className="logout-confirmation-modal fixed top-0 left-0 right-0 bottom-0 bg-opacity-50 bg-black flex justify-center items-center">
              <div className="logout-modal bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-lg mb-4">Are you sure you want to log out?</p>
                <button
                  className="bg-red-600 text-white py-2 px-6 rounded-full shadow-md hover:bg-red-700 mr-4"
                  onClick={confirmLogout} // Confirm logout
                >
                  Yes, Logout
                </button>
                <button
                  className="bg-gray-600 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-700"
                  onClick={cancelLogout} // Cancel logout
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
