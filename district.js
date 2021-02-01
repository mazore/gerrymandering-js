function District(canvas, gridX1, gridY1, gridX2, gridY2) {
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
        if (this.netAdvantage == 0) {
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
         * Edges that outline the district (the ones to draw) will only be
         * edges of one person in the district. We add up all the edges (in
         * form 'gridX,gridY,dir') and the ones with 1 occurrence we draw.
         */
        const edge_occurrence_map = new Map();
        for (const person of this.people) {
            for (const edge of person.getEdges()) {
                let occurrence = edge_occurrence_map.get(edge);
                occurrence = occurrence == undefined ? 0 : occurrence;
                edge_occurrence_map.set(edge, occurrence + 1);
            }
        }
        // Draw outline
        stroke(0);
        strokeWeight(2);
        for (const [edge, occurrence] of edge_occurrence_map) {
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
}
