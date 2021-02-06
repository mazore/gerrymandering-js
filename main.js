/*
TODO:
- implement percentageRed
- when all red districts are high margin, pick one to try to flip
- speed up simulation drawing
- add interface/ui
- district hover information
- experiment with trying to keep big districts more cohesive/clumped/less strung out
*/

let simulation;
let pieCharts;

window.onload = function() {
	defineParameters();

	simulation = new Simulation();

	pieCharts = new PieCharts();

	// speedTest(); // Most recent about 24.028
	// scoreTest(); // Most recent about 29.085

	update();
}

function update() {
	simulation.update();

	pieCharts.update(false);

	requestAnimationFrame(update);
}
