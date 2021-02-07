/** Manages people, districts, and swapping */
function Simulation() {
    this.running = false;
	this.swapManager = new SwapManager();

    this.canvas = document.getElementById('simulation');
    this.ctx = this.canvas.getContext('2d');

    // Fix blurriness
    this.canvas.width = SIMULATION_WIDTH*2;
    this.canvas.height = SIMULATION_WIDTH*2;
    this.canvas.style.width = SIMULATION_WIDTH + 'px';
    this.canvas.style.height = SIMULATION_WIDTH + 'px';
    this.ctx.scale(2, 2);

    // Generate people
    this.peopleGrid = []; // 2D array of Person objects
    // Make sure people are random but equal numbers for each party
    const peopleCount = GRID_WIDTH ** 2
    const blueCount = Math.round(PERCENT_BLUE / 100 * peopleCount)
    const redCount = peopleCount - blueCount;
    let parties = filledArray(BLUE, blueCount).concat(filledArray(RED, redCount));
    parties = shuffled(parties)
    // Index flat array parties to get the party of a person
    let districtId = 0;
    for (let gridY = 0; gridY < GRID_WIDTH; gridY++) {
        let row = [];
        for (let gridX = 0; gridX < GRID_WIDTH; gridX++) {
            const party = parties[gridX + gridY * GRID_WIDTH];
            row.push(new Person(this, districtId, gridX, gridY, party));
            districtId++;
        }
        this.peopleGrid.push(row);
    }
    for (const row of this.peopleGrid) {
        for (const person of row) {
            person.secondaryInit();
        }
    }

    // Generate districts
    this.districts = []
    // Create square districts that we know will fit
    const districtWidth = Math.sqrt(DISTRICT_SIZE) // District width In grid coords
    let personId = 0;
    for (let x = 0; x < Math.sqrt(NUM_DISTRICTS); x++) {
        for (let y = 0; y < Math.sqrt(NUM_DISTRICTS); y++) {
            // gridX1 etc. bound the district square in grid coords
            const gridX1 = x * districtWidth;
            const gridY1 = y * districtWidth;
            const gridX2 = (x+1) * districtWidth;
            const gridY2 = (y+1) * districtWidth;
            this.districts.push(new District(this, personId, gridX1, gridY1, gridX2, gridY2));
            personId++;
        }
    }

    this.update = function() {
        this.draw();
        if (this.running) {
            const frameStart = window.performance.now();

            for (var swapsDone = 0; true; swapsDone++) {
                this.swapManager.swap();
                if (window.performance.now() - frameStart > 1000/30) {
                    break; // If time for frame is up
                }
            }
            // console.log(`${swapsDone} swaps done this frame`)
        }
    }

    this.draw = function() {
        for (const district of this.districts) {
            district.draw()
        }
        for (const row of this.peopleGrid) {
            for (const person of row) {
                person.draw();
            }
        }
    }

    addEventListener('mousedown', function(event) {
        if (event.button == 0) { // Left click
            simulation.running = !simulation.running;
        }
    });

    addEventListener('contextmenu', function(event) { // Right click
        event.preventDefault();
        simulation.swapManager.swap();
        simulation.draw();
    });

    this.getPartyNumbers = function() {
        map = new Map();
        map.set(BLUE, 0);
        map.set(RED, 0);
        for (const row of this.peopleGrid) {
            for (const person of row) {
                map.set(person.party, map.get(person.party) + 1)
            }
        }
        return map;
    }

    this.getScore = function() {
        map = new Map();
        map.set(BLUE, 0);
        map.set(RED, 0);
        map.set(TIE, 0);
        for (const district of this.districts) {
            const winner = district.getWinner();
            map.set(winner, map.get(winner) + 1);
        }
        return map;
    }
}
