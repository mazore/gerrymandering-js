import ps from '../parameters.js';
import PieChartBase from './pie_chart_base.js';

export default class DistrictsPieChart extends PieChartBase {
    constructor(pieCharts) {
        const centerX = 300;
        const getDragPointPercent = () => ps.TARGET_PERCENT_DISTRICTS_BLUE;
        const { getScore } = pieCharts.main.simulation;
        const left = pieCharts.width / 2;
        const name = 'Districts';
        const quantity = ps.NUM_DISTRICTS;

        super(pieCharts, centerX, getDragPointPercent, getScore, left, name, quantity, {});

        this.draw();

        this.onDragged = (percent) => {
            ps.TARGET_PERCENT_DISTRICTS_BLUE = percent;
        };
    }
}
