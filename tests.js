function speedTest() {
	let timeSum = 0;
	let numIters = 1000;
	for (let i = 0; i < numIters; i++) {
		simulation = new Simulation();
		swapManager = new SwapManager();

		const t = window.performance.now();
		for (let i = 0; i < 1000; i++) {
			swapManager.swap();
		}
		simulation.draw();
		pieCharts.update();
		timeSum += window.performance.now() - t;

		if (i % 100 == 0) {
			console.log(`${i / 10}% done`);
		}
	}
	console.log(timeSum / numIters);
}

function scoreTest() {
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
			console.log(`${i / 10}% done`);
		}
	}
	console.log(scoreSum / numIters);
}
