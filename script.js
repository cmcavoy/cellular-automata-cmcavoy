/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

class CA {
  constructor(blockWidth) {
    this.blockWidth = blockWidth;
    this.generations = Array();
    this.cells = Array(blockWidth);
    this.ruleset = this.randomRuleset();
    this.reset();
  }

  reset() {
    this.generations = Array();
    for (var i=0; i<this.blockWidth; i++) {
      this.cells[i] = 0;
    }
    this.cells[Math.floor(this.blockWidth / 2)] = 1;
  }

  toBinary(n) {
    var b = n.toString(2).split('');
    for (var i=b.length; i<8;i++) {
      b.unshift(0)
    }
    for (var i=0; i<b.length; i++) {
      b[i] = parseInt(b[i]);
    }
    b.reverse();
    return b;
  }

  randomRuleSet() {
    return this.toBinary(Math.floor(random(255)));
  }

  rules(left, middle, right) {
    var index = left + "" + middle + "" + right;
    index = parseInt(index, 2);
    return this.ruleset[index];
  }

  addGeneration() {
    var newgen = Array(this.blockWidth);
    var previous = this.generations[this.generations.length-1];

    for (var i=0; i< newgen.length; i++) {
      newgen[i] = 0; // fill new row with zeros
    }

    // skip the first and last cells, run the rule.
    for (var i=1; i < cells.length-1; i++) {
        var left = previous[i-1];
        var middle = previous[i];
        var right = previous[i+1];
        var newstate = this.rules(left, middle, right);
        newgen[i] = newstate;
    }
    this.generations.push(newgen);
    return newgen;
  }

  get nextGeneration() {
    return this.addGeneration();
  }
}

function draw_row(row_num, cells) {
    // don't print first and last cells
    for (var i = 1; i < cells.length - 1; i++) {
        if (cells[i] == 0) { fill(255); }
        else { fill(0); }
        stroke(0);
        rect(i*w,row_num*w,w,w);
    }
}

let w = 10; // block size in pixels
let canvasWidth = window.innerWidth - 40;
let blockWidth = Math.floor(canvasWidth/w);
var ca = CA(blockWidth);

function setup() {
  createCanvas(windowWidth - 40, windowHeight);
  noLoop();
}

function draw() {
  draw_row(0, cells);
  var new_cells = cells;
  for (var i = 1; i<500; i++) {
      new_cells = ca.nextGeneration();
      draw_row(i, new_cells);
  }
}