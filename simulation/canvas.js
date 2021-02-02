function Canvas() {
    // Generate people
    this.peopleGrid = []; // 2D array of Person objects
    // Make sure people are random but equal numbers for each party
    const peoplePerParty = ceil(GRID_WIDTH ** 2 / 2);
    let parties = filledArray(BLUE, peoplePerParty).concat(filledArray(RED, peoplePerParty));
    shuffleArray(parties);
    for (let gridY = 0; gridY < GRID_WIDTH; gridY++) {
        let row = [];
        for (let gridX = 0; gridX < GRID_WIDTH; gridX++) {
            const party = parties[gridX + gridY * GRID_WIDTH];
            row.push(new Person(gridX, gridY, party));
        }
        this.peopleGrid.push(row);
    }

    // Generate districts
    this.districts = []
    // Create square districts that we know will fit
    const districtWidth = sqrt(DISTRICT_SIZE) // District width In grid coords
    for (let x = 0; x < sqrt(NUM_DISTRICTS); x++) {
        for (let y = 0; y < sqrt(NUM_DISTRICTS); y++) {
            // gridX1 etc. bound the district square in grid coords
            const gridX1 = x * districtWidth;
            const gridY1 = y * districtWidth;
            const gridX2 = (x+1) * districtWidth;
            const gridY2 = (y+1) * districtWidth;
            this.districts.push(new District(this, gridX1, gridY1, gridX2, gridY2));
        }
    }

    this.draw = function() {
        for (const row of this.peopleGrid) {
            for (const person of row) {
                person.draw();
            }
        }
        for (const district of this.districts) {
            district.draw()
        }
    }
}
