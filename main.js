/*
TODO:
- only call drawDistrictsPieChart() when a district is flipped
- refactor pie charts (2 pie chart classes w/ prototype?, 2 instances?)
- reduce cpu load of program when nothing is happening
- setup eslint
- add percent to pie charts
- drag districts pie charts to control HELP_PARTY, HINDER_PARTY, and FAVOR_TIE
	- start with odd grid so don't have to deal with ties
- add interface/ui
	- parameter adjusters
	- control panel
- when all red districts are high margin, pick one to try to flip
- district hover information
- speed up simulation drawing
- experiment with trying to keep big districts more cohesive/clumped/less strung out
*/

let requestId = null;
let simulation;
let pieCharts;

addEventListener('load', function() {
	defineParameters();

	simulation = new Simulation();

	pieCharts = new PieCharts();

	// speedTest(); // Most recent about 24.028
	// scoreTest(); // Most recent about 29.085
});

function update() {
	simulation.update();

	pieCharts.drawDistrictsPieChart();

	requestId = requestAnimationFrame(update);
}

function simulationMouseDown(event) {
	if (event.button == 0) { // Left click
		if (requestId == null) { // Start running
			requestId = requestAnimationFrame(update);
		} else { // Stop running
			cancelAnimationFrame(requestId);
			requestId = null;
			simulation.draw(); // Because it swaps after drawing every update
		}
	}
}
