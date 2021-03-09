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
        ps.setTargetNumBlueDistricts(0.5);
        this.afterChoice();
        this.adjusters.main.simulation.setup();
        this.adjusters.main.pieCharts.populationPieChart.setQuantity();
        this.adjusters.main.pieCharts.populationPieChart.draw();
        this.adjusters.main.pieCharts.districtsPieChart.setQuantity();
        this.adjusters.main.pieCharts.districtsPieChart.draw();
    }
}
