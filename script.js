/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

var cells = [1,0,1,0,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,0];
let w = 10;

function draw_row(row_num, cells) {
    for (var i = 0; i < cells.length; i++) {
        console.log(i);
        if (cells[i] == 0) { fill(255); }
        else { fill(0); }
        stroke(0);
        rect(i*w,row_num*w,w,w);
        console.log(i*50);
    }
}

function add_row() {
    for 
}

function setup() {
    createCanvas(640, 480);
}

function draw() {
    draw_row(0, cells);
}