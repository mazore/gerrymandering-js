import DistrictsPieChart from './pie_charts/districts_pie_chart.js';
import PopulationPieChart from './pie_charts/population_pie_chart.js';

export default function PieCharts(main) {
    this.main = main;
    this.centerY = 115;
    [this.width, this.height] = [400, 200];
    this.radius = 75;

    this.canvas = document.getElementById('piecharts');
    this.ctx = this.canvas.getContext('2d');
    this.left = this.canvas.getBoundingClientRect().left;
    this.top = this.canvas.getBoundingClientRect().top;

    // Fix blurriness
    this.canvas.width = this.width * 2;
    this.canvas.height = this.height * 2;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(2, 2);

    this.mouseDown = (event) => {
        event.preventDefault();
        this.populationPieChart.mouseDown(event);
        this.districtsPieChart.mouseDown(event);
        if (this.populationPieChart.hovering || this.districtsPieChart.hovering) {
            document.body.style.cursor = 'grabbing';
        }
    };

    this.checkHovering = (event) => {
        event.preventDefault();
        this.populationPieChart.checkHovering(event);
        this.districtsPieChart.checkHovering(event);
        if (this.populationPieChart.hovering || this.districtsPieChart.hovering) {
            document.body.style.cursor = 'grab';
        } else {
            document.body.style.cursor = 'default';
        }
    };

    this.updateDragging = (event) => {
        event.preventDefault();
        this.populationPieChart.updateDragging(event);
        this.districtsPieChart.updateDragging(event);
    };

    this.mouseUp = (event) => {
        event.preventDefault();
        this.populationPieChart.dragging = false;
        this.districtsPieChart.dragging = false;
        document.body.style.cursor = 'default';
    };

    this.canvas.addEventListener('mousedown', this.mouseDown);
    this.canvas.addEventListener('mousemove', this.checkHovering);
    window.addEventListener('mousemove', this.updateDragging);
    window.addEventListener('mouseup', this.mouseUp);

    const addTouchFunc = (eventName, funcName) => {
        window.addEventListener(eventName, (event) => {
            if (event.touches.length === 1) {
                const touch = event.touches[0];
                [event.x, event.y] = [touch.pageX, touch.pageY];
                this[funcName](event);
            }
        }, { passive: false });
    };
    addTouchFunc('touchstart', 'mouseDown');
    addTouchFunc('touchmove', 'updateDragging');
    window.addEventListener('touchend', this.mouseUp, { passive: false });

    this.populationPieChart = new PopulationPieChart(this);
    this.districtsPieChart = new DistrictsPieChart(this);
}
