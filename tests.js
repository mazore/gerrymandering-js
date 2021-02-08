/* eslint-disable no-console */
function speedTest() {
    let timeSum = 0;
    const numIters = 1000;
    for (let i = 0; i < numIters; i += 1) {
        simulation = new Simulation();
        swapManager = new SwapManager();

        const t = window.performance.now();
        for (let j = 0; j < 1000; j += 1) {
            swapManager.swap();
        }
        simulation.draw();
        /** @todo: add pie chart update here */
        timeSum += window.performance.now() - t;

        if (i % 100 === 0) {
            console.log(`${i / 10}% done`);
        }
    }
    console.log(timeSum / numIters);
}

function scoreTest() {
    let scoreSum = 0;
    const numIters = 1000;
    for (let i = 0; i < numIters; i += 1) {
        simulation = new Simulation();
        swapManager = new SwapManager();

        for (let j = 0; j < 1000; j += 1) {
            swapManager.swap();
        }
        scoreSum += simulation.getScore().get(BLUE);

        if (i % 100 === 0) {
            console.log(`${i / 10}% done`);
        }
    }
    console.log(scoreSum / numIters);
}
