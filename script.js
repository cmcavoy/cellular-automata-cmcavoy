/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

var cells = [0,0,1,0,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,0];
let w = 10;
let ruleset = [1,1,0,1,1,1,1,0].reverse();

function draw_row(row_num, cells) {
    for (var i = 0; i < cells.length; i++) {
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
    var newrow = [0]; // blank first cell
    for (var i=1; i < cells.length-1; i++) {
        var left = cells[i-1];
        var middle = cells[i];
        var right = cells[i+1];
        var newstate = rules(left, middle, right);
        newrow[i] = newstate;
    }
    newrow[newrow.length] = 0; // blank last cell
    return newrow;
}

function setup() {
    createCanvas(640, 480);
}

function draw() {
    draw_row(0, cells);
    var new_cells = cells;
    for (var i = 1; i<25; i++) {
        new_cells = add_row(new_cells);
        draw_row(i, new_cells);
    }
}