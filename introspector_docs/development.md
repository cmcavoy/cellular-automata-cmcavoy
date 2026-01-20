# Development Guide

## Prerequisites

### Required Software

**Web Browser** (any modern browser)
- Chrome 51+ (recommended for DevTools)
- Firefox 54+
- Safari 10+
- Edge 15+

**Text Editor** (any will work)
- VS Code (recommended)
- Sublime Text
- Atom
- Notepad++
- Even basic Notepad works

**Optional: Local Web Server**
For local development, you need a simple static file server. Choose one:

- **Python 3**: `python3 -m http.server 8000`
- **Node.js**: `npx serve` or `npx http-server`
- **PHP**: `php -S localhost:8000`
- **VS Code Extension**: "Live Server" extension

### Knowledge Prerequisites

**Minimum**:
- Basic HTML understanding
- Basic JavaScript syntax
- Familiarity with browser DevTools

**Helpful but Optional**:
- ES6 classes and arrow functions
- Canvas API basics
- Understanding of cellular automata concepts

### No Installation Required

This project has:
- **No package.json** - No npm dependencies to install
- **No build process** - No webpack, babel, or bundlers
- **No compilation** - Edit and refresh to see changes
- **No frameworks** - Just vanilla JavaScript with p5.js from CDN

## Setup

### Method 1: Using Glitch (Recommended for Beginners)

1. **Visit the Live Demo**
   ```
   https://cellular-automata-cmcavoy.glitch.me/
   ```

2. **Click "Remix on Glitch" button** (fish icon in top-right)

3. **Start Editing**
   - Edit `script.js` to modify CA logic
   - Edit `index.html` to change page structure
   - Edit `style.css` to adjust styling
   - Changes appear live instantly

4. **Share Your Remix**
   - Your remix gets a unique URL: `https://your-project-name.glitch.me/`

### Method 2: Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/cmcavoy/cellular-automata-cmcavoy.git
   cd cellular-automata-cmcavoy
   ```

2. **Start a Local Server**

   Using Python:
   ```bash
   python3 -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx serve
   ```

   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

4. **Make Changes**
   - Edit files in your text editor
   - Refresh browser to see changes
   - Use DevTools console to debug

### Method 3: Direct File Opening (Limited)

1. **Download the Files**
   - Download `index.html`, `script.js`, `style.css`

2. **Open Directly**
   - Double-click `index.html` to open in browser
   - **Note**: Some browsers may block CDN resources when opened via `file://` protocol
   - Use a local server method if this doesn't work

## Development Workflow

### Typical Development Cycle

1. **Edit Code** in your text editor
2. **Save File** (Ctrl+S / Cmd+S)
3. **Refresh Browser** (F5 / Cmd+R)
4. **Check Console** for errors (F12 → Console)
5. **Observe Visual Output** on canvas
6. **Iterate**

### Using Browser DevTools

**Open DevTools**: F12 (Windows/Linux) or Cmd+Option+I (Mac)

**Console Tab**:
- View `console.log()` output
- See JavaScript errors
- Test code snippets interactively
- Example: Type `ca.rule` to see current rule number

**Sources/Debugger Tab**:
- Set breakpoints in `script.js`
- Step through code execution
- Inspect variables during runtime

**Network Tab**:
- Verify CDN resources load correctly
- Check for 404 errors

### Quick Iteration Tips

**Fast Feedback Loop**:
```javascript
// Add console.log to see what's happening
console.log("Rule:", this.ruleNum);
console.log("Ruleset:", this.ruleset);
console.log("Generation 0:", this.firstGeneration);
```

**Reduce Generation Count** for faster testing:
```javascript
// In draw() function, change 500 to 50
for (var i = 1; i < 50; i++) {  // Was: i < 500
    new_cells = ca.nextGeneration;
    draw_row(i, new_cells);
}
```

**Increase Cell Size** for easier visualization:
```javascript
// Change w from 10 to 20
let w = 20;  // Was: let w = 10;
```

## Testing

### Manual Testing

**Test Different Rules**:
```bash
# Test famous rules
http://localhost:8000/?id=30   # Chaotic
http://localhost:8000/?id=90   # Sierpinski triangle
http://localhost:8000/?id=110  # Turing complete
http://localhost:8000/?id=184  # Traffic flow
```

**Test Edge Cases**:
```bash
http://localhost:8000/?id=0    # All cells die
http://localhost:8000/?id=255  # All cells live
http://localhost:8000/?id=-1   # Invalid (should use random)
http://localhost:8000/?id=999  # Out of range (should use random)
http://localhost:8000/         # No parameter (random rule)
```

**Visual Verification**:
- Rule number displays in page title
- Pattern appears correctly
- No JavaScript errors in console
- Canvas resizes with window

### Automated Testing (Currently None)

This project has no automated tests. To add testing:

