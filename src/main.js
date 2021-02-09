import PieCharts from './ui/pie_charts.js';
import Simulation from './simulation.js';
// import { speedTest, scoreTest } from './tests.js';

function Main() {
    this.update = () => {
        this.simulation.update();

        this.pieCharts.districtsPieChart.draw();

        this.requestId = requestAnimationFrame(this.update);
    };

    this.mouseDown = (event) => {
        if (event.button === 0) { // Left click
            if (this.requestId == null) { // Start running
                this.resume();
            } else { // Stop running
                this.pause();
            }
        }
    };

    this.resume = () => {
        if (this.requestId == null) {
            this.requestId = requestAnimationFrame(this.update);
        }
    };

    this.pause = () => {
        if (this.requestId != null) {
            cancelAnimationFrame(this.requestId);
            this.requestId = null;
            this.simulation.draw(); // Because it swaps after drawing every update
        }
    };

    this.requestId = null;
    this.simulation = new Simulation(this);
    this.pieCharts = new PieCharts(this);
}

new Main();
// speedTest(Main);
// scoreTest(Main);
