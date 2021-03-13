import AdjusterBase from './adjuster_base.js';
import ps from '../../parameters.js';

export default class DistrictSizeAdjuster extends AdjusterBase {
    constructor(adjusters) {
        const choices = [];
        for (let i = 3; i < 10; i += 1) {
            choices.push(i * i);
        }

        const onChange = (event) => {
            const districtSize = event.target.value;
            const districtWidth = Math.sqrt(districtSize);
            const districtsPerRow = Math.sqrt(ps.NUM_DISTRICTS);

            ps.DISTRICT_SIZE = districtSize;
            ps.GRID_WIDTH = districtsPerRow * districtWidth;
            ps.onGridWidthSet();

            adjusters.main.simulation.setup();
            adjusters.main.pieCharts.refresh();
        };

        super(adjusters, 'districtSize', 'DISTRICT_SIZE', choices, onChange);
    }
}
