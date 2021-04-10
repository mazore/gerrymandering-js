export default class AdjusterBase {
    constructor(adjusters, id, parameterName, choices, onChange) {
        this.adjusters = adjusters;
        this.id = id;
        this.parameterName = parameterName;
        this.choices = choices;

        this.element = document.getElementById(this.id);
        this.element.oninput = onChange.bind(this);
    }
}
