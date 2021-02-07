function PieCharts() {
    this.canvas = document.getElementById('piecharts');
    this.ctx = this.canvas.getContext('2d');

    // Fix blurriness
    this.canvas.width = 800;
    this.canvas.height = 400;
    this.canvas.style.width = this.canvas.width/2 + "px";
    this.canvas.style.height = this.canvas.height/2 + "px";
    this.ctx.scale(2, 2);

    this.update = function(newGrid) {
        if (newGrid) {
            this.updatePopulationPieChart();
        }
        this.updateDistrictPieChart();
    }

    this.updatePopulationPieChart = function() {
        const partyNumbers = simulation.getPartyNumbers();

        rect(this.ctx, 0, 0, 200, 200, "#ffffff") // Clear background
        text(this.ctx, 'Population', 100, 25, color='#000', size=15);
        this.drawPieSlice(BLUE, 100, partyNumbers, GRID_WIDTH**2);
        this.drawPieSlice(RED, 100, partyNumbers, GRID_WIDTH**2);
    }

    this.updateDistrictPieChart = function() {
        const score = simulation.getScore();

        rect(this.ctx, 200, 0, 200, 200, "#ffffff") // Clear background
        circle(this.ctx, 300, 120, 75, TIE.color2);
        text(this.ctx, 'Districts', 300, 25, color='#000', size=15);
        this.drawPieSlice(BLUE, 300, score, NUM_DISTRICTS);
        this.drawPieSlice(RED, 300, score, NUM_DISTRICTS);
    }

    this.drawPieSlice = function(party, centerX, map, quantity) {
        const factor = party.equalTo(RED) ? 1 : -1
        const start = -Math.PI/2
        const span = Math.PI*2 * (map.get(party) / quantity);
        const end = start + span*factor;
        arc(this.ctx, centerX, 120, 75, start, end, party.equalTo(RED), party.color1);

        if (span != 0) {
            const mid = (start + end) / 2;
            const x = centerX + Math.cos(mid) * (75 * 0.5);
            const y = 120 + Math.sin(mid) * (75 * 0.5);
            text(this.ctx, map.get(party), x, y)
        }
    }

    this.update(true);
}
