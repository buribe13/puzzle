# 2048 - Apple Style Puzzle Game

A modern, Apple OS-inspired implementation of the classic 2048 puzzle game. Built with vanilla JavaScript, HTML5, and CSS3, featuring a beautiful glassmorphism design and smooth animations.

## Features

- **Apple OS Design Language**: Clean, modern interface with glassmorphism effects and SF Pro Display font
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Touch Controls**: Swipe gestures for mobile gameplay
- **Keyboard Controls**: Arrow keys for desktop gameplay
- **Score Tracking**: Persistent high score storage using localStorage
- **Smooth Animations**: Tile appearance and merge animations
- **Win/Lose States**: Proper game state management with modal dialogs

## How to Play

1. Use arrow keys (desktop) or swipe gestures (mobile) to move tiles
2. When two tiles with the same number touch, they merge into one
3. Try to create a tile with the number 2048 to win!
4. The game ends when the board is full and no moves are possible

## Controls

- **Desktop**: Arrow keys (↑ ↓ ← →)
- **Mobile**: Swipe in any direction
- **Buttons**: New Game, Try Again, Continue Playing

## Installation

Simply open `index.html` in your web browser. No additional setup required!

## File Structure

```
puzzle/
├── index.html      # Main HTML structure
├── style.css       # Apple OS inspired styling
├── script.js       # Game logic and controls
└── README.md       # This file
```

## Technical Implementation

- **Game Logic**: Object-oriented JavaScript class managing board state, tile movement, and scoring
- **DOM Manipulation**: Dynamic tile rendering and UI updates based on game state
- **Event Handling**: Keyboard and touch event listeners for user input
- **Local Storage**: Persistent high score tracking
- **CSS Grid**: Responsive 4x4 game board layout
- **CSS Animations**: Smooth transitions and visual feedback

## Browser Compatibility

Works on all modern browsers that support:

- ES6 Classes
- CSS Grid
- CSS Custom Properties
- Touch Events (for mobile)
- Local Storage
