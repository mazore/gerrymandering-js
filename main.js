/*
TODO:
- add pie charts
- speed up canvas drawing
- add interface/ui
- district hover information
- experiment with trying to keep big districts more cohesive/clumped/less strung out
*/

var canvas;
var swapManager;
var running = false;

const fr = 30;

function setup() {
	defineParameters();
	createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
	frameRate(fr);

	canvas = new Canvas();
	swapManager = new SwapManager();

	canvas.draw();

	// speedTest();
	// scoreTest();
}

function draw() {
	if (running) {
		frameStart = millis();

		canvas.draw();

		for (var swapsDone = 0; true; swapsDone++) {
			swapManager.swap();
			if (millis() - frameStart > 1000/fr) {
				break;
			}
		}
		print(`${swapsDone} swaps done this frame`)
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
