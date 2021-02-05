function speedTest() {
	noLoop();
	let timeSum = 0;
	let numIters = 1000;
	for (let i = 0; i < numIters; i++) {
		simulation = new Simulation();
		swapManager = new SwapManager();

		t = millis();
		for (let i = 0; i < 1000; i++) {
			swapManager.swap();
		}
		simulation.draw();
		timeSum += millis() - t;

		if (i % 100 == 0) {
			print(`${i / 10}% done`);
		}
	}
	console.log(timeSum / numIters);
}

function scoreTest() {
	noLoop();
	let scoreSum = 0;
	let numIters = 1000;
	for (let i = 0; i < numIters; i++) {
		simulation = new Simulation();
		swapManager = new SwapManager();

		for (let i = 0; i < 1000; i++) {
			swapManager.swap();
		}
		scoreSum += simulation.getScore().get(BLUE);

		if (i % 100 == 0) {
			print(`${i / 10}% done`);
		}
	}
	console.log(scoreSum / numIters);
}
