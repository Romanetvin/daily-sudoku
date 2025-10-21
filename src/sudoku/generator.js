/**
 * Sudoku generator with seeded random for daily puzzles
 */

import { isValid } from './validator.js';
import { solve, hasUniqueSolution } from './solver.js';

/**
 * Seeded random number generator (Mulberry32)
 */
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  next() {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/**
 * Shuffle array using seeded random
 */
function shuffle(array, random) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random.next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Create an empty 9x9 board
 */
function createEmptyBoard() {
  return Array(9).fill(null).map(() => Array(9).fill(0));
}

/**
 * Fill the board with a valid complete Sudoku solution
 */
function fillBoard(board, random) {
  const emptyCell = findEmptyCell(board);

  if (!emptyCell) {
    return true; // Board is complete
  }

  const [row, col] = emptyCell;
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], random);

  for (const num of numbers) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      if (fillBoard(board, random)) {
        return true;
      }

      board[row][col] = 0; // Backtrack
    }
  }

  return false;
}

/**
 * Find empty cell in the board
 */
function findEmptyCell(board) {
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
 * Generate a complete valid Sudoku board
 */
export function generateCompleteBoard(seed) {
  const random = new SeededRandom(seed);
  const board = createEmptyBoard();
  fillBoard(board, random);
  return board;
}

/**
 * Remove numbers from board to create a puzzle
 * Ensures the puzzle has a unique solution
 */
export function createPuzzle(completeBoard, cluesCount, seed) {
  const random = new SeededRandom(seed + 1000); // Different seed for removal
  const board = completeBoard.map(row => [...row]);

  const totalCells = 81;
  const cellsToRemove = totalCells - cluesCount;

  // Create list of all cell positions
  const positions = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  const shuffledPositions = shuffle(positions, random);

  let removed = 0;
  for (const [row, col] of shuffledPositions) {
    if (removed >= cellsToRemove) break;

    const backup = board[row][col];
    board[row][col] = 0;

    // Check if puzzle still has unique solution
    const testBoard = board.map(r => [...r]);
    if (hasUniqueSolution(testBoard)) {
      removed++;
    } else {
      board[row][col] = backup; // Restore if not unique
    }
  }

  return board;
}

/**
 * Get difficulty configurations
 */
export const DIFFICULTY_CONFIGS = {
  easy: { clues: 45, name: 'Easy' },
  medium: { clues: 35, name: 'Medium' },
  hard: { clues: 30, name: 'Hard' },
  extreme: { clues: 25, name: 'Extreme' },
  impossible: { clues: 20, name: 'Impossible' }
};

/**
 * Generate daily puzzles for all difficulty levels
 * Each difficulty has completely independent solution and clues
 */
export function generateDailyPuzzles(dateString) {
  // Convert date string to seed number
  const baseSeed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const puzzles = {};
  const difficultySeeds = {
    easy: baseSeed + 100,
    medium: baseSeed + 200,
    hard: baseSeed + 300,
    extreme: baseSeed + 400,
    impossible: baseSeed + 500
  };

  // Generate completely independent puzzle for each difficulty
  for (const [difficulty, config] of Object.entries(DIFFICULTY_CONFIGS)) {
    const seed = difficultySeeds[difficulty];
    const completeBoard = generateCompleteBoard(seed);
    const puzzle = createPuzzle(completeBoard, config.clues, seed);

    puzzles[difficulty] = {
      puzzle: puzzle,
      solution: completeBoard,
      clues: config.clues,
      name: config.name
    };
  }

  return puzzles;
}
