# Architecture

## System Overview

This is a client-side static web application with no backend, database, or build process. The architecture follows a straightforward pattern:

```
Browser → HTML → p5.js + CA Class → Canvas Rendering
```

The entire application runs in the browser using vanilla JavaScript with the p5.js library for graphics rendering. The core computation logic is encapsulated in a single `CA` (Cellular Automata) class, while p5.js handles the drawing loop and canvas management.

**Architecture Style**: Single-Page Application (SPA) with functional and object-oriented JavaScript

**Rendering Strategy**: Immediate mode graphics using p5.js canvas API

**State Management**: Array-based generational storage within the CA class

## Components

### 1. CA (Cellular Automata) Class

**Location**: `script.js:7-92`

**Responsibilities**:
- Maintains the state of all cell generations
- Converts rule numbers to binary rulesets
- Applies cellular automata rules to compute next generations
- Provides accessors for generation data

**Key Properties**:
- `blockWidth`: Number of cells in each generation (based on canvas width)
- `generations`: Array of arrays storing all computed generations
- `ruleset`: 8-element binary array representing the CA rule
- `ruleNum`: Integer (0-255) identifying the rule

**Key Methods**:
- `constructor(blockWidth, id)`: Initializes CA with given width and optional rule ID
- `reset()`: Clears generations and sets initial state (single center cell)
- `toBinary(n)`: Converts rule number to 8-bit binary array
- `randomRuleSet()`: Generates random rule and returns its binary representation
- `rules(left, middle, right)`: Looks up next state for 3-cell neighborhood
- `addGeneration()`: Computes next generation from previous generation
- `generation(n)`: Returns the nth generation

### 2. p5.js Drawing Functions

**Location**: `script.js:94-127`

**Responsibilities**:
- Creates and manages HTML5 canvas
- Renders cellular automata state as visual grid
- Handles window sizing and responsiveness

**Key Functions**:
- `setup()`: p5.js lifecycle hook - creates canvas and disables animation loop
- `draw()`: p5.js lifecycle hook - renders all 500 generations once
- `draw_row(row_num, cells)`: Renders a single generation as a row of colored squares

**Rendering Logic**:
- Each cell is rendered as a square (`w x w` pixels)
- Black fill (0) = alive cell (state 1)
- White fill (255) = dead cell (state 0)
- Strokes (borders) drawn between cells

### 3. URL Parameter Handler

**Location**: `script.js:110-112`

**Responsibilities**:
- Parses URL query parameters
- Extracts rule ID from `?id=` parameter
- Passes rule ID to CA constructor

**Flow**:
```javascript
URL → URLSearchParams → CA constructor → ruleset initialization
```

### 4. HTML Structure

**Location**: `index.html`

**Responsibilities**:
- Loads external dependencies (p5.js, NES.css)
- Provides minimal page structure (title, description)
- Includes Glitch remix button
- Loads application JavaScript

**Dependencies**:
- p5.js v0.10.2 (from jsDelivr CDN)
- NES.css v2.1.0 (from unpkg CDN)
- Glitch button widget

### 5. Style Layer

**Location**: `style.css`

**Responsibilities**:
- Loads custom "Kong" font for retro appearance
- Sets basic typography and colors
- Works alongside NES.css for complete styling

## Data Flow

### Initialization Flow

1. **Page Load**: Browser loads `index.html`
2. **Dependencies**: p5.js and NES.css load from CDNs
3. **Script Load**: `script.js` loads and executes
4. **URL Parsing**: Extract `?id=` parameter
5. **CA Instantiation**: Create CA object with rule ID or random rule
6. **Canvas Setup**: p5.js calls `setup()` function
7. **Rendering**: p5.js calls `draw()` function once

### Generation Computation Flow

```
Initial State (single center cell)
    ↓
For each generation (1-500):
    ↓
    Read previous generation
    ↓
    For each cell (except edges):
        ↓
        Get left, middle, right neighbors
        ↓
        Apply rule lookup
        ↓
        Set new cell state
    ↓
    Add generation to storage
    ↓
    Render generation as row
```

### Rule Application Flow

```
3-cell neighborhood: [left, middle, right]
    ↓
Concatenate as binary string: "101"
    ↓
Convert to decimal index: 5
    ↓
Lookup in ruleset array: ruleset[5]
    ↓
Return next state: 0 or 1
```

**Example** (Rule 30):
- Binary representation: [0,1,1,1,1,0,0,0]
- Neighborhood [1,0,1] → index 5 → ruleset[5] = 1
- Neighborhood [0,0,0] → index 0 → ruleset[0] = 0

## External Dependencies

### Runtime Dependencies

1. **p5.js (v0.10.2)**
   - Purpose: Graphics rendering and canvas management
   - Source: https://cdn.jsdelivr.net/npm/p5@0.10.2/lib/p5.js
   - Why: Simplifies canvas drawing with creative coding API

2. **NES.css (v2.1.0)**
   - Purpose: Retro NES-style CSS framework
   - Source: https://unpkg.com/nes.css@2.1.0/css/nes.min.css
   - Why: Provides nostalgic 8-bit aesthetic

3. **Glitch Button Widget**
   - Purpose: Adds "Remix on Glitch" button
   - Source: https://button.glitch.me/button.js
   - Why: Encourages remixing and learning

4. **Kong Font**
   - Purpose: Pixelated retro font
   - Source: https://cdn.glitch.com/.../kongtext.ttf
   - Why: Enhances retro gaming aesthetic

### Development Dependencies

None - this is a zero-build project that runs directly in the browser.

## Scalability Considerations

**Current Limitations**:
- Fixed to 500 generations (hardcoded in `draw()`)
- No persistence - state lost on page reload
- Single-threaded computation (no Web Workers)
- Memory grows linearly with generations (all stored in array)

**Potential Improvements**:
- Stream generations instead of storing all in memory
- Use Web Workers for computation
- Add interactive controls for generation count
- Implement viewport scrolling for larger patterns
- Add pattern export (PNG, JSON, etc.)

## Browser Compatibility

**Supported**: All modern browsers with HTML5 Canvas and ES6 support
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+

**Not Supported**: Internet Explorer (lacks ES6 class support)
