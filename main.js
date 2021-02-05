/*
TODO:
- finish district pie chart
- add population pie chart
- speed up simulation drawing
- add interface/ui
- district hover information
- experiment with trying to keep big districts more cohesive/clumped/less strung out
*/

var simulation;
var swapManager;
var running = false;

const fr = 30;

function setup() {
	defineParameters();
	createCanvas(SIMULATION_WIDTH, SIMULATION_WIDTH).parent('p5canvas');
	frameRate(fr);

	simulation = new Simulation();
	swapManager = new SwapManager();

	simulation.draw();

	// speedTest(); // Most recent about 27.18
	// scoreTest(); // Most recent about 29.085
}

function draw() {
	if (running) {
		frameStart = millis();

		simulation.draw();

		for (var swapsDone = 0; true; swapsDone++) {
			swapManager.swap();
			if (millis() - frameStart > 1000/fr) {
				break;
			}
		}
		// print(`${swapsDone} swaps done this frame`)
	}
}

function mousePressed() {
	if (mouseButton == LEFT) {
		running = !running;
	}
}

addEventListener('contextmenu', function(event) { // Right click
	event.preventDefault();
	swapManager.swap();
	simulation.draw();
});
