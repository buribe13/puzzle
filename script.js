// 2048 Game Logic with Apple OS UI
// ASSIGNMENT REQUIREMENTS IMPLEMENTED:
// 1. JavaScript-based UI that creates a puzzle game
// 2. Tracks user input (keyboard, touch, button clicks)
// 3. Modifies DOM based on user input and game state
// 4. Dynamic element creation and manipulation
// 5. Game state management with visual feedback
// 6. Interactive puzzle mechanics with animations
class Game2048 {
  constructor() {
    this.board = [];
    this.previousBoard = [];
    this.score = 0;
    this.bestScore = localStorage.getItem("2048-best-score") || 0;
    this.gameWon = false;
    this.gameOver = false;
    this.previousScore = 0;
    this.animationQueue = [];
    this.newTiles = new Set();

    this.initializeGame();
    this.setupEventListeners();
    this.updateDisplay();
  }

  initializeGame() {
    // Initialize empty 4x4 board
    this.board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));

    // Add two initial tiles
    this.addRandomTile();
    this.addRandomTile();

    this.renderBoard();
  }

  setupEventListeners() {
    // ASSIGNMENT REQUIREMENT: User input tracking and DOM manipulation
    // Keyboard controls - tracks user input and modifies DOM based on it
    document.addEventListener("keydown", (e) => {
      if (this.gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          this.move("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          this.move("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          this.move("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          this.move("right");
          break;
      }
    });

    // ASSIGNMENT REQUIREMENT: Touch/swipe controls for mobile interaction
    let startX, startY, endX, endY;

    document.addEventListener("touchstart", (e) => {
      if (this.gameOver) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
      if (this.gameOver) return;
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            this.move("right");
          } else {
            this.move("left");
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            this.move("down");
          } else {
            this.move("up");
          }
        }
      }
    });

    // ASSIGNMENT REQUIREMENT: Button controls that modify game state and DOM
    document.getElementById("new-game").addEventListener("click", () => {
      this.newGame();
    });

    document.getElementById("try-again").addEventListener("click", () => {
      this.newGame();
    });

    document.getElementById("continue-game").addEventListener("click", () => {
      this.gameWon = false;
      document.getElementById("win-message").style.display = "none";
    });

    document.getElementById("new-game-win").addEventListener("click", () => {
      this.newGame();
    });
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      // 90% chance for 2, 10% chance for 4
      const value = Math.random() < 0.9 ? 2 : 4;
      this.board[randomCell.row][randomCell.col] = value;

      // Track this as a new tile for animation
      this.newTiles.add(`${randomCell.row}-${randomCell.col}`);
    }
  }

  move(direction) {
    // Store previous board state for animation tracking
    this.previousBoard = this.board.map((row) => [...row]);
    this.previousScore = this.score;
    this.newTiles.clear();

    let moved = false;

    switch (direction) {
      case "left":
        moved = this.moveLeft();
        break;
      case "right":
        moved = this.moveRight();
        break;
      case "up":
        moved = this.moveUp();
        break;
      case "down":
        moved = this.moveDown();
        break;
    }

    if (moved) {
      this.addRandomTile();
      this.renderBoard();
      this.updateDisplay();
      this.checkGameState();
    }
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const originalRow = [...this.board[row]];
      this.board[row] = this.slideArray(this.board[row], row);

      if (JSON.stringify(originalRow) !== JSON.stringify(this.board[row])) {
        moved = true;
      }
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const originalRow = [...this.board[row]];
      this.board[row] = this.slideArray(
        this.board[row].reverse(),
        row
      ).reverse();

      if (JSON.stringify(originalRow) !== JSON.stringify(this.board[row])) {
        moved = true;
      }
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];
      const originalColumn = [...column];
      const slidColumn = this.slideArray(column, `col-${col}`);

      if (JSON.stringify(originalColumn) !== JSON.stringify(slidColumn)) {
        moved = true;
        for (let row = 0; row < 4; row++) {
          this.board[row][col] = slidColumn[row];
        }
      }
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];
      const originalColumn = [...column];
      const slidColumn = this.slideArray(
        column.reverse(),
        `col-${col}`
      ).reverse();

      if (JSON.stringify(originalColumn) !== JSON.stringify(slidColumn)) {
        moved = true;
        for (let row = 0; row < 4; row++) {
          this.board[row][col] = slidColumn[row];
        }
      }
    }

    return moved;
  }

  slideArray(arr, row = null) {
    // Remove zeros
    const filtered = arr.filter((val) => val !== 0);
    const result = [];

    // Process merges
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        // Merge adjacent equal numbers
        const mergedValue = filtered[i] * 2;
        this.score += mergedValue;
        result.push(mergedValue);

        // Track merge animation with position info
        this.animationQueue.push({
          type: "merge",
          value: mergedValue,
          scoreIncrease: mergedValue,
          row: row,
          position: result.length - 1,
        });

        // Skip the next element since we merged it
        i++;
      } else {
        // No merge, just add the value
        result.push(filtered[i]);
      }
    }

    // Pad with zeros
    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  renderBoard() {
    // ASSIGNMENT REQUIREMENT: Dynamic DOM manipulation based on game state
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        // ASSIGNMENT REQUIREMENT: Creating DOM elements dynamically
        const tile = document.createElement("div");
        tile.className = "tile";

        const value = this.board[row][col];
        if (value !== 0) {
          // ASSIGNMENT REQUIREMENT: Modifying DOM based on game state
          tile.classList.add(`tile-${value}`);
          tile.innerHTML = `<div class="tile-content">${value}</div>`;

          // Add new tile animation for newly created tiles
          if (this.isNewTile(row, col)) {
            tile.classList.add("tile-new");
          }
        }

        gameBoard.appendChild(tile);
      }
    }

    // Process animation queue
    this.processAnimationQueue();
  }

  isNewTile(row, col) {
    // Check if this tile position was tracked as new
    return this.newTiles.has(`${row}-${col}`);
  }

  processAnimationQueue() {
    this.animationQueue.forEach((animation, index) => {
      setTimeout(() => {
        if (animation.type === "merge") {
          this.showMergeAnimation(animation.value, animation.scoreIncrease);
        }
      }, index * 30); // Stagger animations more smoothly
    });

    // Clear the queue
    this.animationQueue = [];
  }

  showMergeAnimation(value, scoreIncrease) {
    // ASSIGNMENT REQUIREMENT: Creating dynamic DOM elements for visual feedback
    const feedback = document.createElement("div");
    feedback.className = "merge-feedback";
    feedback.textContent = `+${scoreIncrease}`;

    // Determine if this is a high-value merge
    const isHighValue = value >= 128;

    // ASSIGNMENT REQUIREMENT: Modifying DOM elements based on game state
    const tiles = document.querySelectorAll(".tile");
    let animationApplied = false;

    tiles.forEach((tile) => {
      const tileContent = tile.querySelector(".tile-content");
      if (tileContent && tileContent.textContent === value.toString()) {
        // ASSIGNMENT REQUIREMENT: Dynamic class manipulation for animations
        tile.classList.add(isHighValue ? "tile-merged-high" : "tile-merged");

        // Remove animation class after animation completes
        setTimeout(
          () => {
            tile.classList.remove(
              isHighValue ? "tile-merged-high" : "tile-merged"
            );
          },
          isHighValue ? 800 : 600
        );

        // ASSIGNMENT REQUIREMENT: Adding elements to DOM dynamically
        if (!animationApplied) {
          tile.style.position = "relative";
          tile.appendChild(feedback);
          animationApplied = true;

          // Add particle effect for high-value merges
          if (isHighValue) {
            this.createParticleEffect(tile);
          }

          // Remove feedback after animation
          setTimeout(() => {
            if (feedback.parentNode) {
              feedback.parentNode.removeChild(feedback);
            }
          }, 1200);
        }
      }
    });

    // Animate score increase
    this.animateScoreIncrease();
  }

  createParticleEffect(tile) {
    // ASSIGNMENT REQUIREMENT: Creating multiple DOM elements dynamically
    const particleCount = 8;
    const tileRect = tile.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
      // ASSIGNMENT REQUIREMENT: Dynamic element creation and styling
      const particle = document.createElement("div");
      particle.className = "particle-effect";

      // Random direction for particles
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // ASSIGNMENT REQUIREMENT: Dynamic CSS property manipulation
      particle.style.setProperty("--random-x", `${x}px`);
      particle.style.setProperty("--random-y", `${y}px`);

      tile.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1500);
    }
  }

  animateScoreIncrease() {
    // ASSIGNMENT REQUIREMENT: DOM manipulation for visual feedback
    const scoreElement = document.getElementById("score");
    scoreElement.classList.add("score-increase");

    setTimeout(() => {
      scoreElement.classList.remove("score-increase");
    }, 800);
  }

  updateDisplay() {
    // ASSIGNMENT REQUIREMENT: Modifying DOM content based on game state
    document.getElementById("score").textContent = this.score;
    document.getElementById("best-score").textContent = this.bestScore;

    // Update best score if current score is higher
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem("2048-best-score", this.bestScore);
    }
  }

  checkGameState() {
    // ASSIGNMENT REQUIREMENT: Game state management and DOM manipulation
    // Check for win condition (2048 tile)
    if (!this.gameWon) {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.board[row][col] === 2048) {
            this.gameWon = true;
            // ASSIGNMENT REQUIREMENT: Modifying DOM visibility based on game state
            document.getElementById("win-message").style.display = "flex";
            return;
          }
        }
      }
    }

    // Check for game over
    if (this.isGameOver()) {
      this.gameOver = true;
      // ASSIGNMENT REQUIREMENT: Modifying DOM visibility based on game state
      document.getElementById("game-over").style.display = "flex";
    }
  }

  isGameOver() {
    // Check if there are any empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    // Check if any adjacent cells can be merged
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        // Check right neighbor
        if (col < 3 && this.board[row][col + 1] === current) {
          return false;
        }

        // Check bottom neighbor
        if (row < 3 && this.board[row + 1][col] === current) {
          return false;
        }
      }
    }

    return true;
  }

  newGame() {
    // ASSIGNMENT REQUIREMENT: Resetting game state and DOM elements
    this.board = [];
    this.previousBoard = [];
    this.score = 0;
    this.gameWon = false;
    this.gameOver = false;
    this.previousScore = 0;
    this.animationQueue = [];
    this.newTiles.clear();

    // ASSIGNMENT REQUIREMENT: Modifying DOM visibility based on game state
    document.getElementById("game-over").style.display = "none";
    document.getElementById("win-message").style.display = "none";

    this.initializeGame();
    this.updateDisplay();
  }
}

// ASSIGNMENT REQUIREMENT: Initializing the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Game2048();
});
