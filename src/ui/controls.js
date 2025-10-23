/**
 * Game controls UI
 */

import { createButton } from './components.js';

export class GameControls {
  constructor(container, onDifficultyChange) {
    this.container = container;
    this.onDifficultyChange = onDifficultyChange;
    this.currentDifficulty = 'extreme';
  }

  /**
   * Render the controls
   */
  render() {
    this.container.innerHTML = '';

    // Difficulty selector
    const difficultyContainer = document.createElement('div');
    difficultyContainer.className = 'flex gap-2 mb-6 justify-center flex-wrap';

    const difficulties = [
      { id: 'easy', label: 'Easy', color: 'bg-green-500 hover:bg-green-600' },
      { id: 'medium', label: 'Medium', color: 'bg-yellow-500 hover:bg-yellow-600' },
      { id: 'hard', label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600' },
      { id: 'extreme', label: 'Extreme', color: 'bg-red-500 hover:bg-red-600' },
      { id: 'impossible', label: 'Impossible', color: 'bg-black hover:bg-gray-800' }
    ];

    difficulties.forEach(({ id, label, color }) => {
      const button = createButton(
        label,
        `${this.currentDifficulty === id ? color + ' text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`,
        () => this.selectDifficulty(id)
      );
      difficultyContainer.appendChild(button);
    });

    this.container.appendChild(difficultyContainer);
  }

  /**
   * Select a difficulty
   */
  selectDifficulty(difficulty) {
    this.currentDifficulty = difficulty;
    this.render();
    this.onDifficultyChange(difficulty);
  }

  /**
   * Get current difficulty
   */
  getDifficulty() {
    return this.currentDifficulty;
  }
}

export class NumberPad {
  constructor(container, onNumberSelect, onClear) {
    this.container = container;
    this.onNumberSelect = onNumberSelect;
    this.onClear = onClear;
  }

  /**
   * Render the number pad
   */
  render() {
    this.container.innerHTML = '';

    const pad = document.createElement('div');
    pad.className = 'grid grid-cols-5 gap-2 max-w-md mx-auto';

    // Number buttons 1-9
    for (let i = 1; i <= 9; i++) {
      const button = createButton(
        i.toString(),
        'bg-primary text-primary-foreground hover:bg-primary/90 text-xl h-12',
        () => this.onNumberSelect(i)
      );
      pad.appendChild(button);
    }

    // Clear button
    const clearButton = createButton(
      'Clear',
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      () => this.onClear()
    );
    pad.appendChild(clearButton);

    this.container.appendChild(pad);
  }
}

export class GameActions {
  constructor(container, onReset, onCheckSolution) {
    this.container = container;
    this.onReset = onReset;
    this.onCheckSolution = onCheckSolution;
  }

  /**
   * Render action buttons
   */
  render() {
    this.container.innerHTML = '';

    const actions = document.createElement('div');
    actions.className = 'flex gap-4 justify-center flex-wrap';

    const checkButton = createButton(
      'Check Solution',
      'bg-primary text-primary-foreground hover:bg-primary/90',
      () => this.onCheckSolution()
    );

    const resetButton = createButton(
      'Reset',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      () => this.onReset()
    );

    actions.appendChild(checkButton);
    actions.appendChild(resetButton);

    this.container.appendChild(actions);
  }
}
