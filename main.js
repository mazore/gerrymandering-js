function setup() {
	defineParameters();

	createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
	// noLoop();

	canvas = new Canvas();
	swapManager = new SwapManager();

	canvas.draw();
}

function draw() {
	swapManager.swap();
	canvas.draw();
}

function mousePressed() {
	swapManager.swap();
	canvas.draw();
}
