import DistrictSizeAdjuster from './adjusters/district_size_adjuster.js';
import NumDistrictsAdjuster from './adjusters/num_districts_adjuster.js';

export default function ParameterAdjusters(main) {
    this.main = main;
    const adjustersArray = [
        new DistrictSizeAdjuster(this),
        new NumDistrictsAdjuster(this),
    ];

    this.adjusterMap = new Map();
    for (const adjuster of adjustersArray) {
        this.adjusterMap.set(adjuster.id, adjuster);
    }
}
