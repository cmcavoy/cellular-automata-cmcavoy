# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive web-based cellular automata visualizer that demonstrates elementary cellular automata rules. The project creates visual patterns based on simple mathematical rules, inspired by Stephen Wolfram's work on cellular automata. It's built as an educational tool to help people understand how simple rules can create complex patterns.

## Technology Stack

- **Frontend Framework**: p5.js (v0.10.2) - JavaScript library for creative coding
- **UI Library**: NES.css (v2.1.0) - NES-style CSS framework for retro styling
- **Languages**: Vanilla JavaScript (ES6 classes), HTML5, CSS3
- **Hosting**: Originally designed for Glitch.com
- **No Build Tools**: Static files served directly (no bundler, transpiler, or package manager)

## Development Commands

This is a static web project with no build process. Simply open the files in a browser.

```bash
# Serve locally (using any static server)
python3 -m http.server 8000
# OR
npx serve

# Then open http://localhost:8000
```

## Architecture

This is a single-page application with client-side rendering only. The architecture follows a simple pattern:

1. **HTML Entry Point** (`index.html`) - Loads dependencies and provides minimal structure
2. **JavaScript Logic** (`script.js`) - Contains the CA class and p5.js drawing functions
3. **CSS Styling** (`style.css`) - Minimal custom styling (NES.css provides most styling)

The application uses p5.js for canvas-based rendering. The cellular automata computation is handled by a custom `CA` class that implements elementary cellular automata rules.

### Key Components

**CA Class** (`script.js:7-92`)
- Manages cellular automata state and rule execution
- Supports 256 different rulesets (0-255) following Wolfram's numbering
- Can accept a rule number via URL parameter (`?id=110`) or generate random rules
- Core methods:
  - `rules(left, middle, right)` - Applies the ruleset to three cells
  - `addGeneration()` - Computes the next generation based on the current state
  - `toBinary(n)` - Converts rule number to binary representation

**Drawing Functions** (`script.js:94-127`)
- `draw_row(row_num, cells)` - Renders a single generation as a row of squares
- `setup()` - p5.js initialization function
- `draw()` - p5.js main drawing loop (runs once due to `noLoop()`)

**URL Parameter Handling** (`script.js:110-112`)
- Reads `?id=` parameter to set specific cellular automata rules
- Falls back to random rule generation if no valid ID provided

## Key Files

- `index.html` - HTML structure, loads p5.js and NES.css CDN dependencies
- `script.js` - Complete application logic including CA class and visualization
- `style.css` - Custom font (Kong) and minimal styling
- `README.md` - Basic project description with Glitch link
- `.glitch-assets` - Glitch CDN asset manifest (font file reference)

## Code Quality Standards

**Patterns Observed:**
- ES6 class syntax for OOP structure
- Array-based state management (generations stored as arrays of arrays)
- Functional approach to rule application
- Separation of concerns: CA logic vs. rendering logic

**Conventions:**
- Uses `var` instead of `let`/`const` (older JavaScript style)
- camelCase naming for functions and variables
- Grid-based rendering with configurable block width
- Rule numbers follow Wolfram's elementary cellular automata numbering (0-255)

**Mathematical Foundation:**
- Implements elementary cellular automata (1D, 2-state, 3-neighbor rules)
- Each rule is represented as an 8-bit binary number
- The three-cell neighborhood determines the next state via lookup table

**Known Limitations:**
- Edge cells are not computed (remain 0)
- Fixed to 500 generations
- Canvas size is responsive but generation count is not
- No interactive controls (must use URL parameters to change rules)

## Development Tips

When modifying this code:
- The rule number system follows Wolfram notation (Rule 30, Rule 110, etc.)
- The canvas width determines how many cells can be displayed horizontally
- Each generation is a new row, older generations appear at the top
- The initial state is a single "1" cell in the center
- Black cells represent state "1", white cells represent state "0"
