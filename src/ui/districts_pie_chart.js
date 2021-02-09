import { circle, rect, text } from '../helpers/drawing.js';
import { distance } from '../helpers/functions.js';
import ps from '../parameters.js';
import { BLUE, RED, TIE } from '../parties.js';

export default function DistrictsPieChart(pieCharts) {
    this.centerX = 300;

    this.targetPercent = 0.5;
    this.dragging = false;
    this.hovering = false;

    this.draw = () => {
        const { ctx } = pieCharts;
        const score = pieCharts.main.simulation.getScore();

        const [w, h] = [pieCharts.width, pieCharts.height];
        rect(ctx, w / 2, 0, w / 2, h, '#ffffff'); // Clear background
        circle(ctx, this.centerX, pieCharts.centerY, pieCharts.radius, TIE.color2);
        text(ctx, 'Districts', this.centerX, 25, '#000', 15);
        pieCharts.drawPieSlice(BLUE, this.centerX, score, ps.NUM_DISTRICTS);
        pieCharts.drawPieSlice(RED, this.centerX, score, ps.NUM_DISTRICTS);
        circle(ctx, ...this.getDragPoint(), 5, '#ffff88', true);
    };

    /** Returns a point in canvas coords that is a point to drag */
    this.getDragPoint = () => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * this.targetPercent);
        const x = this.centerX + (pieCharts.radius * Math.cos(angle));
        const y = pieCharts.centerY + (pieCharts.radius * Math.sin(angle));
        return [x, y];
    };

    this.draw();

    this.mouseMove = (event) => {
        if (this.dragging) {
            const dx = pieCharts.left - this.centerX + event.x;
            const dy = pieCharts.top + pieCharts.centerY - event.y;
            let angle = Math.atan2(dx, dy);
            if (angle < 0) angle += Math.PI * 2; // Ensure 0 to 2pi
            this.targetPercent = angle / (Math.PI * 2);

            this.draw();
            pieCharts.districtsPieChart.draw();
            pieCharts.main.simulation.draw();

            return; // Don't need to update cursor if dragging
        }

        // Update cursor and if hovering
        const [x, y] = this.getDragPoint();
        if (distance(x, y + pieCharts.top, event.x, event.y, 15)) {
            this.hovering = true;
        } else {
            this.hovering = false;
        }
    };

    this.mouseDown = () => {
        if (this.hovering) {
            this.dragging = true;
        }
    };
}
