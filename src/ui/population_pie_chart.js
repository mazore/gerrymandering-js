import { flattened } from '../helpers/functions.js';
import ps from '../parameters.js';
import PieChartBase from './pie_chart_base.js';

export default class PopulationPieChart extends PieChartBase {
    constructor(pieCharts) {
        const centerX = 100;
        const getDragPointPercent = () => ps.PERCENT_RED;
        const getScore = () => pieCharts.main.simulation.demographics;
        const left = 0;
        const name = 'Population';
        const quantity = ps.NUM_PEOPLE;
        const options = { drawTiedCircle: false };

        super(pieCharts, centerX, getDragPointPercent, getScore, left, name, quantity, options);

        this.draw();
    }

    /** Returns a point in canvas coords that is a point to drag */
    onDragged(percent) {
        ps.PERCENT_RED = percent;
        ps.STANCE_THRESHOLD = Math.floor(ps.NUM_PEOPLE * ps.PERCENT_RED + 0.5);
        flattened(this.pieCharts.main.simulation.peopleGrid).forEach((person) => {
            person.setParty();
        });

        this.pieCharts.districtsPieChart.draw();
        this.pieCharts.main.simulation.draw();
    }
}
