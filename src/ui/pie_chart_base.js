import { circle, rect, text } from '../helpers/drawing.js';
import { distance } from '../helpers/functions.js';
import { BLUE, RED, TIE } from '../parties.js';

/** Stores similar functionality between population and districts pie charts */
export default class PieChartBase {
    constructor(pieCharts, centerX, getDragPointPercent, getScore, left, name, quantity, options) {
        this.pieCharts = pieCharts;
        this.dragging = false;
        this.hovering = false;

        this.centerX = centerX;
        this.getDragPointPercent = getDragPointPercent;
        this.getScore = getScore;
        this.left = left;
        this.name = name;
        this.quantity = quantity;
        this.drawTiedCircle = options.drawTiedCircle ?? true;
    }

    draw() {
        const { ctx, centerY, radius } = this.pieCharts;
        const { width: parentWidth, height: parentHeight } = this.pieCharts;
        const score = this.getScore();

        rect(ctx, this.left, 0, parentWidth / 2, parentHeight, '#ffffff'); // Clear background

        if (this.drawTiedCircle) {
            circle(ctx, this.centerX, centerY, radius, TIE.color2); // Gray circle behind
        }

        text(ctx, this.name, this.centerX, 25, '#000', 15); // Label

        this.pieCharts.drawPieSlice(BLUE, this.centerX, score, this.quantity); // Blue pie slice
        this.pieCharts.drawPieSlice(RED, this.centerX, score, this.quantity); // Red pie slice

        circle(ctx, ...this.getDragPoint(), 5, '#ffff88', true); // Drag point
    }

    /** Returns a point in canvas coords that is a point to drag */
    getDragPoint() {
        const angle = -Math.PI / 2 + (Math.PI * 2 * this.getDragPointPercent());
        const x = this.centerX + (this.pieCharts.radius * Math.cos(angle));
        const y = this.pieCharts.centerY + (this.pieCharts.radius * Math.sin(angle));
        return [x, y];
    }

    mouseMove(event) {
        if (this.dragging) {
            this.whileDragging(event);
            return; // Don't need to update cursor if dragging
        }

        const [x, y] = this.getDragPoint();
        if (distance(x, y + this.pieCharts.top, event.x, event.y, 15)) {
            this.hovering = true;
        } else {
            this.hovering = false;
        }
    }

    whileDragging(event) {
        const dx = this.pieCharts.left - this.centerX + event.x;
        const dy = this.pieCharts.top + this.pieCharts.centerY - event.y;
        let angle = Math.atan2(dx, dy);
        if (angle < 0) angle += Math.PI * 2; // Ensure 0 to 2pi
        const percent = angle / (Math.PI * 2);

        this.onDragged(percent);

        this.draw();
    }

    mouseDown() {
        if (this.hovering) {
            this.dragging = true;
        }
    }
}
