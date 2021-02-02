function setup() {
	defineParameters();

	createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
	// noLoop();

	canvas = new Canvas();
	swapManager = new SwapManager();

	canvas.draw();
}

let time;
function draw() {
	for (let i = 0; i < 50; i++) {
		swapManager.swap();
	}
	canvas.draw();
}

function mousePressed() {
	swapManager.swap();
	canvas.draw();
}
