import ParamterAdjusterBase from './parameter_adjuster_base.js';

export default class DistrictSizeAdjuster extends ParamterAdjusterBase {
    constructor(adjusters) {
        super(adjusters, 'districtSize', 'DISTRICT_SIZE');

        this.getChoices = () => {
            // All perfect squares 4 to 81
            const choices = [];
            for (let i = 2; i < 10; i += 1) {
                choices.push(i * i);
            }
            return choices;
        };

        this.afterChoice = () => {
            // Make sure grid width is valid
            const gridWidthAdjuster = adjusters.adjusters.get('gridWidth');
            const before = gridWidthAdjuster.get();
            gridWidthAdjuster.updateHTML();

            const sortFunc = (a, b) => (Math.abs(b - before) < Math.abs(a - before) ? b : a);
            const choices = gridWidthAdjuster.getChoices();
            const closestToBefore = choices.reduce(sortFunc);
            gridWidthAdjuster.element.value = closestToBefore;
            gridWidthAdjuster.setParameter();
        };
    }
}
