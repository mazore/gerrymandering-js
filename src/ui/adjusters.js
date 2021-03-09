import DistrictSizeAdjuster from './adjusters/district_size_adjuster.js';
import GridWidthAdjuster from './adjusters/grid_width_adjuster.js';

export default function Adjusters(main) {
    this.main = main;
    const adjustersArray = [
        new DistrictSizeAdjuster(this),
        new GridWidthAdjuster(this),
    ];

    this.adjusters = new Map();
    for (const adjuster of adjustersArray) {
        this.adjusters.set(adjuster.id, adjuster);
    }

    for (const adjuster of this.adjusters.values()) {
        adjuster.secondaryInit();
    }
}
