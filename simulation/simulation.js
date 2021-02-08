/** Manages people, districts, and swapping */
import { shuffled } from '../helpers.js';
import ps from '../parameters.js';
import District from './district.js';
import { BLUE, RED, TIE } from './parties.js';
import Person from './person.js';
import SwapManager from './swap_manager.js';

export default function Simulation(main) {
    this.swapManager = new SwapManager(this);

    this.canvas = document.getElementById('simulation');
    this.ctx = this.canvas.getContext('2d');

    // Fix blurriness
    this.canvas.width = ps.SIMULATION_WIDTH * 2;
    this.canvas.height = ps.SIMULATION_WIDTH * 2;
    this.canvas.style.width = `${ps.SIMULATION_WIDTH}px`;
    this.canvas.style.height = `${ps.SIMULATION_WIDTH}px`;
    this.ctx.scale(2, 2);

    this.demographics = new Map([[BLUE, 0], [RED, 0]]);

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

    this.update = () => {
        let swapsDone;
        const frameStart = window.performance.now();

        this.draw();

        for (swapsDone = 0; ; swapsDone += 1) {
            this.swapManager.swap();
            if (window.performance.now() - frameStart > 1000 / 30) {
                break; // If time for frame is up
            }
        }
        // console.log(`${swapsDone} swaps done this frame`)
    };

    this.draw = () => {
        for (const district of this.districts) {
            district.draw();
        }
        for (const person of this.iterPeople()) {
            person.draw();
        }
    };

    this.canvas.addEventListener('mousedown', main.mouseDown);

    this.canvas.addEventListener('contextmenu', (event) => { // Right click
        event.preventDefault();
        this.swapManager.swap();
        this.draw();
    });

    /** Returns how many district each party has won */
    this.getScore = () => {
        const map = new Map([[BLUE, 0], [RED, 0], [TIE, 0]]);
        for (const district of this.districts) {
            const winner = district.getWinner();
            map.increment(winner);
        }
        return map;
    };

    this.iterPeople = function* () {
        for (const row of this.peopleGrid) {
            for (const person of row) {
                yield person;
            }
        }
    };

    this.generatePeople();
    this.generateDistricts();
    for (const person of this.iterPeople()) {
        person.secondaryInit();
    }
    this.draw();
}
