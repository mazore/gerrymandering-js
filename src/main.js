import PieCharts from './ui/pie_charts.js';
import Simulation from './simulation.js';
import Adjusters from './ui/adjusters.js';

function Main() {
    this.update = () => {
        this.simulation.update();

        this.pieCharts.districtsPieChart.draw();

        if (this.requestId !== null) { // If paused during update
            this.requestId = requestAnimationFrame(this.update);
        }
    };

    this.isPaused = () => this.requestId == null;

    this.resume = () => {
        if (this.isPaused()) {
            this.requestId = requestAnimationFrame(this.update);
        }
    };

    this.pause = () => {
        if (!this.isPaused()) {
            cancelAnimationFrame(this.requestId);
            this.requestId = null;
            this.simulation.draw(); // Because it swaps after drawing every update
        }
    };

    this.requestId = null;
    this.simulation = new Simulation(this);
    this.pieCharts = new PieCharts(this);
    this.adjusters = new Adjusters(this);
}

window.main = new Main();
// import { speedTest, scoreTest } from './tests.js';
// speedTest(Main);
// scoreTest(Main);
