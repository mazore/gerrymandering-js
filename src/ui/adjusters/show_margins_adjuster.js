import ps from '../../parameters.js';

export default class ShowMarginsAdjuster {
    constructor(adjusters) {
        this.adjusters = adjusters;
        this.id = 'showMargins';
        this.parameterName = 'SHOW_MARGINS';

        this.element = document.getElementById(this.id);
        this.element.oninput = (event) => {
            ps.SHOW_MARGINS = event.target.checked;
            adjusters.main.simulation.draw();
        };
    }
}
