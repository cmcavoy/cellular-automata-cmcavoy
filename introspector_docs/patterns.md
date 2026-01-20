# Code Patterns and Best Practices

## Design Patterns

### 1. Object-Oriented Encapsulation

**Pattern**: The CA (Cellular Automata) class encapsulates all state and behavior related to cellular automata computation.

**Implementation** (`script.js:7-92`):
```javascript
class CA {
  constructor(blockWidth, id) { /* ... */ }
  reset() { /* ... */ }
  toBinary(n) { /* ... */ }
  rules(left, middle, right) { /* ... */ }
  addGeneration() { /* ... */ }
  // ... getters
}
```

**Benefits**:
- State is private to the class
- Related functionality is grouped together
- Easy to instantiate multiple CA objects if needed
- Clear API through methods and getters

**Usage**:
```javascript
const ca = new CA(blockWidth, id);
const nextGen = ca.nextGeneration;
```

### 2. Factory Method Pattern

**Pattern**: The constructor acts as a factory, creating different rulesets based on input.

**Implementation** (`script.js:8-20`):
```javascript
constructor(blockWidth, id) {
  id = parseInt(id);
  this.blockWidth = blockWidth;
  this.generations = Array();
  if (id && id <= 255 && id >= 0) {
    this.ruleNum = id;
    this.ruleset = this.toBinary(id);
  } else {
    this.ruleset = this.randomRuleSet();
  }
  this.reset();
}
```

**Benefits**:
- Single entry point for object creation
- Handles different initialization scenarios
- Provides sensible defaults (random rule if invalid input)

### 3. Lookup Table Pattern

**Pattern**: Rules are pre-computed as a lookup table rather than evaluated conditionally.

**Implementation** (`script.js:51-55`):
```javascript
rules(left, middle, right) {
  var index = left + "" + middle + "" + right;  // "101"
  index = parseInt(index, 2);                    // 5
  return this.ruleset[index];                    // ruleset[5]
}
```

**Benefits**:
- O(1) rule lookup
- Avoids complex if/else chains
- Directly implements Wolfram's mathematical definition
- Elegant and concise

**Alternative Approach** (not used, but common):
```javascript
// Less elegant approach with conditionals
if (left === 0 && middle === 0 && right === 0) return ruleset[0];
if (left === 0 && middle === 0 && right === 1) return ruleset[1];
// ... 6 more conditions
```

### 4. Generational State Management

**Pattern**: Store all generations as an array of arrays, enabling temporal queries.

**Implementation** (`script.js:23-29, 57-75`):
```javascript
this.generations = Array();
// ...
this.generations.push(cells);  // Add new generation
// ...
generation(n) {
  return this.generations[n];
}
```

**Benefits**:
- Can access any previous generation
- Enables potential rewind/playback features
- Simple to understand and debug

**Trade-off**:
- Memory grows linearly with generations
- For 500 generations × 140 cells = ~70KB (acceptable for this use case)

### 5. Immediate Mode Rendering

**Pattern**: Using p5.js's immediate mode graphics where each frame redraws from scratch.

**Implementation** (`script.js:119-127`):
```javascript
function draw() {
  draw_row(0, ca.firstGeneration);
  for (var i = 1; i < 500; i++) {
    new_cells = ca.nextGeneration;
    draw_row(i, new_cells);
  }
  var r = document.getElementById("rule");
  r.innerText = ca.rule;
}
```

**Benefits**:
- Simple mental model
- No need to track what changed
- `noLoop()` means this only runs once

**When to Use**:
- Static visualizations
- One-time rendering
- Educational examples

## Common Patterns

### Array Initialization Pattern

**Pattern**: Create fixed-size arrays and initialize with zeros.

```javascript
var cells = Array();
for (var i = 0; i < this.blockWidth; i++) {
  cells[i] = 0;
}
```

**Modern Alternative**:
```javascript
const cells = new Array(this.blockWidth).fill(0);
```

### Binary Conversion Pattern

**Pattern**: Convert number to binary array with leading zeros.

```javascript
toBinary(n) {
  var b = n.toString(2).split('');        // "1110" → ["1","1","1","0"]
  for (var i = b.length; i < 8; i++) {
    b.unshift(0);                          // Pad to 8 bits
  }
  for (var i = 0; i < b.length; i++) {
    b[i] = parseInt(b[i]);                 // Convert to numbers
  }
  b.reverse();                             // LSB first
  return b;
}
```

**Why Reverse?**
- Index 0 represents neighborhood [0,0,0]
- Index 7 represents neighborhood [1,1,1]
- Aligns with Wolfram's numbering convention

