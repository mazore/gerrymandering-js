const CANVAS_WIDTH = 480;
const DISTRICT_SIZE = 16;
let HELP_PARTY;
let HINDER_PARTY;
const GRID_WIDTH = 24;
const NUM_DISTRICTS = (GRID_WIDTH ** 2) / DISTRICT_SIZE;
const SQUARE_WIDTH = CANVAS_WIDTH / GRID_WIDTH;

let canvas;

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
	background(255);
	strokeWeight(2);
	noLoop();

	HELP_PARTY = BLUE;
	HINDER_PARTY = RED;

	canvas = new Canvas();
	canvas.draw();
}
