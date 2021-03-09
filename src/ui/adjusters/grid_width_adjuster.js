import ParamterAdjusterBase from './parameter_adjuster_base.js';

export default class GridWidthAdjuster extends ParamterAdjusterBase {
    constructor(adjusters) {
        super(adjusters, 'gridWidth', 'GRID_WIDTH');
    }

    getChoices() {
        const districtSize = this.adjusters.adjusters.get('districtSize').get();
        const districtWidth = Math.sqrt(districtSize);
        const choices = [];
        for (let districtsPerRow = 2; districtsPerRow < 15; districtsPerRow += 1) {
            choices.push(districtsPerRow * districtWidth);
        }
        return choices;
    }
}
