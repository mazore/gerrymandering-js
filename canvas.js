function Canvas() {
    // Generate people
    this.peopleGrid = [];
    const peoplePerParty = Math.ceil(GRID_WIDTH ** 2 / 2);
    let parties = arrayOf(peoplePerParty, BLUE).concat(arrayOf(peoplePerParty, RED));
    parties = shuffled(parties);
    for (let gridY = 0; gridY < GRID_WIDTH; gridY++) {
        let row = [];
        for (let gridX = 0; gridX < GRID_WIDTH; gridX++) {
            const [x, y] = [gridX * SQUARE_WIDTH, gridY * SQUARE_WIDTH];
            const party = parties[gridX + gridY * GRID_WIDTH];
            row.push(new Person(x, y, gridX, gridY, party));
        }
        this.peopleGrid.push(row);
    }

    // Generate districts
    this.districts = []
    const districtWidth = Math.sqrt(DISTRICT_SIZE)
    for (let x = 0; x < sqrt(NUM_DISTRICTS); x++) {
        for (let y = 0; y < sqrt(NUM_DISTRICTS); y++) {
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
