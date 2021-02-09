import { circle, rect, text } from '../helpers/drawing.js';
import ps from '../parameters.js';
import { BLUE, RED, TIE } from '../parties.js';

export default function DistrictsPieChart(pieCharts) {
    this.centerX = 300;
    this.radius = 75;

    this.draw = () => {
        const { ctx } = pieCharts;
        const score = pieCharts.main.simulation.getScore();

        const [w, h] = [pieCharts.width, pieCharts.height];
        rect(ctx, w / 2, 0, w / 2, h, '#ffffff'); // Clear background
        circle(ctx, this.centerX, pieCharts.centerY, pieCharts.radius, TIE.color2);
        text(ctx, 'Districts', this.centerX, 25, '#000', 15);
        pieCharts.drawPieSlice(BLUE, this.centerX, score, ps.NUM_DISTRICTS);
        pieCharts.drawPieSlice(RED, this.centerX, score, ps.NUM_DISTRICTS);
    };

    this.draw();
}
