// GameStatus.js
class GameStatus {
    constructor(initialScore = 0, initialChances = 3) {
      this.score = initialScore;
      this.chancesLeft = initialChances;
    }
  
    // Getter for score
    getScore() {
      return this.score;
    }
  
    // Setter for score
    setScore(newScore) {
      this.score = newScore;
    }
  
    // Getter for chances left
    getChancesLeft() {
      return this.chancesLeft;
    }
  
    // Setter for chances left
    setChancesLeft(newChances) {
      this.chancesLeft = newChances;
    }
  
    // Decrement chances left by 1
    decrementChances() {
      if (this.chancesLeft > 0) {
        this.chancesLeft -= 1;
      }
    }
  
    // Increment score by a specified value
    incrementScore(value) {
      this.score += value;
    }
  
    // Decrement score by a specified value
    decrementScore(value) {
      this.score -= value;
    }
  }
  
  export default GameStatus;
  