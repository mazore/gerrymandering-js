/* eslint-disable no-console */
import { BLUE } from './simulation/parties.js';

export function speedTest(Main) {
    let timeSum = 0;
    const numIters = 1000;
    for (let i = 0; i < numIters; i += 1) {
        const main = new Main();

        const t = window.performance.now();
        for (let j = 0; j < 1000; j += 1) {
            main.simulation.swapManager.swap();
        }
        main.simulation.draw();
        // main.pieCharts.drawDistrictsPieChart();
        timeSum += window.performance.now() - t;

        if (i % 100 === 0) {
            console.log(`${i / 10}% done`);
        }
    }
    console.log(timeSum / numIters);
}

export function scoreTest(Main) {
    let scoreSum = 0;
    const numIters = 1000;
    for (let i = 0; i < numIters; i += 1) {
        const main = new Main();

        for (let j = 0; j < 1000; j += 1) {
            main.simulation.swapManager.swap();
        }
        scoreSum += main.simulation.getScore().get(BLUE);

        if (i % 100 === 0) {
            console.log(`${i / 10}% done`);
        }
    }
    console.log(scoreSum / numIters);
}
