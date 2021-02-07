/** Manages people, districts, and swapping */
function Simulation() {
	this.swapManager = new SwapManager();

    this.canvas = document.getElementById('simulation');
    this.ctx = this.canvas.getContext('2d');

    // Fix blurriness
    this.canvas.width = SIMULATION_WIDTH*2;
    this.canvas.height = SIMULATION_WIDTH*2;
    this.canvas.style.width = SIMULATION_WIDTH + 'px';
    this.canvas.style.height = SIMULATION_WIDTH + 'px';
    this.ctx.scale(2, 2);

    this.demographics = new Map([[BLUE, 0], [RED, 0]]);

    this.generatePeople = function() {
        this.peopleGrid = []; // 2D array of Person objects
        // Make sure people are random but equal numbers for each party
        let stances = [];
        for (let i = 0; i < NUM_PEOPLE; i++) {
            stances.push(i);
        }
        stances = shuffled(stances);
        let personId = 0;
        for (let gridY = 0; gridY < GRID_WIDTH; gridY++) {
            let row = [];
            for (let gridX = 0; gridX < GRID_WIDTH; gridX++) {
                const stance = stances[gridX + gridY * GRID_WIDTH];
                row.push(new Person(this, personId, gridX, gridY, stance));
                personId++;
            }
            this.peopleGrid.push(row);
        }
    }

    this.generateDistricts = function() {
        this.districts = []
        // Create square districts that we know will fit
        const districtWidth = Math.sqrt(DISTRICT_SIZE) // District width In grid coords
        let districtId = 0;
        for (let x = 0; x < Math.sqrt(NUM_DISTRICTS); x++) {
            for (let y = 0; y < Math.sqrt(NUM_DISTRICTS); y++) {
                // gridX1 etc. bound the district square in grid coords
                const gridX1 = x * districtWidth;
                const gridY1 = y * districtWidth;
                const gridX2 = (x+1) * districtWidth;
                const gridY2 = (y+1) * districtWidth;
                this.districts.push(new District(this, districtId, gridX1, gridY1, gridX2, gridY2));
                districtId++;
            }
        }
    }

    this.update = function() {
        const frameStart = window.performance.now();

        this.draw();

        for (var swapsDone = 0; true; swapsDone++) {
            this.swapManager.swap();
            if (window.performance.now() - frameStart > 1000/30) {
                break; // If time for frame is up
            }
        }
        // console.log(`${swapsDone} swaps done this frame`)
    }

    this.draw = function() {
        for (const district of this.districts) {
            district.draw()
        }
        for (const person of this.iterPeople()) {
            person.draw();
        }
    }

	this.canvas.addEventListener('mousedown', simulationMouseDown);

    this.canvas.addEventListener('contextmenu', function(event) { // Right click
        event.preventDefault();
        simulation.swapManager.swap();
        simulation.draw();
    });

    /** Returns how many district each party has won */
    this.getScore = function() {
        map = new Map([[BLUE, 0], [RED, 0], [TIE, 0]]);
        for (const district of this.districts) {
            const winner = district.getWinner();
            map.increment(winner);
        }
        return map;
    }

    this.iterPeople = function*() {
        for (const row of this.peopleGrid) {
            for (const person of row) {
                yield person;
            }
        }
    }

    this.generatePeople();
    this.generateDistricts();
    for (const person of this.iterPeople()) {
        person.secondaryInit();
    }
    this.draw();
}
