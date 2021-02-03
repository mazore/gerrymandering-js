var canvas;
var swapManager;
var running = false;

function setup() {
	defineParameters();
	createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);

	canvas = new Canvas();
	swapManager = new SwapManager();

	canvas.draw();

	// speedTest();
	// scoreTest();
}

function draw() {
	if (running) {
		for (let i = 0; i < 500; i++) {
			swapManager.swap();
		}
		canvas.draw();
	}
}

function mousePressed() {
	if (mouseButton == LEFT) {
		running = !running;
	}
}

addEventListener('contextmenu', function(event) {
	event.preventDefault();
	swapManager.swap();
	canvas.draw();
});

function speedTest() { // Most recent about 27.18
	noLoop();
	let timeSum = 0;
	let numIters = 1000;
	for (let i = 0; i < numIters; i++) {
		canvas = new Canvas();
		swapManager = new SwapManager();

		t = millis();
		for (let i = 0; i < 1000; i++) {
			swapManager.swap();
		}
		canvas.draw();
		timeSum += millis() - t;

		if (i % 100 == 0) {
			print(`${i / 10}% done`);
		}
	}
	console.log(timeSum / numIters);
}

function scoreTest() { // Most recent about 29.085
	noLoop();
	let scoreSum = 0;
	let numIters = 1000;
	for (let i = 0; i < numIters; i++) {
		canvas = new Canvas();
		swapManager = new SwapManager();

		for (let i = 0; i < 1000; i++) {
			swapManager.swap();
		}
		scoreSum += canvas.getScore().get(BLUE);

		if (i % 100 == 0) {
			print(`${i / 10}% done`);
		}
	}
	console.log(scoreSum / numIters);
}
