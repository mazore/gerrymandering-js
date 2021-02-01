const CANVAS_WIDTH = 480; // Width and height of canvas in pixels
const DISTRICT_SIZE = 16; // Number of people per district
let HELP_PARTY = BLUE; // Party to help in the gerrymandering process
let HINDER_PARTY = RED; // Party to hinder in the gerrymandering process
const GRID_WIDTH = 24; // Width and height of grid of people
const NUM_DISTRICTS = (GRID_WIDTH ** 2) / DISTRICT_SIZE; // Number of districts
const SQUARE_WIDTH = CANVAS_WIDTH / GRID_WIDTH; // Width of a person square

if (!Number.isInteger(Math.sqrt(DISTRICT_SIZE))) {
	throw 'districts start as squares, district_size must be a perfect square';
}
if (!Number.isInteger(Math.sqrt(NUM_DISTRICTS))) {
	throw 'districts must be able to fit into the grid without remainders';
}

let canvas;

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
	background(255);
	noLoop();

	canvas = new Canvas();
	canvas.draw();
}
