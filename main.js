/*
TODO:
- optimize pie charts (refreshing/drawing less often)
- optimize getDemographics (not a function)
- reduce cpu load of program when nothing is happening
- setup eslint
- add percent to pie charts
- drag districts pie charts to control HELP_PARTY, HINDER_PARTY, and FAVOR_TIE
- add interface/ui
	- parameter adjusters
	- control panel
- when all red districts are high margin, pick one to try to flip
- district hover information
- speed up simulation drawing
- experiment with trying to keep big districts more cohesive/clumped/less strung out
*/

let simulation;
let pieCharts;

addEventListener('load', function() {
	defineParameters();

	simulation = new Simulation();

	pieCharts = new PieCharts();

	// speedTest(); // Most recent about 24.028
	// scoreTest(); // Most recent about 29.085

	update();
});

function update() {
	simulation.update();

	pieCharts.update();

	requestAnimationFrame(update);
}
