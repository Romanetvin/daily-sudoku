/**
 * Main application entry point
 */

import { generateDailyPuzzles } from './sudoku/generator.js';
import { getTodayDateString, formatDate } from './utils/daily.js';
import { SudokuGame } from './ui/game.js';
import { GameControls, NumberPad, GameActions } from './ui/controls.js';

class DailySudokuApp {
  constructor() {
    this.puzzles = null;
    this.currentDifficulty = 'extreme';
    this.game = null;
    this.controls = null;
    this.numberPad = null;
    this.actions = null;
    this.initialDate = null;
    this.dateCheckInterval = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    const dateString = getTodayDateString();
    this.initialDate = dateString;

    // Generate daily puzzles
    this.puzzles = generateDailyPuzzles(dateString);

    // Create app structure
    this.createLayout(dateString);

    // Initialize game
    const gameContainer = document.getElementById('sudoku-grid');
    this.game = new SudokuGame(gameContainer);

    // Initialize controls
    const controlsContainer = document.getElementById('difficulty-controls');
    this.controls = new GameControls(controlsContainer, (difficulty) => {
      this.currentDifficulty = difficulty;
      this.loadPuzzle();
    });

    // Initialize number pad
    const numberPadContainer = document.getElementById('number-pad');
    this.numberPad = new NumberPad(
      numberPadContainer,
      (num) => this.game.setValue(num),
      () => this.game.clearCell()
    );

    // Initialize actions
    const actionsContainer = document.getElementById('game-actions');
    this.actions = new GameActions(
      actionsContainer,
      () => this.game.reset(),
      () => this.game.toggleSolution()
    );

    // Render UI
    this.controls.render();
    this.numberPad.render();
    this.actions.render();

    // Load initial puzzle
    this.loadPuzzle();

    // Add keyboard support
    this.setupKeyboardControls();

    // Start checking for new day every hour
    this.startDateCheck();
  }

  /**
   * Create the main layout
   */
  createLayout(dateString) {
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Daily Sudoku
            </h1>
            <p class="text-gray-600 dark:text-gray-300">
              ${formatDate(dateString)}
            </p>
          </header>

          <!-- Main Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
            <!-- Difficulty Controls -->
            <div id="difficulty-controls" class="mb-6"></div>

            <!-- Game Grid -->
            <div class="flex justify-center mb-6">
              <div id="sudoku-grid"></div>
            </div>

            <!-- Number Pad -->
            <div id="number-pad" class="mb-6"></div>

            <!-- Game Actions -->
            <div id="game-actions" class="mb-4"></div>

            <!-- Instructions -->
            <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 class="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                How to Play:
              </h3>
              <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Click a cell and select a number from the pad below</li>
                <li>• Fill the grid so each row, column, and 3×3 box contains digits 1-9</li>
                <li>• Use keyboard numbers 1-9 or click the number pad</li>
                <li>• Press Delete/Backspace to clear a cell</li>
                <li>• All difficulty levels use the same solution, just fewer clues!</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <footer class="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>A new puzzle every day! Come back tomorrow for a new challenge.</p>
          </footer>
        </div>
      </div>
    `;
  }

  /**
   * Load puzzle for current difficulty
   */
  loadPuzzle() {
    const puzzleData = this.puzzles[this.currentDifficulty];
    this.game.init(puzzleData.puzzle, puzzleData.solution);
    this.actions.updateSolutionState(false);
  }

  /**
   * Setup keyboard controls
   */
  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      // Number keys
      if (e.key >= '1' && e.key <= '9') {
        this.game.setValue(parseInt(e.key));
      }
      // Delete/Backspace
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        this.game.clearCell();
      }
      // Arrow keys for navigation
      else if (e.key.startsWith('Arrow') && this.game.selectedCell) {
        e.preventDefault();
        const { row, col } = this.game.selectedCell;
        let newRow = row;
        let newCol = col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            break;
        }

        this.game.selectCell(newRow, newCol);
      }
    });
  }

  /**
   * Start checking for new day every hour
   */
  startDateCheck() {
    // Check every hour (3600000 ms)
    this.dateCheckInterval = setInterval(() => {
      const currentDate = getTodayDateString();
      if (currentDate !== this.initialDate) {
        this.showNewPuzzleButton();
      }
    }, 3600000);
  }

  /**
   * Show button to load new puzzle
   */
  showNewPuzzleButton() {
    // Only show once
    if (document.getElementById('new-puzzle-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'new-puzzle-banner';
    banner.className = 'fixed top-0 left-0 right-0 bg-primary text-primary-foreground py-3 px-4 shadow-lg z-50 text-center';
    banner.innerHTML = `
      <div class="max-w-4xl mx-auto flex items-center justify-center gap-4 flex-wrap">
        <span class="font-semibold">🎉 A new daily puzzle is available!</span>
        <button
          id="refresh-puzzle-btn"
          class="px-4 py-2 bg-white text-primary rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Load New Puzzle
        </button>
      </div>
    `;

    document.body.prepend(banner);

    document.getElementById('refresh-puzzle-btn').addEventListener('click', () => {
      location.reload();
    });

    // Stop checking once we've shown the button
    if (this.dateCheckInterval) {
      clearInterval(this.dateCheckInterval);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new DailySudokuApp();
  app.init();
});
