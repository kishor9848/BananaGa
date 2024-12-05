import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import GameStatus from './GameStatus'; // Import the GameStatus class

function Game() {
  const [number, setNumber] = useState('');
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [username, setUsername] = useState('');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const navigate = useNavigate();

  // Create an instance of GameStatus
  const [gameStatus] = useState(new GameStatus());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.name);
      } catch (err) {
        console.error('Token decoding error:', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const startGame = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/game/start');
      setGameData(response.data.data);
      setError(null);
      setGameOver(false);
      setShowResult(false);
      gameStatus.setScore(0);
      gameStatus.setChancesLeft(3);
      setLoading(false);
    } catch (err) {
      setError('Error starting the game.');
      setLoading(false);
    }
  };

  const makemove = async () => {
    if (!number) return setError('Please enter a number.');
  
    const selectedNumber = parseInt(number, 10);
    if (isNaN(selectedNumber) || selectedNumber < 0 || selectedNumber > 9) {
      setError('Please enter a valid number between 0 and 9.');
      return;
    }
  
    if (gameData) {
      const solution = gameData.solution;
      if (selectedNumber === solution) {
        setGameOver(true);
        setShowResult(true);
        setError(null);
        gameStatus.incrementScore(10);
        setIsIncorrect(false);
  
        // Call API to update the score in the backend after a correct guess
        try {
          await axios.put('http://localhost:5000/api/auth/update-score', {
            username: username, // Sending the username
            newScore: gameStatus.getScore(), // Sending the updated score
          });
          console.log('Score updated successfully');
        } catch (err) {
          console.error('Error updating score:', err);
          setError('Error updating score.');
        }
      } else {
        setIsIncorrect(selectedNumber);
        gameStatus.decrementChances();
        gameStatus.decrementScore(2);
  
        if (gameStatus.getChancesLeft() <= 0) {
          setGameOver(true);
          setShowResult(true);
          setError('Out of attempts! Game Over.');
        } else {
          setError(`Oops! ${selectedNumber} is not a correct number. Try again!`);
        }
      }
    }
  
    setNumber('');
  };
  

  

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handlePlayAgain = () => {
    setNumber('');
    setGameData(null);
    setGameOver(false);
    setShowResult(false);
    setIsIncorrect(false);
    startGame();
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
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
                onClick={startGame}
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
                  src={gameData.question}
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
                    onChange={handleChange}
                    className="border-2 border-gray-300 p-3 rounded-md text-center w-50"
                  />
                  <button
                    className="bg-green-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-green-700"
                    onClick={makemove}
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
                    onClick={handlePlayAgain}
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="user-info w-1/3 p-6 ml-6 bg-white rounded-xl shadow-xl flex flex-col justify-between">
          <div className="welcome-message text-center mb-4">
            <p className="text-lg font-semibold text-gray-700">Welcome, {username ? username : 'Guest'}</p>
          </div>
          <div className="score-attempts text-center text-gray-700 mb-6">
            <p className="text-xl">Score: {gameStatus.getScore()}</p>
            <p className="text-xl">Chances Left: {gameStatus.getChancesLeft()}</p>
          </div>
          <div className="logout-btn text-center">
            <button
              className="bg-red-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {showLogoutConfirmation && (
        <div className="logout-confirmation fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center">
            <p className="text-lg mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-6">
              <button
                className="bg-red-600 text-white py-2 px-6 rounded-full shadow-md hover:bg-red-700"
                onClick={confirmLogout}
              >
                Logout
              </button>
              <button
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-full shadow-md hover:bg-gray-400"
                onClick={cancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
