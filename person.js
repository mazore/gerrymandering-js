function Person(x, y, gridX, gridY, party) {
    [this.x, this.y] = [x, y];
    [this.gridX, this.gridY] = [gridX, gridY];
    this.party = party;

    this.getEdges = function() {
        // Edge are in format 'gridX,gridY,dir'. Remember dir can only be 'n' or 'w'
        const west = [this.gridX, this.gridY, 'w'].join(',');
        const north = [this.gridX, this.gridY, 'n'].join(',');
        const east = [this.gridX+1, this.gridY, 'w'].join(',');
        const south = [this.gridX, this.gridY+1, 'n'].join(',');

        const edges = [
            this.gridX == 0 ? null : west,
            this.gridY == 0 ? null : north,
            this.gridX == GRID_WIDTH-1 ? null : east,
            this.gridY == GRID_WIDTH-1 ? null : south,
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
