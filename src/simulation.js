/** Manages people, districts, and swapping */
import { flattened, increment, shuffled } from './helpers/functions.js';
import ps from './parameters.js';
import { BLUE, RED, TIE } from './parties.js';

import District from './simulation/district.js';
import Person from './simulation/person.js';
import SwapManager from './simulation/swap_manager.js';

export default function Simulation(main) {
    this.swapManager = new SwapManager(this);

    this.canvas = document.getElementById('simulation');
    this.ctx = this.canvas.getContext('2d');

    this.setup = () => {
        this.setCanvasDimensions(ps.SIMULATION_WIDTH, ps.SIMULATION_WIDTH);
        this.demographics = new Map([[BLUE, 0], [RED, 0]]);
        this.score = new Map([[BLUE, 0], [RED, 0], [TIE, 0]]);

        this.generatePeople();
        this.generateDistricts();
        for (const person of flattened(this.peopleGrid)) {
            person.secondaryInit();
        }
        for (const district of this.districts) {
            increment(this.score, district.getWinner());
        }
        ps.defaultTargetNumBlueDistricts(this);
        this.draw();
    };

    this.generatePeople = () => {
        this.peopleGrid = []; // 2D array of Person objects
        // Make sure people are random but equal numbers for each party
        let stances = [];
        for (let i = 0; i < ps.NUM_PEOPLE; i += 1) {
            stances.push(i);
        }
        stances = shuffled(stances);
        let personId = 0;
        for (let gridY = 0; gridY < ps.GRID_WIDTH; gridY += 1) {
            const row = [];
            for (let gridX = 0; gridX < ps.GRID_WIDTH; gridX += 1) {
                const stance = stances[gridX + gridY * ps.GRID_WIDTH];
                row.push(new Person(this, personId, gridX, gridY, stance));
                personId += 1;
            }
            this.peopleGrid.push(row);
        }
    };

    this.generateDistricts = () => {
        this.districts = [];
        // Create square districts that we know will fit
        const districtWidth = Math.sqrt(ps.DISTRICT_SIZE); // District width In grid coords
        let districtId = 0;
        for (let x = 0; x < Math.sqrt(ps.NUM_DISTRICTS); x += 1) {
            for (let y = 0; y < Math.sqrt(ps.NUM_DISTRICTS); y += 1) {
                // gridX1 etc. bound the district square in grid coords
                const gridX1 = x * districtWidth;
                const gridY1 = y * districtWidth;
                const gridX2 = (x + 1) * districtWidth;
                const gridY2 = (y + 1) * districtWidth;
                this.districts.push(new District(this, districtId, gridX1, gridY1, gridX2, gridY2));
                districtId += 1;
            }
        }
    };

    this.setCanvasDimensions = (width, height) => {
        // Needs to be more complicated to fix blurriness
        this.canvas.width = width * 2;
        this.canvas.height = height * 2;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.ctx.scale(2, 2);
    };

    this.update = () => {
        let swapsDone;
        const frameStart = window.performance.now();

        this.draw();

        for (swapsDone = 0; ; swapsDone += 1) {
            this.swapManager.swap();
            if (this.setHelpParty() === 'pause') {
                main.pause();
                return;
            }
            if (window.performance.now() - frameStart > 1000 / 30) {
                break; // If time for frame is up
            }
        }
        // console.log(`${swapsDone} swaps done this frame`);
    };

    this.draw = () => {
        this.districts.forEach((district) => {
            district.draw();
        });
        flattened(this.peopleGrid).forEach((person) => {
            person.draw();
        });
    };

    this.setHelpParty = () => {
        const numBlueDistricts = this.score.get(BLUE);
        const helpPartyBefore = ps.HELP_PARTY;
        if (numBlueDistricts === ps.TARGET_NUM_BLUE_DISTRICTS) {
            main.stopButton.hide();
            return 'pause';
        }
        ps.HELP_PARTY = (numBlueDistricts < ps.TARGET_NUM_BLUE_DISTRICTS) ? BLUE : RED;
        if (!helpPartyBefore.equalTo(ps.HELP_PARTY)) { // If changed
            for (const district of this.districts) {
                district.netAdvantage *= -1;
            }
            ps.setHinderParty();
        }
        main.stopButton.show();
        return 'good';
    };

    /** Sets score map by looping through districts. It is slow so shouldn't be used often */
    this.manuallySetScore = () => {
        this.score = new Map([[BLUE, 0], [RED, 0], [TIE, 0]]);
        for (const district of this.districts) {
            const winner = district.getWinner();
            increment(this.score, winner);
        }
    };

    this.setup();
}
