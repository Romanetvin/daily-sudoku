/**
 * Validates Sudoku constraints
 */

/**
 * Check if a number can be placed at position (row, col)
 */
export function isValid(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if the entire board is valid
 */
export function isBoardValid(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== 0) {
        const num = board[i][j];
        board[i][j] = 0; // Temporarily remove to check validity
        if (!isValid(board, i, j, num)) {
          board[i][j] = num; // Restore
          return false;
        }
        board[i][j] = num; // Restore
      }
    }
  }
  return true;
}

/**
 * Check if the board is completely filled
 */
export function isComplete(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
}
