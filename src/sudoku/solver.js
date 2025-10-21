/**
 * Sudoku solver using backtracking algorithm
 */

import { isValid } from './validator.js';

/**
 * Find empty cell in the board
 */
function findEmpty(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

/**
 * Solve the Sudoku board using backtracking
 */
export function solve(board) {
  const emptyCell = findEmpty(board);

  if (!emptyCell) {
    return true; // Board is complete
  }

  const [row, col] = emptyCell;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      if (solve(board)) {
        return true;
      }

      board[row][col] = 0; // Backtrack
    }
  }

  return false;
}

/**
 * Count the number of solutions for a board
 * Used to verify uniqueness
 */
export function countSolutions(board, limit = 2) {
  let count = 0;

  function backtrack() {
    if (count >= limit) return; // Early exit if we found multiple solutions

    const emptyCell = findEmpty(board);

    if (!emptyCell) {
      count++;
      return;
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        backtrack();
        board[row][col] = 0; // Backtrack
      }
    }
  }

  backtrack();
  return count;
}

/**
 * Check if the puzzle has a unique solution
 */
export function hasUniqueSolution(board) {
  const boardCopy = board.map(row => [...row]);
  return countSolutions(boardCopy, 2) === 1;
}

/**
 * Get the solution for a puzzle
 */
export function getSolution(board) {
  const solutionBoard = board.map(row => [...row]);
  solve(solutionBoard);
  return solutionBoard;
}
