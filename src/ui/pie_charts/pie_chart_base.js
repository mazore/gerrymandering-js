import {
    arc, circle, rect, text,
} from '../../helpers/drawing.js';
import { distance } from '../../helpers/functions.js';
import { BLUE, RED, TIE } from '../../parties.js';

/** Stores similar functionality between population and districts pie charts */
export default class PieChartBase {
    constructor(
        pieCharts, centerX, getDragPointPercent, getScore, left, name, getQuantity, options,
    ) {
        this.pieCharts = pieCharts;
        this.dragging = false;
        this.hovering = false;

        this.centerX = centerX;
        this.getDragPointPercent = getDragPointPercent;
        this.getScore = getScore;
        this.left = left;
        this.name = name;
        this.getQuantity = getQuantity;
        this.setQuantity();
        this.drawTiedCircle = options.drawTiedCircle ?? true;
    }

    setQuantity() {
        this.quantity = this.getQuantity();
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

        this.drawPieSlice(BLUE, score);
        this.drawPieSlice(RED, score);

        circle(ctx, ...this.getDragPoint(), 5, '#ffff88', true); // Drag point
    }

    /** Helper function that draws a filled arc for a party */
    drawPieSlice(party, map) {
        const { ctx, centerY, radius } = this.pieCharts;

        const factor = party.equalTo(RED) ? 1 : -1;
        const start = -Math.PI / 2;
        const span = Math.PI * 2 * (map.get(party) / this.quantity);
        const end = start + span * factor;
        arc(ctx, this.centerX, centerY, radius, start, end, party.equalTo(RED), party.color1);

        if (span !== 0) { // Label
            const mid = (start + end) / 2;
            const x = this.centerX + Math.cos(mid) * (radius * 0.5);
            const y = centerY + Math.sin(mid) * (radius * 0.5);
            text(ctx, map.get(party), x, y);
        }
    }

    /** Returns a point in canvas coords that is a point to drag */
    getDragPoint() {
        const angle = -Math.PI / 2 + (Math.PI * 2 * this.getDragPointPercent());
        const x = this.centerX + (this.pieCharts.radius * Math.cos(angle));
        const y = this.pieCharts.centerY + (this.pieCharts.radius * Math.sin(angle));
        return [x, y];
    }

    checkHovering(event) {
        const [x, y] = this.getDragPoint();
        if (distance(x, y + this.pieCharts.top, event.x, event.y, 15)) {
            this.hovering = true;
        } else {
            this.hovering = false;
        }
    }

    updateDragging(event) {
        if (this.dragging) {
            const dx = this.pieCharts.left - this.centerX + event.x;
            const dy = this.pieCharts.top + this.pieCharts.centerY - event.y;
            let angle = Math.atan2(dx, dy);
            if (angle < 0) angle += Math.PI * 2; // Ensure 0 to 2pi
            const percent = angle / (Math.PI * 2);

            this.onDragged(percent);

            this.draw();
        }
    }

    mouseDown(event) {
        this.checkHovering(event);
        if (this.hovering) {
            this.dragging = true;
        }
    }
}
