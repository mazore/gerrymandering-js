/*
TODO:
- finish district pie chart
- add population pie chart
- when all red districts are high margin, pick one to try to flip
- speed up simulation drawing
- add interface/ui
- district hover information
- experiment with trying to keep big districts more cohesive/clumped/less strung out
*/

let simulation;

window.onload = function() {
	defineParameters();

	simulation = new Simulation();

	// speedTest(); // Most recent about 24.028
	// scoreTest(); // Most recent about 29.085

	update();
}

function update() {
	simulation.draw();
	if (simulation.running) {
		const frameStart = window.performance.now();

		for (var swapsDone = 0; true; swapsDone++) {
			simulation.swapManager.swap();
			if (window.performance.now() - frameStart > 1000/30) {
				break; // If time for frame is up
			}
		}
		// console.log(`${swapsDone} swaps done this frame`)
	}

	requestAnimationFrame(update);
}

addEventListener('mousedown', function(event) {
	if (event.button == 0) { // Left click
		simulation.running = !simulation.running;
	}
});

addEventListener('contextmenu', function(event) { // Right click
	event.preventDefault();
	simulation.swapManager.swap();
	simulation.draw();
});
