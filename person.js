function Person(gridX, gridY, party) {
    [this.gridX, this.gridY] = [gridX, gridY];
    [this.x, this.y] = [gridX * SQUARE_WIDTH, gridY * SQUARE_WIDTH]; // In pixel coordinates
    this.party = party;
    this.district = null; // Defined in District

    this.getEdges = function() {
        // Edge are in format 'gridX,gridY,dir'. Remember dir can only be 'n' or 'w'
        const edges = [
            gridX == 0            ? null : `${gridX},${gridY},w`,
            gridY == 0            ? null : `${gridX},${gridY},n`,
            gridX == GRID_WIDTH-1 ? null : `${gridX+1},${gridY},w`,
            gridY == GRID_WIDTH-1 ? null : `${gridX},${gridY+1},n`,
        ]
        return edges.filter(edge => edge != null);
    }

    this.draw = function() {
        const w = SQUARE_WIDTH;
        noStroke();
        fill(party.color);
        rect(this.x + w/4, this.y + w/4, w/2, w/2);
    }
}
