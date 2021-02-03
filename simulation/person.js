/** Represents one person, who gets one vote for one party. District lines are drawn around these people */
function Person(canvas, id, gridX, gridY, party) {
    this.id = id;
    [this.gridX, this.gridY] = [gridX, gridY];
    [this.x, this.y] = [gridX * SQUARE_WIDTH, gridY * SQUARE_WIDTH]; // In pixel coordinates
    this.party = party;
    this.district = null; // Defined in District

    this.atWest = this.gridX == 0;
    this.atNorth = this.gridY == 0;
    this.atEast = this.gridX == GRID_WIDTH - 1;
    this.atSouth = this.gridY == GRID_WIDTH - 1;

    /** Called after all people are initialized */
    this.secondaryInit = function() {
        if (!this.atWest)
            this.personWest = canvas.peopleGrid[this.gridY][this.gridX - 1];
        if (!this.atNorth)
            this.personNorth = canvas.peopleGrid[this.gridY - 1][this.gridX];
        if (!this.atEast)
            this.personEast = canvas.peopleGrid[this.gridY][this.gridX + 1];
        if (!this.atSouth)
            this.personSouth = canvas.peopleGrid[this.gridY + 1][this.gridX];

        if (!this.atNorth && !this.atEast) // Northeast
            this.personNE = canvas.peopleGrid[this.gridY - 1][this.gridX + 1];
        if (!this.atSouth && !this.atEast) // Southeast
            this.personSE = canvas.peopleGrid[this.gridY + 1][this.gridX + 1];
        if (!this.atSouth && !this.atWest) // Southwest
            this.personSW = canvas.peopleGrid[this.gridY + 1][this.gridX - 1];
        if (!this.atNorth && !this.atWest) // Northwest
            this.personNW = canvas.peopleGrid[this.gridY - 1][this.gridX - 1];

        const f = item => item != null;
        // adjacentPeople - up to 4 people in direct cardinal directions
        this.adjacentPeople = [this.personWest, this.personNorth, this.personEast, this.personSouth].filter(f);
        // surroundingPeople - always length 8, includes all people in surrounding 8 squares, undefined if no person
        this.surroundingPeople = [this.personNorth, this.personNE, this.personEast, this.personSE,
                                  this.personSouth, this.personSW, this.personWest, this.personNW];
    }

    this.draw = function() {
        const w = SQUARE_WIDTH;
        noStroke();
        fill(party.color);
        rect(this.x + w/4, this.y + w/4, w/2, w/2);
    }

    /** Returns a list of districts neighboring this person, not including the district this is in */
    this.getAdjacentDistricts = function() {
        const result = [];
        for (const person of this.adjacentPeople) {
            if (this.district.id != person.district.id) {
                result.push(person.district);
            }
        }
        return result;
    }

    this.getEdges = function() {
        // Edge are in format 'gridX,gridY,dir'. Remember dir can only be 'n' or 'w'
        const edges = [
            this.atWest  ? null : `${gridX},${gridY},w`,
            this.atNorth ? null : `${gridX},${gridY},n`,
            this.atEast  ? null : `${gridX+1},${gridY},w`,
            this.atSouth ? null : `${gridX},${gridY+1},n`,
        ]
        return edges.filter(edge => edge != null);
    }

    /**
     * Returns whether the person can be removed from their district without disconnecting district
     *
     * Method: get a boolean list of whether each of the surrounding 8 people are in our district. If there are more
     * than 2 'streaks' of True's (including carrying over between start and end of the list), then removing the
     * square will cause a disconnected group because the surrounding squares are not connected to each other. This
     * works on the assumption that there are no holes, which there aren't because all districts are the same size,
     * and there are no people without a district.
     */
    this.getIsRemovable = function() {
        const boolList = [];
        for (const person of this.surroundingPeople) {
            if (person == undefined) {
                boolList.push(false);
                continue;
            }
            boolList.push(this.district.id == person.district.id);
        }
        const numTrues = boolList.count(true);
        for (const arr of boolList.concat(boolList).group()) {
            if (arr[0] && arr.length >= numTrues) {
                return true;
            }
        }
        return false;
    }

    /** Change which district this person belongs to, does not change location or party */
    this.changeDistricts = function(destination) {
        this.district.people.splice(this.district.people.indexOf(this), 1);
        this.district.netAdvantage -= this.party.equalTo(HELP_PARTY) ? 1 : -1;
        destination.people.push(this);
        destination.netAdvantage += this.party.equalTo(HELP_PARTY) ? 1 : -1;
        this.district = destination;
    }
}
