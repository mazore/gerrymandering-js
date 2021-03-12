import ps from '../../parameters.js';

export default class AdjusterBase {
    constructor(adjusters, id, parameterName, choices, onChange) {
        this.adjusters = adjusters;
        this.id = id;
        this.parameterName = parameterName;
        this.choices = choices;
        this.onChange = onChange;

        this.setupElement();
    }

    setupElement() {
        this.element = document.getElementById(this.id);
        this.element.onchange = this.onChange.bind(this);
        const options = [];
        for (const choice of this.choices) {
            options.push(`<option>${choice}</option>`);
        }
        this.element.innerHTML = options.join();
        this.element.value = ps[this.parameterName];
    }
}