### Neighborhood Extraction Pattern

**Pattern**: Extract left, middle, right values for sliding window.

```javascript
for (var i = 1; i < newgen.length - 1; i++) {
  var left = previous[i-1];
  var middle = previous[i];
  var right = previous[i+1];
  var newstate = this.rules(left, middle, right);
  newgen[i] = newstate;
}
```

**Edge Handling**: Skips first and last cells (keeps them as 0).

**Alternative**: Wrap edges (toroidal topology):
```javascript
var left = previous[(i-1 + length) % length];
var right = previous[(i+1) % length];
```

### p5.js Setup Pattern

**Pattern**: Use p5.js global mode with `setup()` and `draw()` functions.

```javascript
function setup() {
  createCanvas(windowWidth - 40, windowHeight);
  noLoop();  // Only draw once
}

function draw() {
  // Rendering logic
}
```

**Benefits**:
- Familiar to p5.js community
- No instance mode boilerplate
- Works well for simple projects

### Global Configuration Pattern

**Pattern**: Define configuration at module level.

```javascript
let w = 10;  // Cell size in pixels
let canvasWidth = window.innerWidth - 40;
let blockWidth = Math.floor(canvasWidth / w);
```

**Modern Alternative**:
```javascript
const CONFIG = {
  CELL_SIZE: 10,
  CANVAS_MARGIN: 40,
  MAX_GENERATIONS: 500
};
```

## Best Practices

### 1. Separation of Concerns

**Good**: Computation separated from rendering.

```javascript
// CA class handles computation
class CA {
  addGeneration() { /* Pure computation */ }
}

// Separate functions handle rendering
function draw_row(row_num, cells) { /* Rendering only */ }
```

**Why This Matters**:
- Can test CA logic without graphics
- Could swap rendering libraries without touching CA class
- Easier to understand and maintain

### 2. Defensive Input Validation

**Good**: Constructor validates rule ID.

```javascript
if (id && id <= 255 && id >= 0) {
  this.ruleNum = id;
  this.ruleset = this.toBinary(id);
} else {
  this.ruleset = this.randomRuleSet();
}
```

**Benefits**:
- Graceful handling of invalid input
- No crashes from out-of-range values
- Provides reasonable default behavior

### 3. Consistent Coordinate System

**Pattern**: Use consistent row/column indexing.

```javascript
// Row = generation number (temporal dimension)
// Column = cell position (spatial dimension)
rect(i*w, row_num*w, w, w);
```

**Benefits**:
- Time flows down (intuitive for reading)
- Space flows left-to-right
- Matches mathematical convention

### 4. Single Responsibility Methods

**Good**: Each method has one clear purpose.

```javascript
toBinary(n)           // ONLY converts to binary
randomRuleSet()       // ONLY generates random rule
rules(l, m, r)        // ONLY looks up rule result
addGeneration()       // ONLY computes next generation
```

**Benefits**:
- Easy to understand
- Easy to test
- Easy to reuse

### 5. Getters for Encapsulation

**Good**: Use getters for computed properties.

```javascript
get nextGeneration() {
  return this.addGeneration();
}

get firstGeneration() {
  return this.generation(0);
}

get rule() {
  return this.ruleNum;
}
```

**Benefits**:
- Cleaner API (use like properties)
- Can add logic without changing interface
- Future-proof for computed properties

## Anti-Patterns to Avoid

### 1. Using `var` Instead of `let`/`const`

**Current**:
```javascript
var cells = Array();
var i = 0;
```

**Better**:
```javascript
const cells = [];
let i = 0;
```

**Why**: `var` has function scope and hoisting issues. Modern `let`/`const` have block scope and better semantics.

### 2. Magic Numbers

**Current**:
```javascript
for (var i = 1; i < 500; i++) {  // What is 500?
  // ...
}
```

**Better**:
```javascript
const MAX_GENERATIONS = 500;
for (let i = 1; i < MAX_GENERATIONS; i++) {
  // ...
}
```

### 3. Implicit Type Coercion

**Current**:
```javascript
var index = left + "" + middle + "" + right;  // String concatenation
```

**Better**:
```javascript
const index = (left << 2) | (middle << 1) | right;  // Bitwise
// OR
const index = parseInt(`${left}${middle}${right}`, 2);
```

### 4. Array Constructor Without `new`

**Current**:
```javascript
var cells = Array();
```

**Better**:
```javascript
const cells = [];
// OR
const cells = new Array(size);
```

## Domain-Specific Patterns

### Elementary Cellular Automata Implementation

