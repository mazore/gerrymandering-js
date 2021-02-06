/*
TODO:
- move running and SwapManager into Simulation
- abstract pie chart drawing into draw functions
- test not using in place shuffle
- finish district pie chart
- add population pie chart
- when all red districts are high margin, pick one to try to flip
- speed up simulation drawing
- add interface/ui
- district hover information
- experiment with trying to keep big districts more cohesive/clumped/less strung out
*/

var simulation;
var swapManager;
var running = false;

window.onload = function() {
	defineParameters();

	simulation = new Simulation();
	simulation.draw();
	swapManager = new SwapManager();

	// speedTest(); // Most recent about 24.028
	// scoreTest(); // Most recent about 29.085

	draw();
}

function draw() {
	simulation.draw();
	if (running) {
		frameStart = window.performance.now();


		for (var swapsDone = 0; true; swapsDone++) {
			swapManager.swap();
			if (window.performance.now() - frameStart > 1000/30) {
				break;
			}
		}
		// console.log(`${swapsDone} swaps done this frame`)
	}
	requestAnimationFrame(draw);
}

addEventListener('mousedown', function(event) {
	if (event.button == 0) { // Left click
		running = !running;
	}
});

addEventListener('contextmenu', function(event) { // Right click
	event.preventDefault();
	swapManager.swap();
	simulation.draw();
});
