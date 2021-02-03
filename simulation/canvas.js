/** Manages people, districts, and swapping */
function Canvas() {
    // Generate people
    this.peopleGrid = []; // 2D array of Person objects
    // Make sure people are random but equal numbers for each party
    const peoplePerParty = ceil(GRID_WIDTH ** 2 / 2);
    let parties = filledArray(BLUE, peoplePerParty).concat(filledArray(RED, peoplePerParty));
    parties = shuffled(parties);
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
    const districtWidth = sqrt(DISTRICT_SIZE) // District width In grid coords
    let personId = 0;
    for (let x = 0; x < sqrt(NUM_DISTRICTS); x++) {
        for (let y = 0; y < sqrt(NUM_DISTRICTS); y++) {
            // gridX1 etc. bound the district square in grid coords
            const gridX1 = x * districtWidth;
            const gridY1 = y * districtWidth;
            const gridX2 = (x+1) * districtWidth;
            const gridY2 = (y+1) * districtWidth;
            this.districts.push(new District(this, personId, gridX1, gridY1, gridX2, gridY2));
            personId++;
        }
    }

    this.draw = function() {
        background(255);
        for (const row of this.peopleGrid) {
            for (const person of row) {
                person.draw();
            }
        }
        for (const district of this.districts) {
            district.draw()
        }
    }

    this.getScore = function() {
        m = new Map();
        m.set(BLUE, 0);
        m.set(RED, 0);
        m.set(TIE, 0);
        for (const district of this.districts) {
            const winner = district.getWinner();
            m.set(winner, m.get(winner) + 1);
        }
        return m;
    }
}