**Key Insight**: Wolfram's elementary CA numbering is elegant.

Rule 30 in binary: `00011110`
- Index 0 (000): 0
- Index 1 (001): 1
- Index 2 (010): 1
- Index 3 (011): 1
- Index 4 (100): 1
- Index 5 (101): 0
- Index 6 (110): 0
- Index 7 (111): 0

**Implementation**:
```javascript
// Rule number → Binary array
ruleset = [0, 1, 1, 1, 1, 0, 0, 0];

// Neighborhood → Rule index → New state
rules(1, 0, 1) → index 5 → ruleset[5] = 0
```

**Why This Works**:
- Each rule is uniquely identified by an 8-bit number
- Lookup is O(1)
- Directly implements mathematical definition

### Initial Condition Pattern

**Single Center Cell**:
```javascript
cells[Math.floor(this.blockWidth / 2)] = 1;
```

**Why**: Standard initial condition for studying CA behavior.

**Alternatives**:
- Random: `cells[i] = Math.random() > 0.5 ? 1 : 0`
- Multiple seeds: Set multiple cells to 1
- Symmetric: Mirror pattern around center

### Edge Handling Pattern

**Current**: Ignore edges (leave as 0).

```javascript
for (var i = 1; i < newgen.length - 1; i++) {
  // Skip i=0 and i=newgen.length-1
}
```

**Alternative 1**: Wrap edges (toroidal).
```javascript
var left = previous[(i-1 + length) % length];
var right = previous[(i+1) % length];
```

**Alternative 2**: Reflect edges.
```javascript
var left = i === 0 ? previous[1] : previous[i-1];
var right = i === length-1 ? previous[length-2] : previous[i+1];
```

## Performance Considerations

### Current Performance Characteristics

**Time Complexity**:
- Initialization: O(n) where n = blockWidth
- Each generation: O(n)
- Total: O(n × g) where g = 500 generations
- For typical case: ~140 cells × 500 gens = 70,000 operations (fast)

**Space Complexity**:
- O(n × g) to store all generations
- For typical case: ~70KB (acceptable)

**Rendering**:
- Drawing 500 × 140 rectangles ≈ 70,000 rect() calls
- Happens once due to `noLoop()`
- Completes in < 100ms on modern hardware

### Optimization Opportunities

**If Performance Becomes an Issue**:

1. **Stream generations instead of storing**:
```javascript
// Don't keep all generations in memory
// Just keep current and previous
```

2. **Use typed arrays**:
```javascript
const cells = new Uint8Array(blockWidth);
```

3. **Draw to image buffer instead of individual rects**:
```javascript
loadPixels();
// Manipulate pixels[] array directly
updatePixels();
```

4. **Use Web Workers for computation**:
```javascript
const worker = new Worker('ca-worker.js');
```

## Testing Patterns

### Manual Testing Strategy

**Test Famous Rules**:
- Rule 30: Should show chaotic pattern
- Rule 90: Should show Sierpinski triangle
- Rule 110: Complex, neither chaotic nor ordered
- Rule 184: Shows traffic flow pattern

**Visual Regression**:
- Compare output for known rules against reference images
- Verify symmetry where expected (e.g., Rule 90)

### Potential Unit Testing Patterns

**Test Binary Conversion**:
```javascript
expect(ca.toBinary(30)).toEqual([0,1,1,1,1,0,0,0]);
expect(ca.toBinary(0)).toEqual([0,0,0,0,0,0,0,0]);
expect(ca.toBinary(255)).toEqual([1,1,1,1,1,1,1,1]);
```

**Test Rule Application**:
```javascript
const ca = new CA(100, 30);
expect(ca.rules(0,0,0)).toBe(0);
expect(ca.rules(0,0,1)).toBe(1);
expect(ca.rules(1,1,1)).toBe(0);
```

**Test Generation Count**:
```javascript
const ca = new CA(100, 30);
ca.nextGeneration;
ca.nextGeneration;
expect(ca.generations.length).toBe(3); // Initial + 2
```

## Lessons for New Implementations

If you're implementing cellular automata or similar systems:

1. **Lookup tables are elegant** for rule-based systems
2. **Array-based state** works well for grid-based systems
3. **Separate computation from rendering** for flexibility
4. **Use getters** to create clean APIs
5. **Validate input** and provide sensible defaults
6. **Choose initial conditions carefully** (single cell reveals structure)
7. **Consider edge cases** (literal edges of the grid)
8. **Document with examples** (Rule 30, 90, 110 are well-known)
9. **Keep it simple** - this code is easy to understand because it's not over-engineered
