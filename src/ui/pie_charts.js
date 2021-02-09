import { arc, text } from '../helpers/drawing.js';
import { RED } from '../parties.js';
import DistrictsPieChart from './districts_pie_chart.js';
import PopulationPieChart from './population_pie_chart.js';

export default function PieCharts(main) {
    this.main = main;
    this.centerY = 115;
    [this.width, this.height] = [400, 200];
    this.radius = 75;

    this.canvas = document.getElementById('piecharts');
    this.ctx = this.canvas.getContext('2d');
    this.top = this.canvas.getBoundingClientRect().top;

    // Fix blurriness
    this.canvas.width = this.width * 2;
    this.canvas.height = this.height * 2;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(2, 2);

    for (const eventName of ['mousemove', 'touchmove']) {
        window.addEventListener(eventName, (event) => {
            this.populationPieChart.mouseMove(event);
        });
    }

    for (const eventName of ['mousedown', 'touchstart']) {
        this.canvas.addEventListener(eventName, () => {
            this.populationPieChart.mouseDown();
        });
    }

    for (const eventName of ['mouseup', 'touchend']) {
        window.addEventListener(eventName, () => {
            this.populationPieChart.mouseUp();
        });
    }

    /** Helper function that draws a filled arc for a party */
    this.drawPieSlice = (party, centerX, map, quantity) => {
        const factor = party.equalTo(RED) ? 1 : -1;
        const start = -Math.PI / 2;
        const span = Math.PI * 2 * (map.get(party) / quantity);
        const end = start + span * factor;
        arc(this.ctx, centerX, this.centerY, this.radius,
            start, end, party.equalTo(RED), party.color1);

        if (span !== 0) {
            const mid = (start + end) / 2;
            const x = centerX + Math.cos(mid) * (this.radius * 0.5);
            const y = this.centerY + Math.sin(mid) * (this.radius * 0.5);
            text(this.ctx, map.get(party), x, y);
        }
    };

    this.populationPieChart = new PopulationPieChart(this);
    this.districtsPieChart = new DistrictsPieChart(this);
}
