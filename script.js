/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

let w = 10;

class CA {
  function constructor(blockWidth) {
    for (var i=0; i<cells.length; i++) {
      cells[i] = 0;
    }
  }

  
}

function to_binary(n) {
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

var ruleset = to_binary(50);
var cells;

function draw_row(row_num, cells) {
    // don't print first and last cells
    for (var i = 1; i < cells.length - 1; i++) {
        if (cells[i] == 0) { fill(255); }
        else { fill(0); }
        stroke(0);
        rect(i*w,row_num*w,w,w);
    }
}

function rules(left, middle, right) {
    var index = left + "" + middle + "" + right;
    index = parseInt(index, 2);
    return ruleset[index];
}

function add_row(cells) {
    var newrow = Array(cells.length);
    for (var i=0; i< newrow.length; i++) {
      newrow[i] = 0; // fill new row with zeros
    }
    // skip the first and last cells, run the rule.
    for (var i=1; i < cells.length-1; i++) {
        var left = cells[i-1];
        var middle = cells[i];
        var right = cells[i+1];
        var newstate = rules(left, middle, right);
        newrow[i] = newstate;
    }
    return newrow;
}

function setup() {
  createCanvas(windowWidth - 40, windowHeight);
  var blockWidth = Math.floor(windowWidth/w);
  ca = CA(blockwidth);
  cells = Array(blockWidth);

  cells[Math.floor(blockWidth / 2)] = 1;
  noLoop();
}

function draw() {
    draw_row(0, cells);
    var new_cells = cells;
    for (var i = 1; i<500; i++) {
        new_cells = add_row(new_cells);
        draw_row(i, new_cells);
    }
}