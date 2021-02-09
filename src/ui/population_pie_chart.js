import { circle, rect, text } from '../helpers/drawing.js';
import { distance, flattened } from '../helpers/functions.js';
import ps from '../parameters.js';
import { BLUE, RED } from '../parties.js';

export default function PopulationPieChart(pieCharts) {
    this.centerX = 100;

    this.populationDragging = false;
    this.populationHovering = false;

    this.draw = () => {
        const { ctx } = pieCharts;
        rect(ctx, 0, 0, pieCharts.width / 2, pieCharts.height, '#ffffff'); // Clear background
        text(ctx, 'Population', this.x, 25, '#000', 15);
        const { demographics } = pieCharts.main.simulation;
        pieCharts.drawPieSlice(BLUE, this.centerX, demographics, ps.NUM_PEOPLE);
        pieCharts.drawPieSlice(RED, this.centerX, demographics, ps.NUM_PEOPLE);
        circle(ctx, ...this.getDragPoint(), 5, '#ffff88', true);
    };

    /** Returns a point in canvas coords that is a point to drag on the population chart */
    this.getDragPoint = () => {
        const percent = (pieCharts.main.simulation.demographics.get(BLUE) / ps.NUM_PEOPLE);
        const angle = -Math.PI / 2 + (Math.PI * 2 * percent);
        const x = this.centerX - (pieCharts.radius * Math.cos(angle));
        const y = pieCharts.centerY + (pieCharts.radius * Math.sin(angle));
        return [x, y];
    };

    this.mouseMove = (event) => {
        if (this.populationDragging) {
            const dy = pieCharts.centerY + pieCharts.top - event.y;
            let angle = Math.atan2(event.x - this.centerX, dy);
            if (angle < 0) angle += Math.PI * 2; // Ensure 0 to 2pi
            const percent = angle / (Math.PI * 2);

            ps.PERCENT_BLUE = 100 * (1 - percent);
            ps.STANCE_THRESHOLD = Math.floor(ps.NUM_PEOPLE * (ps.PERCENT_BLUE / 100) - 0.5);
            flattened(pieCharts.main.simulation.peopleGrid).forEach((person) => {
                person.setParty();
            });

            this.draw();
            pieCharts.districtsPieChart.draw();
            pieCharts.main.simulation.draw();

            return; // Don't need to update cursor if dragging
        }

        // Update cursor and if hovering
        const [x, y] = this.getDragPoint();
        if (distance(x, y + pieCharts.top, event.x, event.y, 15)) {
            this.populationHovering = true;
            document.body.style.cursor = 'grab';
        } else {
            this.populationHovering = false;
            document.body.style.cursor = 'default';
        }
    };

    this.mouseDown = () => {
        // Grab if hovering
        if (this.populationHovering) {
            this.populationDragging = true;
            document.body.style.cursor = 'grabbing';
        }
    };

    this.mouseUp = () => {
        // Stop grabbing
        this.populationDragging = false;
        document.body.style.cursor = 'default';
    };

    this.draw();
}
