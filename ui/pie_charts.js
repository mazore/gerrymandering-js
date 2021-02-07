function PieCharts() {
    const POPULATION_X = 100;
    const DISTRICTS_X = 300;
    const CENTER_Y = 115;
    const [WIDTH, HEIGHT] = [400, 200];
    const RADIUS = 75;

    this.canvas = document.getElementById('piecharts');
    this.ctx = this.canvas.getContext('2d');
    const TOP = this.canvas.getBoundingClientRect().top;

    // Fix blurriness
    this.canvas.width = WIDTH * 2;
    this.canvas.height = HEIGHT * 2;
    this.canvas.style.width = WIDTH + "px";
    this.canvas.style.height = HEIGHT + "px";
    this.ctx.scale(2, 2);

    this.populationDragging = false;
    this.populationHovering = false;

    this.drawPopulationPieChart = function() {
        rect(this.ctx, 0, 0, WIDTH/2, HEIGHT, "#ffffff") // Clear background
        text(this.ctx, 'Population', POPULATION_X, 25, '#000', 15);
        this.drawPieSlice(BLUE, POPULATION_X, simulation.demographics, GRID_WIDTH**2);
        this.drawPieSlice(RED, POPULATION_X, simulation.demographics, GRID_WIDTH**2);
        circle(this.ctx, ...this.getPopulationDragPoint(), 5, '#ffff88', stroke='default');
    }

    this.drawDistrictsPieChart = function() {
        const score = simulation.getScore();

        rect(this.ctx, WIDTH/2, 0, WIDTH/2, HEIGHT, "#ffffff") // Clear background
        circle(this.ctx, DISTRICTS_X, CENTER_Y, RADIUS, TIE.color2);
        text(this.ctx, 'Districts', DISTRICTS_X, 25, '#000', 15);
        this.drawPieSlice(BLUE, DISTRICTS_X, score, NUM_DISTRICTS);
        this.drawPieSlice(RED, DISTRICTS_X, score, NUM_DISTRICTS);
    }

    this.drawPieSlice = function(party, centerX, map, quantity) {
        const factor = party.equalTo(RED) ? 1 : -1
        const start = -Math.PI/2
        const span = Math.PI*2 * (map.get(party) / quantity);
        const end = start + span*factor;
        arc(this.ctx, centerX, CENTER_Y, RADIUS, start, end, party.equalTo(RED), party.color1);

        if (span != 0) {
            const mid = (start + end) / 2;
            const x = centerX + Math.cos(mid) * (RADIUS * 0.5);
            const y = CENTER_Y + Math.sin(mid) * (RADIUS * 0.5);
            text(this.ctx, map.get(party), x, y)
        }
    }

    addEventListener('mousemove', function(event) {
        if (this.populationDragging) {
            let angle = Math.atan2(event.x - POPULATION_X, CENTER_Y+TOP - event.y);
            if (angle < 0) { angle += Math.PI * 2; } // Ensure positive 0 to 2pi
            const percent = angle / (Math.PI*2);

            PERCENT_BLUE = 100*(1 - percent);
            STANCE_THRESHOLD = Math.floor(NUM_PEOPLE*PERCENT_BLUE/100 - 0.5);
            for (const person of simulation.iterPeople()) {
                person.setParty();
            }

            this.drawPopulationPieChart();
            this.drawDistrictsPieChart();
            simulation.draw();

            return; // Don't need to update cursor if dragging
        }

        // Update cursor and if hovering
        const [x, y] = pieCharts.getPopulationDragPoint();
        if (distance(x, y+TOP, event.x, event.y, 15)) {
            pieCharts.populationHovering = true;
            document.body.style.cursor = 'grab';
        } else {
            pieCharts.populationHovering = false;
            document.body.style.cursor = 'default';
        }
    }.bind(this));

    this.canvas.addEventListener('mousedown', function(event) {
        // Grab if hovering
        if (this.populationHovering) {
            this.populationDragging = true;
            document.body.style.cursor = 'grabbing';
        }
    }.bind(this));

    addEventListener('mouseup', function(event) {
        // Stop grabbing
        this.populationDragging = false;
        document.body.style.cursor = 'default';
    }.bind(this));

    /** Returns a point in canvas coords that is a point to drag on the population chart */
    this.getPopulationDragPoint = function() {
        const percent = (simulation.demographics.get(BLUE) / NUM_PEOPLE);
        const angle = -Math.PI/2 + (Math.PI*2 * percent);
        const x = POPULATION_X - RADIUS*Math.cos(angle);
        const y = CENTER_Y + RADIUS*Math.sin(angle);
        return [x, y];
    }

    this.drawPopulationPieChart();
    this.drawDistrictsPieChart();
}
