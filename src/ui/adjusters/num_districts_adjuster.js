import AdjusterBase from './adjuster_base.js';
import ps from '../../parameters.js';

export default class NumDistrictsAdjuster extends AdjusterBase {
    constructor(adjusters) {
        const choices = [];
        for (let i = 2; i < 10; i += 1) {
            choices.push(i * i);
        }

        const onChange = (event) => {
            const numDistricts = event.target.value ** 2;
            const districtWidth = Math.sqrt(ps.DISTRICT_SIZE);
            const districtsPerRow = Math.sqrt(numDistricts);

            document.getElementById('numDistrictsVal').innerText = numDistricts;

            ps.GRID_WIDTH = districtsPerRow * districtWidth;
            ps.onGridWidthSet();

            adjusters.main.simulation.setup();
            adjusters.main.pieCharts.refresh();
        };

        super(adjusters, 'numDistricts', 'NUM_DISTRICTS', choices, onChange);
    }
}
