/**
 * Represents a collection of people, with a line drawn around them. The winner is determined by which party has the
 * most people contained in this district
 */
function District(canvas, id, gridX1, gridY1, gridX2, gridY2) {
    this.id = id;
    // gridX1 etc. bound the district square in grid coords
    this.gridX1 = gridX1;
    this.gridY1 = gridY1;
    this.gridX2 = gridX2;
    this.gridY2 = gridY2;
    this.netAdvantage = 0; // num HELP_PARTY people minus num HINDER_PARTY people

    this.people = []; // Array of people contained
    for (let gridY = gridY1; gridY < gridY2; gridY++) {
        for (let gridX = gridX1; gridX < gridX2; gridX++) {
            const person = canvas.peopleGrid[gridY][gridX];

            this.people.push(person);
            person.district = this;
            this.netAdvantage += person.party.equalTo(HELP_PARTY) ? 1 : -1;
        }
    }

    this.getWinner = function() {
        if (this.tied()) {
            return TIE;
        }
        return this.netAdvantage > 0 ? HELP_PARTY : HINDER_PARTY;
    }

    this.draw = function() {
        // Translucent fill
        noStroke();
        const districtColor = color(this.getWinner().color);
        districtColor.setAlpha(100);
        fill(districtColor);
        for (const person of this.people) {
            rect(person.x, person.y, SQUARE_WIDTH, SQUARE_WIDTH);
        }

        // Outline
        /**
         * Edges that outline the district (the ones to draw) will only be edges of one person in the district. We add
         * up all the edges (in form 'gridX,gridY,dir') and the ones with 1 occurrence we draw.
         */
        const edgeOccurrenceMap = new Map();
        for (const person of this.people) {
            for (const edge of person.getEdges()) {
                let occurrence = edgeOccurrenceMap.get(edge);
                occurrence = occurrence == undefined ? 0 : occurrence;
                edgeOccurrenceMap.set(edge, occurrence + 1);
            }
        }
        // Draw outline
        stroke(0);
        strokeWeight(2);
        for (const [edge, occurrence] of edgeOccurrenceMap) {
            if (occurrence > 1) {
                continue;
            }
            const [gridX, gridY, dir] = edge.split(',');
            const [x, y] = [gridX * SQUARE_WIDTH, gridY * SQUARE_WIDTH];
            if (dir == 'n') {
                line(x, y, x + SQUARE_WIDTH, y);
            } else if (dir == 'w') {
                line(x, y, x, y + SQUARE_WIDTH);
            }
        }
    }

    this.tied = function() {
        return this.netAdvantage == 0;
    }

    /** Returns which party this district prioritizes swapping to another district (giving away) */
    this.idealGiveAway = function() {
        if (FAVOR_TIE) {
            if (this.tied()) {
                return null;
            }
            return this.getWinner();
        }
        if (-4 <= this.netAdvantage && this.netAdvantage <= 2) {
            return HINDER_PARTY // If flippable/at risk, try to get more HELP_PARTY people
        }
        return HELP_PARTY // If not flippable or safe HELP_PARTY, share our HELP_PARTY people
    }

    /** Returns the weight to use for this district when picking a randomized district1. Values were determined by a
    black box optimization method */
    this.getDistrict1Weight = function() {
        if (0 < this.netAdvantage && this.netAdvantage <= 2) // If at risk
            return 1
        if (this.tied())
            return 11
        if (-4 <= this.netAdvantage && this.netAdvantage <= 0) // If flippable
            return 4.35442295
        if (this.netAdvantage > 2) // If safe to help_party
            return 2.47490108
        return 2.06497273 // If safe not flippable/safe for hinder_party
    }
}
