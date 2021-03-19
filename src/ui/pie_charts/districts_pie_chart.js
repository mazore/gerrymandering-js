import { getRGB } from '../../helpers/functions.js';
import ps from '../../parameters.js';
import PieChartBase from './pie_chart_base.js';
import { BLUE } from '../../parties.js';

export default class DistrictsPieChart extends PieChartBase {
    constructor(pieCharts) {
        const centerX = 300;
        const getDragPointPercent = () => 1 - (ps.TARGET_NUM_BLUE_DISTRICTS / ps.NUM_DISTRICTS);
        const getScore = () => pieCharts.main.simulation.score;
        const left = pieCharts.width / 2;
        const name = 'Districts';
        const quantity = () => ps.NUM_DISTRICTS;

        super(pieCharts, centerX, getDragPointPercent, getScore, left, name, quantity, {});

        this.draw();

        this.onDragged = (percent) => {
            ps.setTargetNumBlueDistricts(1 - percent);
            if (ps.TARGET_NUM_BLUE_DISTRICTS !== pieCharts.main.simulation.score.get(BLUE)) {
                pieCharts.main.resume();
            }

            if (this.pulseInterval !== null) {
                clearInterval(this.pulseInterval);
                this.pulseInterval = null;
                this.dragPointRadius = 5;
            }
        };

        this.pulseVelocity = 0.1;
        this.pulseDragPoint = () => {
            this.dragPointRadius += this.pulseVelocity;
            if (this.dragPointRadius < 5 || this.dragPointRadius > 7) {
                this.pulseVelocity *= -1;
            }
            this.draw();
        };
        this.pulseInterval = setInterval(this.pulseDragPoint, 10);
    }
}
