# Daily Sudoku

A beautiful, daily Sudoku puzzle game with multiple difficulty levels, built with vanilla JavaScript and Tailwind CSS.

## Features

- 🎯 **New puzzle every day** - Deterministic daily puzzles using date-based seeding
- 🎚️ **4 Difficulty levels** - Easy, Medium, Hard, and Extreme
- ✅ **Valid puzzles** - All puzzles are verified to have unique solutions
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui design principles
- ⌨️ **Keyboard support** - Use number keys and arrow keys to play
- 💡 **Solution viewer** - Toggle solution visibility for each difficulty
- 📱 **Responsive design** - Works on desktop and mobile devices

## How It Works

Each day, a single complete Sudoku puzzle is generated using the current date as a seed. This ensures:
- Everyone gets the same puzzle on the same date worldwide
- Puzzles are consistent and reproducible
- A new puzzle appears automatically each day

The difficulty levels all use the **same solution**, but with different numbers of clues:
- **Easy**: 45 clues
- **Medium**: 35 clues
- **Hard**: 30 clues
- **Extreme**: 25 clues

All puzzles are verified to have exactly one unique solution that satisfies all Sudoku constraints.

## Development

### Prerequisites
- Node.js 18 or higher
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
daily-sudoku/
├── src/
│   ├── main.js                 # Application entry point
│   ├── sudoku/
│   │   ├── generator.js        # Puzzle generation with seeded randomness
│   │   ├── solver.js           # Backtracking solver & solution verification
│   │   └── validator.js        # Sudoku constraint validation
│   ├── ui/
│   │   ├── game.js             # Game board UI component
│   │   ├── controls.js         # Difficulty selector & action buttons
│   │   └── components.js       # Reusable UI components
│   ├── utils/
│   │   └── daily.js            # Date utilities
│   └── styles/
│       └── main.css            # Tailwind CSS & custom styles
├── index.html                  # HTML entry point
└── vite.config.js              # Build configuration
```

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Push to the `main` branch to trigger deployment

The site will be available at: `https://[username].github.io/daily-sudoku/`

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## How to Play

1. Click on an empty cell to select it
2. Use the number pad or keyboard (1-9) to fill in numbers
3. Use Delete/Backspace to clear a cell
4. Use arrow keys to navigate between cells
5. Complete the grid so each row, column, and 3×3 box contains digits 1-9
6. Toggle "Show Solution" to reveal the answer

## Algorithm Details

### Puzzle Generation
1. Generate a complete valid Sudoku board using backtracking with seeded randomness
2. Remove numbers while ensuring the puzzle maintains a unique solution
3. Verify uniqueness by counting solutions (must equal 1)

### Validation
- Checks all standard Sudoku constraints:
  - Each row contains unique digits 1-9
  - Each column contains unique digits 1-9
  - Each 3×3 box contains unique digits 1-9

## License

MIT
