/**
 * Sudoku game UI components
 */

import { isValid } from '../sudoku/validator.js';

export class SudokuGame {
  constructor(container) {
    this.container = container;
    this.board = null;
    this.solution = null;
    this.initialBoard = null;
    this.selectedCell = null;
    this.showingSolution = false;
    this.cells = [];
  }

  /**
   * Initialize the game with a puzzle
   */
  init(puzzle, solution) {
    this.board = puzzle.map(row => [...row]);
    this.solution = solution.map(row => [...row]);
    this.initialBoard = puzzle.map(row => [...row]);
    this.showingSolution = false;
    this.render();
  }

  /**
   * Render the Sudoku grid
   */
  render() {
    this.container.innerHTML = '';
    this.cells = [];

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-3 gap-1 bg-border p-1 rounded-lg w-fit';

    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const box = document.createElement('div');
        box.className = 'grid grid-cols-3 gap-0 bg-background';

        for (let cellRow = 0; cellRow < 3; cellRow++) {
          for (let cellCol = 0; cellCol < 3; cellCol++) {
            const row = boxRow * 3 + cellRow;
            const col = boxCol * 3 + cellCol;
            const cell = this.createCell(row, col);
            box.appendChild(cell);
            this.cells.push({ element: cell, row, col });
          }
        }

        grid.appendChild(box);
      }
    }

    this.container.appendChild(grid);
  }

  /**
   * Create a single cell
   */
  createCell(row, col) {
    const cell = document.createElement('div');
    const value = this.showingSolution ? this.solution[row][col] : this.board[row][col];
    const isInitial = this.initialBoard[row][col] !== 0;
    const isSelected = this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col;

    cell.className = `
      w-12 h-12 flex items-center justify-center text-lg font-semibold
      cursor-pointer transition-all border border-border
      ${isInitial ? 'bg-muted text-foreground font-bold' : 'bg-background text-primary hover:bg-accent'}
      ${isSelected ? 'relative z-10 !border-2 !border-primary shadow-lg' : ''}
    `;

    if (value !== 0) {
      cell.textContent = value;
    }

    if (!this.showingSolution) {
      cell.addEventListener('click', () => this.selectCell(row, col));
    }

    return cell;
  }

  /**
   * Select a cell
   */
  selectCell(row, col) {
    if (this.initialBoard[row][col] !== 0 || this.showingSolution) {
      return; // Can't select initial cells or when showing solution
    }

    this.selectedCell = { row, col };
    this.render();
  }

  /**
   * Set value in selected cell
   */
  setValue(num) {
    if (!this.selectedCell || this.showingSolution) return;

    const { row, col } = this.selectedCell;
    if (this.initialBoard[row][col] !== 0) return; // Can't modify initial cells

    this.board[row][col] = num;
    this.render();
    this.checkCompletion();
  }

  /**
   * Clear selected cell
   */
  clearCell() {
    if (!this.selectedCell || this.showingSolution) return;

    const { row, col } = this.selectedCell;
    if (this.initialBoard[row][col] !== 0) return;

    this.board[row][col] = 0;
    this.render();
  }

  /**
   * Toggle solution display
   */
  toggleSolution() {
    this.showingSolution = !this.showingSolution;
    this.selectedCell = null;
    this.render();
    return this.showingSolution;
  }

  /**
   * Check if puzzle is completed correctly
   */
  checkCompletion() {
    // Check if all cells are filled
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === 0) return false;
      }
    }

    // Check if matches solution
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] !== this.solution[i][j]) {
          return false;
        }
      }
    }

    // Puzzle completed!
    this.onComplete();
    return true;
  }

  /**
   * Called when puzzle is completed
   */
  onComplete() {
    setTimeout(() => {
      alert('🎉 Congratulations! You solved the puzzle!');
    }, 100);
  }

  /**
   * Reset the board
   */
  reset() {
    this.board = this.initialBoard.map(row => [...row]);
    this.selectedCell = null;
    this.showingSolution = false;
    this.render();
  }

  /**
   * Check if current board state is valid
   */
  isCurrentStateValid() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] !== 0) {
          const num = this.board[i][j];
          this.board[i][j] = 0;
          if (!isValid(this.board, i, j, num)) {
            this.board[i][j] = num;
            return false;
          }
          this.board[i][j] = num;
        }
      }
    }
    return true;
  }
}
