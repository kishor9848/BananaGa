// GameStatus.js
class GameStatus {
  // Constructor to initialize the game status with default values
  constructor(initialScore = 0, initialChances = 3) {
    this.score = initialScore;  // Initialize score, default is 0
    this.chancesLeft = initialChances;  // Initialize chances left, default is 3
  }

  // Getter for score
  getScore() {
    return this.score;  // Returns the current score
  }

  // Setter for score
  setScore(newScore) {
    this.score = newScore;  // Sets the score to a new value
  }

  // Getter for chances left
  getChancesLeft() {
    return this.chancesLeft;  // Returns the current number of chances left
  }

  // Setter for chances left
  setChancesLeft(newChances) {
    this.chancesLeft = newChances;  // Sets the number of chances left to a new value
  }

  // Decrement chances left by 1
  decrementChances() {
    if (this.chancesLeft > 0) {
      this.chancesLeft -= 1;  // Reduces chances left by 1, if greater than 0
    }
  }

  // Increment score by a specified value
  incrementScore(value) {
    this.score += value;  // Increases the score by the provided value
  }

  // Decrement score by a specified value
  decrementScore(value) {
    this.score -= value;  // Decreases the score by the provided value
  }
}

// Export the class to make it available for import in other files
export default GameStatus;
