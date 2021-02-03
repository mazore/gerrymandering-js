function setup() {
	defineParameters();

	createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
	// noLoop();

	canvas = new Canvas();
	swapManager = new SwapManager();
}

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

function scoreTest() {
	let scoreSum = 0;
	for (let i = 0; i < 1000; i++) {
		canvas = new Canvas();
		swapManager = new SwapManager();

		for (let i = 0; i < 1000; i++) {
			swapManager.swap();
		}
		// canvas.draw();
		scoreSum += canvas.getScore().get(BLUE);

		if (i % 10 == 0) {
			print(`${i / 10}% done`)
		}
	}
	console.log(scoreSum / 1000);
}