**Option 1: Jest for Unit Tests**
```javascript
// Example test (not currently implemented)
test('toBinary converts 30 to binary array', () => {
  const ca = new CA(100, 30);
  expect(ca.ruleset).toEqual([0,1,1,1,1,0,0,0]);
});
```

**Option 2: Cypress for E2E Tests**
```javascript
// Example test (not currently implemented)
cy.visit('http://localhost:8000/?id=110');
cy.get('#rule').should('contain', '110');
```

### Debugging Common Issues

**Problem: Canvas is blank**
- Check browser console for errors
- Verify p5.js loaded (check Network tab)
- Check that `draw()` function executed

**Problem: Rule displays as "undefined"**
- Check URL parameter parsing
- Verify `ca.rule` getter returns correctly
- Check that rule number is set in constructor

**Problem: Pattern looks wrong**
- Verify rule number matches intended pattern
- Check that `rules()` function indexes correctly
- Ensure binary conversion works properly

**Problem: CDN resources don't load**
- Check internet connection
- Verify CDN URLs are correct
- Check browser console for CORS errors
- Try using local server instead of file:// protocol

## Common Tasks

### Add a New Feature: Export Pattern as Image

```javascript
// Add to end of draw() function
function draw() {
  // ... existing code ...

  // Add save button
  let button = createButton('Save Image');
  button.position(20, height + 40);
  button.mousePressed(() => {
    saveCanvas('ca-pattern', 'png');
  });
}
```

### Change Initial Condition

```javascript
// In CA.reset() method, modify initialization
reset() {
  var cells = Array();
  this.generations = Array();
  for (var i=0; i<this.blockWidth; i++) {
    cells[i] = 0;
  }

  // Instead of single center cell:
  // cells[Math.floor(this.blockWidth / 2)] = 1;

  // Try random initialization:
  for (var i=0; i<this.blockWidth; i++) {
    cells[i] = Math.random() > 0.5 ? 1 : 0;
  }

  this.generations.push(cells);
}
```

### Add Color Gradient

```javascript
// In draw_row() function
function draw_row(row_num, cells) {
  for (var i = 1; i < cells.length - 1; i++) {
    if (cells[i] == 0) {
      fill(255);
    } else {
      // Color based on row number for gradient effect
      fill(row_num % 255, 100, 200);
    }
    stroke(0);
    rect(i*w, row_num*w, w, w);
  }
}
```

### Add Interactive Controls

```javascript
// Add at top of script.js
let ruleSlider;

function setup() {
  createCanvas(windowWidth - 40, windowHeight - 100);

  // Create slider
  ruleSlider = createSlider(0, 255, ca.rule, 1);
  ruleSlider.position(20, height + 20);
  ruleSlider.input(() => {
    ca = new CA(blockWidth, ruleSlider.value());
    redraw();
  });

  // Enable redrawing
  // Remove noLoop() to allow animation
}
```

### Implement Wrapping Edges

```javascript
// In addGeneration() method, handle edges:
for (var i=0; i < newgen.length; i++) {
  var left = previous[(i-1 + newgen.length) % newgen.length];
  var middle = previous[i];
  var right = previous[(i+1) % newgen.length];
  var newstate = this.rules(left, middle, right);
  newgen[i] = newstate;
}
// Remove the edge-skipping logic
```

## Code Style Guide

### Existing Conventions

**Variable Declarations**:
- Uses `var` (legacy style, not `let`/`const`)
- Consider modernizing to ES6 `let`/`const`

**Naming**:
- camelCase for functions and variables
- PascalCase for classes (CA)
- Lowercase for p5.js lifecycle functions

**Indentation**:
- 2 spaces (no tabs)

**Comments**:
- Minimal inline comments
- Code is mostly self-documenting

### Recommended Improvements

**Modernize Variable Declarations**:
```javascript
// Instead of: var cells = Array();
const cells = [];
```

**Add JSDoc Comments**:
```javascript
/**
 * Computes the next generation of cells based on CA rules
 * @returns {Array<number>} Array of cell states (0 or 1)
 */
addGeneration() {
  // ...
}
```

**Use Const for Constants**:
```javascript
// Instead of: let w = 10;
const CELL_SIZE = 10;
const MAX_GENERATIONS = 500;
```

## Contributing

### How to Contribute

1. Fork the repository on GitHub
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Test thoroughly in multiple browsers
5. Commit with descriptive message
6. Push to your fork
7. Open a Pull Request

### Pull Request Guidelines

- Keep changes focused and atomic
- Maintain backward compatibility
- Test in at least 2 different browsers
- Update documentation if needed
- Follow existing code style

### Ideas for Contributions

- Add 2D cellular automata (Conway's Game of Life)
- Implement more initial conditions
- Add pattern export (PNG, GIF, JSON)
- Create preset rule gallery
- Add rule description tooltips
- Implement zoom/pan controls
- Add accessibility features (keyboard controls)
- Create educational annotations
