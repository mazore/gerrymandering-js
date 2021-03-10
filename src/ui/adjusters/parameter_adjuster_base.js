import ps from '../../parameters.js';

export default class ParamterAdjusterBase {
    constructor(adjusters, id, parameterName) {
        this.adjusters = adjusters;
        this.id = id;
        this.parameterName = parameterName;
        this.afterChoice = () => {};
    }

    secondaryInit() {
        this.element = document.getElementById(this.id);
        this.element.onchange = this.setParameter.bind(this);
        this.updateHTML(); // Sometimes needs to be after all adjusters initialized
        this.element.value = ps[this.parameterName];
    }

    updateHTML() {
        const options = [];
        for (const choice of this.getChoices()) {
            options.push(`<option>${choice}</option>`);
        }
        this.element.innerHTML = options.join();
    }

    get() {
        return document.getElementById(this.id).value;
    }

    setParameter() {
        ps[this.parameterName] = parseInt(this.get(), 10);
        ps.computeProperties();
        ps.setStanceThreshold();
        this.afterChoice();

        const { simulation, pieCharts } = this.adjusters.main;
        simulation.setup();
        pieCharts.populationPieChart.setQuantity();
        pieCharts.populationPieChart.draw();
        pieCharts.districtsPieChart.setQuantity();
        pieCharts.districtsPieChart.draw();
    }
}
